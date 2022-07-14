import { exec, type ExecException } from 'child_process'

describe('cli', () => {
  it('should run upload command', (done: jest.DoneCallback) => {
    const script = '"node ../dist/cli.js" upload stag'
    exec(script, (error: ExecException | null, stdout: string) => {
      expect(stdout).toMatch(/success/)
      done()
    })
  })
})
