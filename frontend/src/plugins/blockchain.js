import * as Exonum from 'exonum-client'
import axios from 'axios'
import * as proto from '../../proto/stubs.js'

const TRANSACTION_URL = '/api/explorer/v1/transactions'
const PER_PAGE = 10
const SERVICE_ID = 3
const TX_TRANSFER_ID = 0
const TX_ISSUE_ID = 1
const TX_WALLET_ID = 2


const Model = Exonum.newType(proto.Model)

const shareUpdatesTransaction = new Exonum.Transaction({
  serviceId: SERVICE_ID,
  methodId: TX_TRANSFER_ID,
  schema: proto.TxShareUpdates
})



function deserializeModelTx (transaction) {
  const txTypes = [shareUpdatesTransaction]
  for (const tx of txTypes) {
    const txData = tx.deserialize(Exonum.hexadecimalToUint8Array(transaction))
    if (txData) {
      return Object.assign({}, txData.payload, {
        hash: txData.hash(),
        to: txData.payload.to ? Exonum.uint8ArrayToHexadecimal(txData.payload.to.data) : undefined
      })
    }
  }
  return { name: 'initialTx' }
}

function version_to_pubKey(version) {
  let pubKey = ''
  for(let i = 0; i < 8; ++i) {
    pubKey += (version%16).toString(16)
    version >>= 4
  }
  return pubKey.padEnd(64, '0')
}

export default {
  install (Vue) {
    Vue.prototype.$blockchain = {
      generateKeyPair () {
        return Exonum.keyPair()
      },

      generateSeed () {
        return Exonum.randomUint64()
      },

      shareUpdates (keyPair, gradients, seed) {
        const transaction = shareUpdatesTransaction.create({ gradients, seed }, keyPair).serialize()
        // Send transaction into blockchain
        return Exonum.send(TRANSACTION_URL, transaction)
      },


      getModel (version) {
        let publicKey = version_to_pubKey(version)
        return axios.get('/api/services/supervisor/consensus-config').then(response => {
          // actual list of public keys of validators
          const validators = response.data.validator_keys.map(validator => validator.consensus_key)

          return axios.get(`/api/services/crypto/v1/models/info?pub_key=${publicKey}`)
            .then(response => response.data)
            .then(({ block_proof, model_proof, model_history }) => {
              Exonum.verifyBlock(block_proof, validators)
              const tableRootHash = Exonum.verifyTable(model_proof.to_table, block_proof.block.state_hash, 'crypto.models')
              const modelProof = new Exonum.MapProof(model_proof.to_model, Exonum.MapProof.rawKey(Exonum.PublicKey), Model)
              if (modelProof.merkleRoot !== tableRootHash) throw new Error('Model proof is corrupted')

              const model = modelProof.entries.get(Exonum.publicKeyToAddress(publicKey))
              if (typeof model === undefined) throw new Error('model not found')

              const verifiedTransactions = new Exonum.ListProof(model_history.proof, Exonum.Hash)
              const hexHistoryHash = Exonum.uint8ArrayToHexadecimal(new Uint8Array(model.history_hash.data))
              if (verifiedTransactions.merkleRoot !== hexHistoryHash) throw new Error('Transactions proof is corrupted')

              const validIndexes = verifiedTransactions
                .entries
                .every(({ index }, i) => i === index)
              if (!validIndexes) throw new Error('Invalid transaction indexes in the proof')

              const transactions = model_history.transactions.map(deserializeModelTx)

              const correctHashes = transactions.every(({ hash }, i) => verifiedTransactions.entries[i].value === hash)
              if (!correctHashes) throw new Error('Transaction hash mismatch')

              return {
                block: block_proof.block,
                model: model,
                transactions: transactions
              }
            })
        })
      },

      getBlocks (latest) {
        const suffix = !isNaN(latest) ? '&latest=' + latest : ''
        return axios.get(`/api/explorer/v1/blocks?count=${PER_PAGE}${suffix}`).then(response => response.data)
      },

      getBlock (height) {
        return axios.get(`/api/explorer/v1/block?height=${height}`).then(response => response.data)
      },

      getTransaction (hash) {
        return axios.get(`/api/explorer/v1/transactions?hash=${hash}`)
          .then(response => response.data)
          .then(data => {
            data.content = deserializeModelTx(data.message)
            return data
          })
      }
    }
  }
}

