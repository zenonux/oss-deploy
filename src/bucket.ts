import { BucketManager, OssOptions } from "./types";
import fs from "fs";
import COS from "cos-nodejs-sdk-v5";
import path from "path";
import readdirp from "readdirp";

class CosBucketManager implements BucketManager {
  private _client?;
  private _options;
  constructor(options: OssOptions) {
    this._options = options;
    this._client = new COS({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey,
    });
  }

  async uploadLocalFile(prefix: string, filePath: string) {
    if (!this._client) {
      return;
    }
    const res = await this._client.putObject({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Key: prefix,
      Body: fs.createReadStream(filePath),
    });
    return res;
  }

  async uploadLocalDirectory(prefix: string, dirPath: string, filterOpts = {}) {
    dirPath = path.resolve(dirPath);
    for await (const entry of readdirp(dirPath, filterOpts)) {
      const { fullPath } = entry;
      const relativePath = path.relative(dirPath, fullPath);
      const prefixPath = (prefix + "/" + relativePath).replace("\\", "/");
      await this.uploadLocalFile(prefixPath, fullPath);
      console.info(`upload ${prefixPath} success.`);
    }
  }

  // 最多列出1000条文件,深度遍历
  async listRemoteFiles(prefix: string): Promise<string[]> {
    if (!this._client) {
      return [];
    }
    const res = await this._client.getBucket({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Prefix: prefix,
      MaxKeys: 1000,
    });
    return res.Contents.map((item) => item.Key);
  }

  // 最多列出1000条目录,不深度遍历
  async listRemoteDirectory(prefix: string): Promise<string[]> {
    if (!this._client) {
      return [];
    }
    const res = await this._client.getBucket({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Prefix: prefix,
      Delimiter: "/",
      MaxKeys: 1000,
    });
    return res.CommonPrefixes.map((item) => item.Prefix);
  }

  // 一次性最多删除1000条
  async clearRemoteDirectory(prefix: string) {
    if (!this._client) {
      return;
    }
    const files = await this.listRemoteFiles(prefix);
    await this._client.deleteMultipleObject({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Objects: files.map((v) => {
        return {
          Key: v,
        };
      }),
    });
  }
}

export default class BucketManagerFactory {
  static create(config: OssOptions): CosBucketManager {
    return new CosBucketManager(config);
  }
}
