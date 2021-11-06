import OSS from "ali-oss";
import ora from "ora";
import log from "./log";
import path from "path";
import readdirp from "readdirp";
import inquirer from "inquirer";
import { OssConfig, VersionItem } from "./types";
import { intersection, difference } from "lodash";

export default class Oss {
  private distPath: string;
  private prefix: string;
  private client;
  constructor(config: OssConfig, distPath?: string) {
    this.distPath = distPath || "";
    this.prefix = config.prefix || "";
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    });
  }

  // sync local dir and oss syncPath
  async sync(dir: string): Promise<void> {
    const localFiles = await this.getLocalFiles(dir);
    const remoteFiles = await this.getAllFilesInOssDir();
    // 过滤服务器上存在的文件
    const alreadyExitFiles = intersection(localFiles, remoteFiles);
    const newFiles = difference(localFiles, alreadyExitFiles);
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "release",
        message: `confirm sync ${dir} to oss ${this.prefix}?`,
        default: false,
      },
    ]);
    if (!answer.release) {
      log.warn(`sync assets has been cancelled.`);
      return;
    }
    await this.uploadFiles(dir, newFiles);
    alreadyExitFiles.forEach((val) => {
      log.warn(`${val} is already in oss.`);
    });
  }

  private async getLocalFiles(dir: string) {
    const dirPath = path.resolve(dir);
    const files = await readdirp.promise(dirPath);
    return files.map((val) => val.path);
  }

  private async uploadFiles(dir: string, files: string[]) {
    const spinner = ora(`Start sync assets...`).start();
    for await (const file of files) {
      try {
        const fullPath = path.resolve(dir, file);
        const prefixPath = this.prefix + "/" + file;
        await this.client.put(prefixPath.replace("\\", "/"), fullPath);
      } catch (e: any) {
        spinner.fail();
        throw new Error(e);
      }
    }
    spinner.succeed(`sync assets succeed.`);
  }

  private async getAllFilesInOssDir() {
    const result = await this.client.list(
      {
        prefix: this.prefix,
        "max-keys": 1000,
      },
      {}
    );
    return result.objects.map((val) => val.url);
  }

  async uploadAssets(prefix: string): Promise<void> {
    const spinner = ora(`Start deploying ${prefix} assets...`).start();
    const dirPath = path.resolve(this.distPath);
    for await (const entry of readdirp(dirPath)) {
      try {
        const { fullPath } = entry;
        const relativePath = path.relative(dirPath, fullPath);
        const prefixPath = prefix + "/" + relativePath;
        await this.client.put(prefixPath.replace("\\", "/"), fullPath);
      } catch (e: any) {
        spinner.fail();
        throw new Error(e);
      }
    }
    spinner.succeed(`Deploy ${prefix} assets succeed.`);
  }

  async handleDel(name: string): Promise<any> {
    try {
      await this.client.delete(name);
    } catch (error: any) {
      error.failObjectName = name;
      return error;
    }
  }

  async deleteAssets(prefix: string): Promise<boolean> {
    if (!prefix) {
      return false;
    }
    const spinner = ora(`Start removing ${prefix} assest...`).start();
    try {
      const list = await this.client.list(
        {
          prefix: prefix,
          "max-keys": 100,
        },
        {}
      );
      list.objects = list.objects || [];
      await Promise.all(list.objects.map((v) => this.handleDel(v.name)));
      spinner.succeed(`Remove ${prefix} assets succeed.`);
      return true;
    } catch (e: any) {
      spinner.fail(e);
      return false;
    }
  }

  async clearAllUnNeedAssests(dirList: VersionItem[]): Promise<boolean> {
    if (dirList.length <= 0) {
      return false;
    }
    const dirStr = dirList.map((val) => val.version).join(",");
    log.warn("Need clear versions:" + dirStr);
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "clear",
        message: `Confirm to clear ${dirStr} static assets?`,
        default: false,
      },
    ]);
    if (!answer.clear) {
      log.warn(`Clear ${dirStr} assets has been cancelled.`);
      return false;
    }
    for await (const dir of dirList) {
      const isDel = await this.deleteAssets(dir.version);
      if (!isDel) {
        return false;
      }
    }
    return true;
  }
}
