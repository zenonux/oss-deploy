import path from "path";
import { OssDeploy } from "../src/index";
import { readJsonFile } from "../src/util";
import { Options } from "../src/types";
const config = readJsonFile("../deploy.config.json", __dirname);
const rootPath = process.cwd()
const ossConfig = readJsonFile(config.ossConfigPath, rootPath);
const options = {
  distPath: path.resolve(rootPath, config.distPath),
  distFilterOptions: config.distFilterOptions,
  ...ossConfig,
};
const client = new OssDeploy(options as Options);

describe("oss-deploy", () => {
  it("upload oss-deploy/test/stag@1.0.0", async () => {
    const promise = client.uploadAssets(
      "oss-deploy",
      "test",
      "stag",
      "1.0.0",
      true
    );
    await expect(promise).resolves.not.toThrow();
  });
  it("upload /test/stag@1.0.0", async () => {
    const promise = client.uploadAssets(
      "",
      "test",
      "stag",
      "1.0.0",
      true
    );
    await expect(promise).resolves.not.toThrow();
  });
});
