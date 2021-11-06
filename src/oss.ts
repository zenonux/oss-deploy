import OSS from "ali-oss";
import ora from "ora";
import log from "./log";
import path from "path";
import readdirp from "readdirp";
import inquirer from "inquirer";
import { OssConfig, VersionItem } from "./types";
import { intersectionWith, difference } from "lodash";

export default class Oss {
  private distPath: string;
  private client;
  constructor(config: OssConfig, distPath?: string) {
    this.distPath = distPath || "";
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    });
  }

  private getTargetFilePath(filePath: string, prefix: string) {
    return prefix.charAt(prefix.length - 1) === "/"
      ? prefix + filePath
      : prefix + "/" + filePath;
  }

  private async getLocalFilesPath(dir: string) {
    const dirPath = path.resolve(dir);
    const files = await readdirp.promise(dirPath);
    return files.map((val) => val.path);
  }

  private async getFilesPathByPrefix(prefix: string) {
    const result = await this.client.list(
      {
        prefix: prefix,
        "max-keys": 1000,
      },
      {}
    );
    return result.objects
      ? result.objects.map((val) => val.url.split(".com/")[1])
      : [];
  }

  async sync(dir: string, prefix: string): Promise<void> {
    const localFilesPath = await this.getLocalFilesPath(dir);
    const remoteFilesPath = await this.getFilesPathByPrefix(prefix);
    // 过滤oss存在的文件
    const alreadyExitFiles = intersectionWith(
      localFilesPath,
      remoteFilesPath,
      (localFile, remoteFile) => {
        return this.getTargetFilePath(localFile, prefix) === remoteFile;
      }
    );
    const newFiles = difference(localFilesPath, alreadyExitFiles);
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "release",
        message: `上传本地${dir}的文件至oss的${prefix}？`,
        default: false,
      },
    ]);
    if (!answer.release) {
      log.warn(`取消上传本地${dir}的文件至oss的${prefix}！`);
      return;
    }
    if (newFiles.length <= 0) {
      log.warn("没有新文件需要上传至oss！");
      return;
    }
    await this.uploadFiles(newFiles, dir, prefix);
  }

  private async uploadFiles(localFiles: string[], dir: string, prefix: string) {
    for await (const file of localFiles) {
      try {
        const fullPath = path.resolve(dir, file);
        await this.client.put(this.getTargetFilePath(file, prefix), fullPath);
        log.success(`${fullPath}上传成功`);
      } catch (e: any) {
        throw new Error(e);
      }
    }
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
