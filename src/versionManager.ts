import jsonfile from "jsonfile";
import ora from "ora";
import { ModeType } from "./types";
import * as fs from "fs";

interface VersionItem {
  version: string;
  release_time: string;
}

export default class VersionManager {
  private jsonPath: string;
  constructor(jsonPath: string) {
    this.jsonPath = jsonPath;
  }

  private async writeJsonFile(data: VersionItem[], touchFile = false) {
    if (!touchFile) {
      await fs.promises.chmod(this.jsonPath, 0o666);
    }
    await jsonfile.writeFile(this.jsonPath, data, {
      mode: 0o666,
      spaces: 2,
      EOL: "\r\n",
    });
    await fs.promises.chmod(this.jsonPath, 0o444);
  }

  async getJsonFile(): Promise<VersionItem[]> {
    const isFileExisted = await fs.promises
      .access(this.jsonPath, fs.constants.F_OK | fs.constants.R_OK)
      .then(() => true)
      .catch(() => false);
    if (!isFileExisted) {
      await this.writeJsonFile([], true);
      return [];
    }
    const list: VersionItem[] = await jsonfile.readFile(this.jsonPath);
    return list;
  }

  async checkHasVersion(prefix: string): Promise<boolean> {
    const list: VersionItem[] = await this.getJsonFile();
    return list.some((val) => val.version === prefix);
  }

  async addVersion(prefix: string): Promise<string> {
    const isHasVersion = await this.checkHasVersion(prefix);
    if (isHasVersion) {
      throw `${prefix} has been uploaded already,please check your version!`;
    }
    const spinner = ora(`Start writing json file...`).start();
    try {
      const list = await jsonfile.readFile(this.jsonPath);
      list.push({
        version: prefix,
        release_time: new Date().toLocaleString(),
      });
      await this.writeJsonFile(list);
      spinner.succeed("Write version in json file successfully.");
      return prefix;
    } catch (e: any) {
      spinner.fail(e);
      throw e;
    }
  }

  async getNeedClearVersions(
    mode: ModeType,
    maxVersionCountOfMode: number
  ): Promise<VersionItem[]> {
    const list: VersionItem[] = await jsonfile.readFile(this.jsonPath);
    const modeList = list.filter((val) => val.version.indexOf(mode) !== -1);

    const clearModeList =
      modeList.length > maxVersionCountOfMode
        ? modeList.slice(0, modeList.length - maxVersionCountOfMode)
        : [];

    return clearModeList;
  }

  async deleteVersions(dirList: VersionItem[]): Promise<VersionItem[]> {
    if (dirList.length <= 0) {
      return await this.getJsonFile();
    }
    const list = await jsonfile.readFile(this.jsonPath);
    const targetList = list.filter(
      (item: VersionItem) => !dirList.some((val) => val.version == item.version)
    );
    await this.writeJsonFile(targetList);
    return await this.getJsonFile();
  }
}
