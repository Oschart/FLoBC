// Copyright 2020 The Exonum Team
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Cryptocurrency database schema.
use exonum::{
    crypto::{Hash, PublicKey},
    merkledb::{
        access::{Access, FromAccess, RawAccessMut},
        Entry, Group, MapIndex, ProofListIndex, RawProofMapIndex,
    },
    runtime::CallerAddress as Address,
};
use exonum_derive::{FromAccess, RequireArtifact};
use hex::FromHex;

// modified
use crate::{model::Model, INIT_WEIGHT, LAMBDA, MAJORITY_RATIO, MAX_SCORE_DECAY, MODEL_SIZE};
#[path = "model.rs"]
use itertools::Itertools;
use std::fs::File;
use std::io::{self, prelude::*, BufReader};
use std::process::Command;
use std::{
    convert::{TryFrom, TryInto},
    fs,
};

use colored::*;
use rand::distributions::Alphanumeric;
use rand::Rng;

use crate::get_static;
use exonum_node::VALIDATOR_ID;
use std::sync::atomic::Ordering;

const DEBUG: bool = false;

/// Database schema for the cryptocurrency.
///
/// Note that the schema is crate-private, but it has a public part.
#[derive(Debug, FromAccess)]
pub(crate) struct SchemaImpl<T: Access> {
    /// Public part of the schema.
    #[from_access(flatten)]
    pub public: Schema<T>,
    /// History for specific wallets.
    // modified
    pub model_history: Group<T, u32, ProofListIndex<T::Base, Hash>>,
    /// Trainer scores mapped by their addresses
    pub trainers_scores: MapIndex<T::Base, Address, String>,
    /// Pending transactions of the current round
    pub pending_transactions: MapIndex<T::Base, Address, Vec<u8>>,
    /// Deadline extension status (SSP)
    /// 0 -> Original deadline
    /// 1 -> Active extension
    /// 2 -> Extension expired
    pub deadline_status: Entry<T::Base, u8>,
    // Models scores for all versions
    pub model_scores: MapIndex<T::Base, Address, String>, 
    // Current minimum score
    pub model_min_score: Entry<T::Base, String>,
}

/// Public part of the cryptocurrency schema.
#[derive(Debug, FromAccess, RequireArtifact)]
#[require_artifact(name = "exonum-ML")]
pub struct Schema<T: Access> {
    /// Map of model keys to information about the corresponding account.
    // modified
    pub models: RawProofMapIndex<T::Base, Address, Model>,
    /// Lastest model Addr
    pub latest_version_addr: Entry<T::Base, Address>,
}

impl<T: Access> SchemaImpl<T> {
    pub fn new(access: T) -> Self {
        Self::from_root(access).unwrap()
    }

    pub fn _get_slack_ratio_(&self) -> f32 {
        // Calculating contributers ratio
        let num_of_trainers = (self.trainers_scores.values().count()) as f32;
        let num_of_contributers = (self.pending_transactions.values().count()) as f32;
        let slack_ratio = (num_of_trainers - num_of_contributers) / num_of_trainers;
        return slack_ratio;
    }
}

impl<T> SchemaImpl<T>
where
    T: Access,
    T::Base: RawAccessMut,
{
    // Register a trainer's identity
    pub fn register_trainer(&mut self, trainer_addr: &Address) {
        if DEBUG {
            println!("Registering {:?}...", trainer_addr);
        }

        let num_of_trainers = (self.trainers_scores.values().count() + 1) as f64;
        //let starter_score: f64 = 1.0 / (LAMBDA * num_of_trainers);
        let starter_score: f64 = 1.0 / (num_of_trainers);
        // Insert new score only if trainer wasn't registered
        if self.trainers_scores.contains(trainer_addr) == false {
            // Modify existing scores
            let mut existing_addrs: Vec<Address> = Vec::new();
            for existing_addr in self.trainers_scores.keys() {
                existing_addrs.push(existing_addr);
            }
            self.trainers_scores.clear();
            for existing_addr in existing_addrs {
                self.trainers_scores
                    .put(&existing_addr, starter_score.to_string());
            }
            // Adding new score
            self.trainers_scores
                .put(trainer_addr, starter_score.to_string());
        }
        if DEBUG {
            println!("Printing trainer addr / scores:");
            for entry in self.trainers_scores.iter() {
                println!("{:?}", entry);
            }
        }
    }

    pub fn initiate_release(&mut self) {
        if self.pending_transactions_exist() {
            // Update trainer scores
            self.update_scores();
            // Updating the most recent model using schema
            self.update_model();
            // Remove the scores file when you're done
            SchemaUtils::clear_scores_file();
        }
    }

    pub fn pending_transactions_exist(&mut self) -> bool {
        self.pending_transactions.values().count() > 0
    }

    pub fn get_deadline_status(&mut self) -> u8 {
        self.deadline_status.get().unwrap_or(0)
    }

    pub fn set_deadline_status(&mut self, status: u8) {
        self.deadline_status.set(status);
    }

    // modified
    pub fn update_model(&mut self) {
        // If there are no pending transactions, no new model should be created
        if self.pending_transactions.values().count() == 0 {
            return;
        }

        let mut latest_model: Model;
        let model_values = self.public.models.values();
        if model_values.count() == 0 {
            let version: u32 = 0;
            let version_hash = Address::from_key(SchemaUtils::pubkey_from_version(version));
            let start_score = 0.0;
            let min_score = 0.5;
            latest_model = Model::new(
                version,
                MODEL_SIZE,
                vec![INIT_WEIGHT; MODEL_SIZE as usize],
            );
            if DEBUG {
                println!("Initial Model: {:?}", latest_model);
            }
            self.public.models.put(&version_hash, latest_model);
            self.public.latest_version_addr.set(version_hash);
        }

        let version_hash = self.public.latest_version_addr.get().unwrap();
        latest_model = self.public.models.get(&version_hash).unwrap();
        if DEBUG {
            println!("Latest Model: {:?}", (&latest_model));
        };
        let mut new_model: Model = Model::new(
            (&latest_model).version + 1,
            (&latest_model).size,
            (&latest_model).weights.clone(),
        );

        // Aggregating all pending transactions
        for pending_transaction in self.pending_transactions.iter() {
            let trainer_addr = pending_transaction.0;
            let updates = SchemaUtils::byte_slice_to_float_vec(&pending_transaction.1);
            let trainer_score = self.trainers_scores.get(&trainer_addr).unwrap();
            let tw_f32 = trainer_score.parse::<f32>().unwrap();
            new_model.aggregate(&updates, tw_f32);
        }
        self.pending_transactions.clear();

        let new_version = new_model.version;
        let new_version_hash = Address::from_key(SchemaUtils::pubkey_from_version(new_version));

        let new_model_score = SchemaUtils::evaluate_model(&(&new_model).weights);
        self.model_scores.put(&new_version_hash, new_model_score.to_string());
        self.model_min_score.set((new_model_score * MAX_SCORE_DECAY).to_string());

        if DEBUG {
            println!("Created New Model: {:?}", new_model);
        }

        SchemaUtils::print_model_meta(&new_model, new_model_score);
        self.public.models.put(&new_version_hash, new_model);
        self.public.latest_version_addr.set(new_version_hash);
    }

    pub fn cache_update(&mut self, trainer_addr: &Address, updates: &Vec<f32>) {
        // NOTE: Overwrite latest model update
        self.pending_transactions.put(
            &trainer_addr,
            SchemaUtils::float_vec_to_byte_slice(&updates),
        );
    }

    pub fn get_slack_ratio(&mut self) -> f32 {
        // Calculating contributers ratio
        let num_of_trainers = (self.trainers_scores.values().count()) as f32;
        let num_of_contributers = (self.pending_transactions.values().count()) as f32;
        let slack_ratio = (num_of_trainers - num_of_contributers) / num_of_trainers;
        return slack_ratio;
    }

    pub fn check_pending(&mut self, trainer_addr: &Address, updates: &Vec<f32>) -> bool {
        if self.pending_transactions.contains(trainer_addr) {
            return false;
        } else {
            self.pending_transactions.put(
                &trainer_addr,
                SchemaUtils::float_vec_to_byte_slice(&updates),
            );

            // Calculating contributers ratio
            let num_of_trainers = (self.trainers_scores.values().count()) as f32;
            let num_of_contributers = (self.pending_transactions.values().count()) as f32;
            let ratio = num_of_contributers / num_of_trainers;
            if ratio >= MAJORITY_RATIO {
                return true;
            } else {
                return false;
            }
        }
    }

    pub fn update_scores(&mut self) -> Option<i32> {
        // Get latest model
        let version_hash = self.public.latest_version_addr.get()?;
        let latest_model_score: f32 = self.model_scores.get(&version_hash).unwrap().parse::<f32>().unwrap();

        let val_id: u16 = get_static!(VALIDATOR_ID);
        let score_filename: String = format!("v{}_scores.txt", val_id);
        let file = File::open(&score_filename).unwrap();
        let reader = BufReader::new(file);
        for line in reader.lines() {
            let uline: String = line.unwrap();
            let delim_pos = uline.find(':').unwrap();

            let trainer_addr_str: String = uline.chars().take(delim_pos).collect();
            let pub_key = PublicKey::from_hex(trainer_addr_str).unwrap();

            let trainer_addr: Address = Address::from_key(pub_key);

            let val_score: String = uline.chars().skip(delim_pos + 1).collect();
            let val_score: f32 = val_score.parse::<f32>().unwrap();

            let delta: f32 = val_score - latest_model_score;

            let curr_score = self.trainers_scores.get(&trainer_addr).unwrap();
            let curr_score = curr_score.parse::<f32>().unwrap();

            let new_trainer_score = curr_score + delta;

            // Update trainer score
            self.trainers_scores
                .put(&trainer_addr, new_trainer_score.to_string());

            println!(
                "Trainer <{:?}>, prev_score={}, val_score={}, new_score={}, delta={}",
                trainer_addr, curr_score, val_score, new_trainer_score, delta
            );
        }

        return Some(0);
    }
}

/// Schema Helpers
#[derive(Debug)]
pub struct SchemaUtils {}

impl SchemaUtils {
    /// Transform version number into public key
    pub fn pubkey_from_version(version: u32) -> PublicKey {
        let mut byte_array: [u8; 32] = [0 as u8; 32];
        let _2b = version.to_be_bytes();
        for i in 0..4 as usize {
            byte_array[i] = _2b[i];
        }

        return PublicKey::new(byte_array);
    }
    /// float_vec_to_byte_slice
    pub fn float_vec_to_byte_slice<'a>(floats: &Vec<f32>) -> Vec<u8> {
        unsafe {
            std::slice::from_raw_parts(floats.as_ptr() as *const _, (MODEL_SIZE * 4) as usize)
                .to_vec()
        }
    }
    /// byte_slice_to_float_vec
    pub fn byte_slice_to_float_vec<'a>(bytes: &Vec<u8>) -> Vec<f32> {
        unsafe {
            std::slice::from_raw_parts(bytes.as_ptr() as *const f32, MODEL_SIZE as usize).to_vec()
        }
    }

    /// Computes model score
    pub fn evaluate_model(model_weights: &Vec<f32>) -> f32 {
        let ids: Vec<f32> = model_weights.clone();
        let weights_str = ids.iter().join("|");

        let tempfile_name: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(10)
            .collect::<String>();

        let tempfile_name: String = format!("{}.txt", tempfile_name);

        let tempfile_path: String = format!("../tx_validator/dist/{}", tempfile_name);

        {
            fs::write(&tempfile_path, weights_str).expect("Unable to write file");
        }

        let output = Command::new("python")
            .arg("evaluation_wrapper.py")
            .arg(tempfile_name)
            .current_dir("../tx_validator/src")
            .output()
            .expect("failed to execute process");

        {
            fs::remove_file(&tempfile_path).expect("Unable to delete file");
        }

        if DEBUG {
            println!("OUTPUT => {:?}", output);
        }

        let output_str: String = String::from_utf8_lossy(&output.stdout).to_string();

        let start_bytes = output_str.find("RETURN").unwrap_or(0) + "RETURN".len();

        let end_bytes = output_str.find("ENDRETURN").unwrap_or(output_str.len());

        let score_str: String = output_str[start_bytes..end_bytes].to_string();

        let score = score_str.parse::<f32>().unwrap();
        return score;
    }

    /// Formats and prints model metadata
    pub fn print_model_meta(model: &Model, new_score: f32) {
        let version = format!("{}", model.version);
        let accr = format!("{}", new_score * 100.0);
        println!("{}", "---------------------------------------");
        println!(
            "{}: {}= {} \t {}= {}%",
            "New Model Created:".cyan().bold(),
            "version".white().bold(),
            version.magenta().bold(),
            "accuracy".white().bold(),
            accr.green()
        );
        println!("{}", "---------------------------------------");
    }

    fn clear_scores_file() {
        let val_id: u16 = get_static!(VALIDATOR_ID);
        let score_filename: String = format!("v{}_scores.txt", val_id);
        fs::remove_file(&score_filename).expect("Unable to delete scores file");
    }
}
