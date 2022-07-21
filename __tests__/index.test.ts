import path from "path";
import { OssDeploy } from "../src/index";
import { readJsonFile } from "../src/util";
import { Options } from "../src/types";
const config = readJsonFile("../deploy.config.json", __dirname);
const rootPath = path.dirname("../deploy.config.json");
const ossConfig = readJsonFile(config.ossConfigPath);
const options = {
  distPath: path.resolve(rootPath, config.distPath),
  distFilterOptions: config.distFilterOptions,
  ...ossConfig,
};
const client = new OssDeploy(options as Options);
describe("oss-deploy", () => {
  it("upload oss-deploy/test/stag@1.0.0", async () => {
    const consoleSpy = jest.spyOn(console,'log');
    await client.uploadAssets("oss-deploy", "test", "stag", "1.0.0", true);
    expect(consoleSpy).toHaveBeenCalledWith("success");
  });
});
