import OSS from "ali-oss";
import ora from "ora";
import path from "path";
import readdirp from "readdirp";
import inquirer from "inquirer";
import { OssConfig, VersionItem } from "./types";

export default class Oss {
  private distPath: string;
  private client;
  constructor(config: OssConfig, distPath: string) {
    this.distPath = distPath;
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    });
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
        throw e;
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
  }

  async clearAllUnNeedAssests(dirList: VersionItem[]): Promise<boolean> {
    if (dirList.length <= 0) {
      return false;
    }
    const dirStr = dirList.map((val) => val.version).join(",");
    console.warn("Need clear versions:" + dirStr);
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "clear",
        message: `Confirm to clear ${dirStr} static assets?`,
        default: false,
      },
    ]);
    if (!answer.clear) {
      throw `Clear ${dirStr} assets has been cancelled.`;
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
