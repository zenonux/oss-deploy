import log from "./log";
import VersionManager from "./versionManager";
import AliOSS from "./oss";
import Server from "./server";
import inquirer from "inquirer";
import { Config, ModeType } from "./types";
import Joi from "joi";

export default class Aod {
  private config: Config;
  private oss;
  private server;
  private versionManager;

  constructor(opts: Config) {
    this.config = this.validateConfig(opts);
    this.oss = new AliOSS(this.config.oss, this.config.distPath);
    this.server = new Server(this.config.distPath);
    this.versionManager = new VersionManager(this.config.jsonPath);
  }

  public async uploadAssetsAndHtml(
    mode: ModeType,
    version: string
  ): Promise<void> {
    const serverConfig = this.config[mode];
    const prefix = this.config.oss.prefix(mode, version);

    const isHasVersion = await this.versionManager.checkHasVersion(prefix);
    if (isHasVersion) {
      throw new Error(
        `${prefix} has been uploaded already,please check your version!`
      );
    }

    // releasing production version needs confirm operation
    if (mode == "prod") {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "release",
          message: `confirm releasing ${prefix}?`,
          default: false,
        },
      ]);
      if (!answer.release) {
        throw new Error(`releasing ${prefix} has been cancelled.`);
      }
    }

    await this.oss.uploadAssets(prefix);
    await this.server.uploadHtml(serverConfig);
    await this.versionManager.addVersion(prefix);

    // need  clear version warning
    const dirList = await this.versionManager.getNeedClearVersions(
      mode,
      this.config.maxVersionCountOfMode
    );
    if (dirList.length >= this.config.maxVersionCountOfMode) {
      log.warn(
        `Static assets in ${mode} environment already has ${dirList.length} versions,please clear unused versions regularly.`
      );
    }
  }

  public async clearAssets(mode: ModeType): Promise<undefined | void> {
    const prefixList = await this.versionManager.getNeedClearVersions(
      mode,
      this.config.maxVersionCountOfMode
    );
    if (prefixList.length <= 0) {
      log.warn("No assets need to clear.");
      return;
    }
    // clearing production assets needs confirm operation
    if (mode == "prod") {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "release",
          message: `confirm clearing unused assets?`,
          default: false,
        },
      ]);
      if (!answer.release) {
        log.warn(`clearing assets has been cancelled.`);
        return;
      }
    }
    const isSuccess = await this.oss.clearAllUnNeedAssests(prefixList);
    if (!isSuccess) {
      return;
    }
    await this.versionManager.deleteVersions(prefixList);
  }

  private validateConfig(opts: Config): Config {
    const schema = Joi.object({
      distPath: Joi.string().default("./dist"),
      jsonPath: Joi.string().default("./deploy.version.json"),
      maxVersionCountOfMode: Joi.number().default(5),
      oss: Joi.object({
        accessKeyId: Joi.string().required(),
        accessKeySecret: Joi.string().required(),
        region: Joi.string().required(),
        bucket: Joi.string().required(),
        prefix: Joi.function().arity(2).required(),
      })
        .unknown(true)
        .required(),
      stag: Joi.object({
        host: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        serverPath: Joi.string().required(),
      }).unknown(true),
      prod: Joi.object({
        host: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        serverPath: Joi.string().required(),
      })
        .unknown(true)
        .required(),
    }).unknown(true);
    const validateRes = schema.validate(opts);
    if (validateRes.error) {
      console.error(validateRes.error);
      process.exit();
    }
    return validateRes.value;
  }
}
