import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
const execPromise = promisify(exec);

describe("cli", () => {

  it("should upload oss-deploy/test/stag@1.0.0", async () => {
    try {
      await execPromise(
        `node ${path.resolve(__dirname, "../dist/cli.js")} upload stag -c ./deploy.config.json`
      );
    } catch (err) {
      expect((err as any).stderr).toContain(
        "stag@1.0.0 of test has already exist,please check your version!"
      );
    }
  });
});
