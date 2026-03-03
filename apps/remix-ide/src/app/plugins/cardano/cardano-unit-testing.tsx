import React, { useState } from 'react'
import { ViewPlugin } from '@remixproject/engine-web'
import * as packageJson from '../../../../../../package.json'

const profile = {
  name: 'cardanoUnitTesting',
  displayName: 'Unit Testing',
  description: 'Run contract unit tests and show a results tree (stub).',
  methods: ['runTests', 'getCapabilities'],
  events: ['testsStarted', 'testsCompleted'],
  version: packageJson.version,
  maintainedBy: 'Cardano IDE',
  location: 'sidePanel',
  icon: 'fas fa-vial'
}

type TestResult = {
  suite: string
  status: 'pass' | 'fail'
  tests: string[]
}

function UnitTestingView({ plugin }: { plugin: CardanoUnitTestingPlugin }) {
  const [results, setResults] = useState<TestResult[]>([])

  const run = async () => {
    const data = await plugin.runTests()
    setResults(data)
  }

  return (
    <div className='p-3 d-flex flex-column gap-2'>
      <h6 className='mb-0'>Unit Testing (Stub)</h6>
      <button className='btn btn-primary' onClick={run}>Run Tests</button>
      <div className='small text-muted'>Results Tree</div>
      <div className='border rounded p-2'>
        {results.length === 0 ? <div className='small'>No test run yet.</div> : null}
        {results.map((suite) => (
          <div key={suite.suite} className='mb-2'>
            <div><strong>{suite.suite}</strong> - {suite.status.toUpperCase()}</div>
            <ul className='small mb-0'>
              {suite.tests.map((test) => <li key={test}>{test}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export class CardanoUnitTestingPlugin extends ViewPlugin {
  constructor() {
    super(profile)
  }

  async runTests() {
    this.emit('testsStarted')
    const results: TestResult[] = [
      { suite: 'Compiler integration', status: 'pass', tests: ['builds sample Aiken contract']},
      { suite: 'Wallet interaction', status: 'pass', tests: ['connect CIP-30 wallet stub']}
    ]
    this.emit('testsCompleted', results)
    return results
  }

  async getCapabilities() {
    return {
      supportsTreeResults: true,
      supportsCoverage: false
    }
  }

  render() {
    return <UnitTestingView plugin={this} />
  }
}
