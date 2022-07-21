import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
const execPromise = promisify(exec);

describe("cli", () => {
  it("upload stag", async () => {
    try {
      await execPromise(
        `node ${path.resolve(__dirname, "../dist/cli.js")} upload stag`
      );
    } catch (err) {
      expect((err as any).stderr).toContain(
        "name is not correct. example:test"
      );
    }
  });
});
