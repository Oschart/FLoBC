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
        Group, ObjectHash, ProofListIndex, RawProofMapIndex, MapIndex,
    },
    runtime::CallerAddress as Address,
};
use exonum_derive::{FromAccess, RequireArtifact};

// modified
use crate::{  INIT_WEIGHT, MODEL_SIZE, model::Model };
#[path="model.rs"]

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
}

/// Public part of the cryptocurrency schema.
#[derive(Debug, FromAccess, RequireArtifact)]
#[require_artifact(name = "exonum-cryptocurrency")]
pub struct Schema<T: Access> {
    /// Map of model keys to information about the corresponding account.
    // modified
    pub models: RawProofMapIndex<T::Base, Address, Model>,
}

impl<T: Access> SchemaImpl<T> {
    pub fn new(access: T) -> Self {
        Self::from_root(access).unwrap()
    }
 
}

impl<T> SchemaImpl<T>
where
    T: Access,
    T::Base: RawAccessMut,
{
    // modified
    pub fn update_weights(&mut self, updates: Vec<Vec<f32>>){
        let mut latest_model : Model;
        let model_values = self.public.models.values();
        if model_values.count() == 0 {
            let version: u32 = 0;
            
            let versionHash = Address::from_key(PublicKey::new(self.byte_array_from_version(version)));
            latest_model = Model::new(version, MODEL_SIZE, vec![INIT_WEIGHT; MODEL_SIZE as usize]);
            self.public.models.put(&versionHash, latest_model);
        }

        latest_model = self.public.models.values().last().unwrap();

        let mut new_model: Model = Model::new(
            latest_model.version+1,
            latest_model.size,
            latest_model.weights.clone(),
        );
        for i in 0..updates.len() as usize {
            new_model.aggregate(&updates[i]);
        }

        let new_version = new_model.version;
        let new_versionHash = Address::from_key(PublicKey::new(self.byte_array_from_version(new_version)));
        self.public.models.put(&new_versionHash, new_model);
    }

    pub fn byte_array_from_version(&self, version: u32) -> [u8; 32] {
        let mut byte_array: [u8; 32] = [0 as u8; 32];
        let _2b = version.to_be_bytes();
        for i in 0..4 as usize {
            byte_array[i] = _2b[i];
        }

        return byte_array;
    }
}
