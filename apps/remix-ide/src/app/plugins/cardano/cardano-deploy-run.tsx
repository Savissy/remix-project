import React, { useState } from 'react'
import { ViewPlugin } from '@remixproject/engine-web'
import * as packageJson from '../../../../../../package.json'

const profile = {
  name: 'cardanoDeployRun',
  displayName: 'Deploy & Run (Cardano)',
  description: 'CIP-30 wallet connection, transaction build, and submit UI stubs.',
  methods: ['connectWallet', 'buildTransaction', 'submitTransaction', 'getCapabilities'],
  events: ['walletConnected', 'transactionBuilt', 'transactionSubmitted'],
  version: packageJson.version,
  maintainedBy: 'Cardano IDE',
  location: 'sidePanel',
  icon: 'fas fa-paper-plane'
}

function CardanoDeployRunView({ plugin }: { plugin: CardanoDeployRunPlugin }) {
  const [network, setNetwork] = useState('preview')
  const [wallet, setWallet] = useState('Not connected')
  const [txDraft, setTxDraft] = useState('No transaction built yet.')
  const [txHash, setTxHash] = useState('N/A')

  return (
    <div className='p-3 d-flex flex-column gap-2'>
      <h6 className='mb-0'>Deploy & Run (Cardano)</h6>
      <button className='btn btn-outline-primary' onClick={async () => setWallet(await plugin.connectWallet())}>Connect CIP-30 Wallet</button>
      <div className='small'>Wallet: <strong>{wallet}</strong></div>
      <label className='form-label mb-0'>Network</label>
      <select className='form-select' value={network} onChange={(e) => setNetwork(e.target.value)}>
        <option value='preview'>Preview</option>
        <option value='preprod'>Preprod</option>
        <option value='mainnet'>Mainnet</option>
      </select>
      <button className='btn btn-primary' onClick={async () => setTxDraft(await plugin.buildTransaction(network))}>Build Tx (Stub)</button>
      <pre className='small border rounded p-2'>{txDraft}</pre>
      <button className='btn btn-success' onClick={async () => setTxHash(await plugin.submitTransaction(network))}>Submit Tx (Stub)</button>
      <div className='small'>Tx Hash: <code>{txHash}</code></div>
    </div>
  )
}

export class CardanoDeployRunPlugin extends ViewPlugin {
  constructor() {
    super(profile)
  }

  async connectWallet() {
    const walletLabel = 'CIP-30 wallet connected (stub)'
    this.emit('walletConnected', { wallet: walletLabel })
    return walletLabel
  }

  async buildTransaction(network: string) {
    const message = `[Deploy & Run] Built unsigned transaction for ${network} (stub).`
    this.emit('transactionBuilt', { network, message })
    return message
  }

  async submitTransaction(network: string) {
    const hash = `stub_${network}_${Date.now()}`
    this.emit('transactionSubmitted', { network, hash })
    return hash
  }

  async getCapabilities() {
    return {
      walletStandard: 'CIP-30',
      networks: ['preview', 'preprod', 'mainnet'],
      supportsBuildAndSubmit: true
    }
  }

  render() {
    return <CardanoDeployRunView plugin={this} />
  }
}
