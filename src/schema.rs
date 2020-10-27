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
    crypto::Hash,
    merkledb::{
        access::{Access, FromAccess, RawAccessMut},
        Group, ObjectHash, ProofListIndex, RawProofMapIndex,
    },
    runtime::CallerAddress as Address,
};
use exonum_derive::{FromAccess, RequireArtifact};

// modified
use crate::{model::Model};

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
    pub models: RawProofMapIndex<T::Base, u32, Model>,
}

impl<T: Access> SchemaImpl<T> {
    pub fn new(access: T) -> Self {
        Self::from_root(access).unwrap()
    }
    // modified
    pub fn wallet(&self, version: u32) -> Option<Model> {
        // modified
        self.public.models.get(&version)
    }
}

impl<T> SchemaImpl<T>
where
    T: Access,
    T::Base: RawAccessMut,
{
    // modified
    pub fn update_weights(&mut self, updates: Vec<Vec<f32>>){
        let latest_model : Model; 
        let model_keys = self.public.models.keys();
        if model_keys.isEmpty() {
            
            latest_model = Model::new();
        }
        for i in 0..model.size as usize {
            model.aggregate(updates[i]);
        }
    }

}
