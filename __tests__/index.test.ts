import { Options } from "../src/types";
import { OssDeploy } from "../src/index";
import { readJsonFile } from "../src/util";
import path from "path";
const ossConfig = readJsonFile("../oss-config.json", __dirname);
const opts = {
  distPath: path.resolve("../dist", __dirname),
  distFilterOptions: {},
  ...ossConfig,
};
const client = new OssDeploy(opts as Options);

describe("oss-deploy", () => {
  it("should upload oss-deploy/test/stag@2.0.0 success", async () => {
    await expect(
      client.uploadAssets("oss-deploy", "test", "stag", "2.0.0", true)
    ).resolves.not.toThrow();
  });

  it("should upload test/stag@2.0.0 success", async () => {
    await expect(
      client.uploadAssets("", "test", "stag", "2.0.0", true)
    ).resolves.not.toThrow();
  });
});
