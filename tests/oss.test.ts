import Oss from "../src/oss";
import config from "../.deploy.config.js";
const ossClient = new Oss(config.oss);
describe("oss tests", () => {
  test("sync assets", () => {
    ossClient.sync("./dist");
  });
});
