import Oss from "../src/oss";
import config from "../.deploy.config";
const ossClient = new Oss(config.oss);

const commandWaitDelay = 100000;
describe("oss tests", () => {
  test(
    "sync assets",
    async () => {
      try {
        await ossClient.sync("./dist", "tests/");
      } catch (e) {
        expect(e).toBeNull();
      }
    },
    commandWaitDelay
  );
});
