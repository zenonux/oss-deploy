import OssdDeploy from "../src/index";
import config from "../.deploy.config";
const client = new OssdDeploy(config);

const commandWaitDelay = 100000;

describe("cli tests", () => {
  test(
    "upload test-stag@0.1.0",
    async () => {
      try {
        await client.uploadAssets("test", "stag", "0.4.22");
      } catch (e) {
        expect(e).toBeNull();
      }
    },
    commandWaitDelay
  );
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
