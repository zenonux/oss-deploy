import OssdDeploy from "../src/index";
import { OssOptions } from "../src/types";
import { readJsonFile } from "../src/util";

const ossConfig = readJsonFile("./oss-config.json");
const client = new OssdDeploy({
  distPath: "./dist",
  distFilterOptions: {},
  packageJsonPath: "../package.json",
  ossConfigPath: "./oss-config.json",
  ...(ossConfig as OssOptions),
});

describe("cli tests", () => {
  test("upload test-stag@0.1.0", async () => {
    try {
      await client.uploadAssets("test", "stag", "0.4.23", false);
    } catch (e) {
      expect(e).toBeNull();
    }
  });
  // test(
  //   "clear test-stag",
  //   async () => {
  //     try {
  //       await client.clearAssets("stag");
  //     } catch (e) {
  //       expect(e).toBeNull();
  //     }
  //   },
  //   commandWaitDelay
  // );
});
