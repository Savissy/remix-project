import React, { useState } from 'react'
import { ViewPlugin } from '@remixproject/engine-web'
import * as packageJson from '../../../../../../package.json'

const profile = {
  name: 'cardanoCompiler',
  displayName: 'Cardano Compiler',
  description: 'Compile Aiken, Plutus, and Helios contracts (stub).',
  methods: ['build', 'setLanguage', 'getState', 'getCapabilities'],
  events: ['buildStarted', 'buildCompleted', 'diagnosticsUpdated'],
  version: packageJson.version,
  maintainedBy: 'Cardano IDE',
  location: 'sidePanel',
  icon: 'fas fa-hammer'
}

const LANGUAGES = ['Aiken', 'Plutus', 'Helios']

function CardanoCompilerView({ plugin }: { plugin: CardanoCompilerPlugin }) {
  const [language, setLanguage] = useState('Aiken')
  const [output, setOutput] = useState('Ready to build Cardano contracts.')
  const [diagnostics, setDiagnostics] = useState<string[]>([])

  const onBuild = async () => {
    await plugin.setLanguage(language)
    const result = await plugin.build()
    setOutput(result.output)
    setDiagnostics(result.diagnostics)
  }

  return (
    <div className='p-3 h-100 d-flex flex-column gap-2'>
      <h6 className='mb-0'>Cardano Compiler (Stub)</h6>
      <label className='form-label mb-0'>Language</label>
      <select className='form-select' value={language} onChange={(e) => setLanguage(e.target.value)}>
        {LANGUAGES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <button className='btn btn-primary' onClick={onBuild}>Build</button>
      <div className='small text-muted'>Output Console</div>
      <pre className='small border rounded p-2 flex-grow-1 overflow-auto'>{output}</pre>
      <div className='small text-muted'>Diagnostics</div>
      <ul className='small mb-0'>
        {diagnostics.map((diag, index) => <li key={`${diag}-${index}`}>{diag}</li>)}
      </ul>
    </div>
  )
}

export class CardanoCompilerPlugin extends ViewPlugin {
  private selectedLanguage = 'Aiken'

  constructor() {
    super(profile)
  }

  async setLanguage(language: string) {
    this.selectedLanguage = language
  }

  async build() {
    this.emit('buildStarted', { language: this.selectedLanguage })
    const diagnostics = [`${this.selectedLanguage} build completed (stub).`, 'No blocking diagnostics.']
    const output = `[Cardano Compiler] Building ${this.selectedLanguage} artifacts...\n[stub] Build complete.`
    this.emit('diagnosticsUpdated', diagnostics)
    this.emit('buildCompleted', { language: this.selectedLanguage, diagnostics, output })
    return { diagnostics, output }
  }

  async getState() {
    return { selectedLanguage: this.selectedLanguage }
  }

  async getCapabilities() {
    return {
      supportsIncrementalBuild: true,
      supportsDiagnostics: true,
      supportedLanguages: LANGUAGES
    }
  }

  render() {
    return <CardanoCompilerView plugin={this} />
  }
}
