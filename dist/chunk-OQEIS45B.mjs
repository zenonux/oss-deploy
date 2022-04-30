var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/BucketManager.ts
import fs from "fs";
import COS from "cos-nodejs-sdk-v5";
import path from "path";
import readdirp from "readdirp";
var CosBucketManager = class {
  constructor(options) {
    this._options = options;
    this._client = new COS({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey
    });
  }
  async uploadLocalFile(prefix, filePath) {
    if (!this._client) {
      return;
    }
    const res = await this._client.putObject({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Key: prefix,
      Body: fs.createReadStream(filePath)
    });
    return res;
  }
  async uploadLocalDirectory(prefix, dirPath) {
    dirPath = path.resolve(dirPath);
    for await (const entry of readdirp(dirPath)) {
      const { fullPath } = entry;
      const relativePath = path.relative(dirPath, fullPath);
      const prefixPath = (prefix + "/" + relativePath).replace("\\", "/");
      await this.uploadLocalFile(prefixPath, fullPath);
    }
  }
  async listRemoteFiles(prefix) {
    if (!this._client) {
      return [];
    }
    const res = await this._client.getBucket({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Prefix: prefix,
      MaxKeys: 1e3
    });
    return res.Contents.map((item) => item.Key);
  }
  async listRemoteDirectory(prefix) {
    if (!this._client) {
      return [];
    }
    const res = await this._client.getBucket({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Prefix: prefix,
      Delimiter: "/",
      MaxKeys: 1e3
    });
    return res.CommonPrefixes.map((item) => item.Prefix);
  }
  async clearRemoteDirectory(prefix) {
    if (!this._client) {
      return;
    }
    const files = await this.listRemoteFiles(prefix);
    await this._client.deleteMultipleObject({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Objects: files.map((v) => {
        return {
          Key: v
        };
      })
    });
  }
};
var BucketManagerFactory = class {
  static create(config) {
    return new CosBucketManager(config);
  }
};

// src/util.ts
import fs2 from "fs";
var getInfoFromPkg = () => {
  const { name, version } = JSON.parse(fs2.readFileSync("./package.json", "utf8"));
  return {
    name,
    version
  };
};
var validateName = (name) => {
  if (!name) {
    return false;
  }
  if (name.indexOf("/") !== -1) {
    return false;
  }
  if (name.indexOf("@") !== -1) {
    return false;
  }
  return true;
};
var validateMode = (mode) => {
  if (!mode) {
    return false;
  }
  if (mode !== "prod" && mode != "stag") {
    return false;
  }
  return true;
};
var validateVersion = (version) => {
  if (!version) {
    return false;
  }
  const reg = /^\d+.\d+.\d+$/gi;
  if (!reg.test(version)) {
    return false;
  }
  return true;
};
var validateUploadOptions = (name, mode, version) => {
  if (!validateName(name)) {
    return ["name is not correct. example:test"];
  }
  if (!validateMode(mode)) {
    return ["mode is not correct. example:stag"];
  }
  if (!validateVersion(version)) {
    return ["version is not correct. example:1.2.0"];
  }
  return [null];
};

// src/index.ts
import compareVersions from "compare-versions";
var OssDeploy = class {
  constructor(options) {
    this._versions = [];
    options = this._validateOptions(options);
    const _a = options, { distPath } = _a, ossOptions = __objRest(_a, ["distPath"]);
    this._distPath = distPath;
    this._oss = BucketManagerFactory.create(ossOptions);
  }
  async uploadAssets(name, mode, version) {
    const [err] = validateUploadOptions(name, mode, version);
    if (err) {
      throw new Error(err);
    }
    const prefix = this._buildPrefix(name, mode, version);
    this._versions = await this._oss.listRemoteDirectory(name + "/");
    if (this._versions.length > 0 && this._versions.some((v) => v === prefix)) {
      throw new Error(`${mode}@${version} of ${name} has already exist,please check your version!`);
    }
    await this._oss.uploadLocalDirectory(prefix, this._distPath);
    this._versions.push(prefix);
    await this._clearAssets(name, mode);
  }
  async _clearAssets(name, mode) {
    const list = this._getNeedClearVersionList(name, mode);
    if (list.length <= 0) {
      return;
    }
    for await (const prefix of list) {
      console.info(`clear ${prefix} start...`);
      await this._oss.clearRemoteDirectory(prefix);
      console.info(`clear ${prefix} end.`);
    }
  }
  _getNeedClearVersionList(name, mode) {
    const modeVerStr = name + "/" + mode;
    const modeVersions = this._versions.filter((v) => v.indexOf(modeVerStr) !== -1);
    if (modeVersions.length <= 3) {
      return [];
    }
    if (modeVersions.length > 10) {
      const versions = modeVersions.map((val) => val.split("@")[1].split("/")[0]);
      const sorted = versions.sort((a, b) => compareVersions(b, a));
      const needClearList = sorted.slice(5);
      return needClearList.map((v) => this._buildPrefix(name, mode, v));
    }
    return [];
  }
  _buildPrefix(name, mode, version) {
    return name + "/" + mode + "@" + version + "/";
  }
  _validateOptions(opts) {
    const fields = ["distPath", "SecretId", "SecretKey", "Region", "Bucket"];
    fields.forEach((val) => {
      if (!opts[val]) {
        throw new Error(`${val} is required.`);
      }
    });
    return opts;
  }
};

export {
  __require,
  __toESM,
  getInfoFromPkg,
  OssDeploy
};
