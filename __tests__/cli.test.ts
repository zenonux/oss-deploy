import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
const execPromise = promisify(exec)

describe('cli', () => {
  it('should run upload command', async () => {
    const [err] = await execPromise(
      `node ${path.resolve(__dirname, '../dist/cli.js')} upload stag`
    )
      .then(() => [null])
      .catch((e) => [e])
    expect(err).not.toBeNull()
  })
})
