import { Options, ModeType } from "./types";
import BucketManagerFactory from "./bucket";
import { validateUploadOptions } from "./util";
import compareVersions from "compare-versions";

export const generatePrefix = (
  ossPrefix: string,
  name: string,
  mode: ModeType,
  version: string
): string => {
  return ossPrefix + "/" + name + "/" + mode + "@" + version + "/";
};

export class OssDeploy {
  private _oss;
  private _distPath;
  private _distFilterOptions;
  private _versions: string[] = [];
  constructor(options: Options) {
    options = this._validateOptions(options);
    const { distPath, distFilterOptions, ...ossOptions } = options;
    this._distPath = distPath;
    this._distFilterOptions = distFilterOptions;
    this._oss = BucketManagerFactory.create(ossOptions);
  }

  async uploadAssets(
    ossPrefix = "",
    name: string,
    mode: ModeType,
    version: string,
    isForce: boolean
  ): Promise<void> {
    const [err] = validateUploadOptions(ossPrefix, name, mode, version);
    if (err) {
      throw new Error(err);
    }
    const prefix = generatePrefix(ossPrefix, name, mode, version);
    this._versions = await this._oss.listRemoteDirectory(
      ossPrefix + '/' + name + "/"
    );
    if (
      !isForce &&
      this._versions.length > 0 &&
      this._versions.some((v) => v === prefix)
    ) {
      throw new Error(
        `${mode}@${version} of ${name} has already exist,please check your version!`
      );
    }
    await this._oss.uploadLocalDirectory(
      prefix,
      this._distPath,
      this._distFilterOptions
    );
    this._versions.push(prefix);
    console.info(`upload ${prefix} success.`);
    await this._clearAssets(ossPrefix, name, mode);
  }

  private async _clearAssets(ossPrefix: string, name: string, mode: ModeType) {
    const list = this._getNeedClearVersionList(ossPrefix, name, mode);
    if (list.length <= 0) {
      return;
    }
    for await (const prefix of list) {
      console.info(`clear ${prefix} start...`);
      await this._oss.clearRemoteDirectory(prefix);
      console.info(`clear ${prefix} end.`);
    }
  }

  private _getNeedClearVersionList(
    ossPrefix: string,
    name: string,
    mode: ModeType
  ) {
    const modeVerStr = name + "/" + mode;
    const modeVersions = this._versions.filter(
      (v) => v.indexOf(modeVerStr) !== -1
    );

    // 超过10个版本清理一次,仅保留最近5个版本
    if (modeVersions.length > 10) {
      // 从小到大排序
      const versions = modeVersions.map(
        (val) => val.split("@")[1].split("/")[0]
      );
      const sorted = versions.sort((a, b) => compareVersions(b, a));
      const needClearList = sorted.slice(5);
      return needClearList.map((v) => generatePrefix(ossPrefix, name, mode, v));
    }
    return [];
  }

  private _validateOptions(opts: Options): Options {
    const fields = ["distPath", "SecretId", "SecretKey", "Region", "Bucket"];
    fields.forEach((val) => {
      if (!opts[val as keyof Options]) {
        throw new Error(`${val} is required.`);
      }
    });
    return opts;
  }
}
