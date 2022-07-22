import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
const execPromise = promisify(exec);

const cli = (argv: string) => {
  return execPromise(
    `node ${path.resolve(__dirname, "../dist/cli.js")} ${argv}`
  )
    .then((data) => [null, data])
    .catch((e) => [e.stderr]);
};

describe("cli", () => {
  it("should upload oss-deploy/test/stag@1.0.0 fail", async () => {
    const [err] = await cli("upload stag -c ./deploy.config.json");
    expect(err).toContain(
      "stag@1.0.0 of test has already exist,please check your version!"
    );
  });
});
