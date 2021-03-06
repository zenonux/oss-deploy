#! /usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/cli.ts
var import_commander = require("commander");

// src/bucket.ts
var import_fs = __toESM(require("fs"));
var import_cos_nodejs_sdk_v5 = __toESM(require("cos-nodejs-sdk-v5"));
var import_path = __toESM(require("path"));
var import_readdirp = __toESM(require("readdirp"));
var import_p_limit = __toESM(require("p-limit"));
var limit = (0, import_p_limit.default)(3);
var CosBucketManager = class {
  constructor(options) {
    this._options = options;
    this._client = new import_cos_nodejs_sdk_v5.default({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey
    });
  }
  async uploadLocalFile(prefixPath, filePath) {
    if (!this._client) {
      return;
    }
    const res = await this._client.putObject({
      Bucket: this._options.Bucket,
      Region: this._options.Region,
      Key: prefixPath,
      Body: import_fs.default.createReadStream(filePath)
    });
    console.info(`Upload ${prefixPath} success.`);
    return res;
  }
  async uploadLocalDirectory(prefix, dirPath, filterOpts = {}) {
    dirPath = import_path.default.resolve(dirPath);
    const input = [];
    for await (const entry of (0, import_readdirp.default)(dirPath, filterOpts)) {
      const { fullPath } = entry;
      const relativePath = import_path.default.relative(dirPath, fullPath);
      const prefixPath = (prefix + "/" + relativePath).replace("\\", "/");
      input.push(limit(() => this.uploadLocalFile(prefixPath, fullPath)));
    }
    await Promise.all(input);
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
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var readJsonFile = (file, root) => {
  const filePath = import_path2.default.resolve(root || process.cwd(), file);
  return JSON.parse(import_fs2.default.readFileSync(filePath, "utf-8"));
};
var validateOssPrefix = (ossPrefix) => {
  if (ossPrefix.indexOf("/") !== -1) {
    return false;
  }
  if (ossPrefix.indexOf("@") !== -1) {
    return false;
  }
  return true;
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
  if (mode !== "prod" && mode != "stag" && mode != "test") {
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
var validateUploadOptions = (ossPrefix, name, mode, version) => {
  if (!validateOssPrefix(ossPrefix)) {
    return ["ossPrefix is not correct. example:hello-world"];
  }
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
var import_compare_versions = __toESM(require("compare-versions"));
var generatePrefix = (ossPrefix, name, mode, version) => {
  return ossPrefix + "/" + name + "/" + mode + "@" + version + "/";
};
var OssDeploy = class {
  constructor(options) {
    this._versions = [];
    options = this._validateOptions(options);
    const _a = options, { distPath, distFilterOptions } = _a, ossOptions = __objRest(_a, ["distPath", "distFilterOptions"]);
    this._distPath = distPath;
    this._distFilterOptions = distFilterOptions;
    this._oss = BucketManagerFactory.create(ossOptions);
  }
  async uploadAssets(ossPrefix = "", name, mode, version, isForce) {
    const [err] = validateUploadOptions(ossPrefix, name, mode, version);
    if (err) {
      throw new Error(err);
    }
    const prefix = generatePrefix(ossPrefix, name, mode, version);
    this._versions = await this._oss.listRemoteDirectory(ossPrefix + "/" + name + "/");
    if (!isForce && this._versions.length > 0 && this._versions.some((v) => v === prefix)) {
      throw new Error(`${mode}@${version} of ${name} has already exist,please check your version!`);
    }
    await this._oss.uploadLocalDirectory(prefix, this._distPath, this._distFilterOptions);
    this._versions.push(prefix);
    console.info(`upload ${prefix} success.`);
    await this._clearAssets(ossPrefix, name, mode);
  }
  async _clearAssets(ossPrefix, name, mode) {
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
  _getNeedClearVersionList(ossPrefix, name, mode) {
    const modeVerStr = name + "/" + mode;
    const modeVersions = this._versions.filter((v) => v.indexOf(modeVerStr) !== -1);
    if (modeVersions.length > 10) {
      const versions = modeVersions.map((val) => val.split("@")[1].split("/")[0]);
      const sorted = versions.sort((a, b) => (0, import_compare_versions.default)(b, a));
      const needClearList = sorted.slice(5);
      return needClearList.map((v) => generatePrefix(ossPrefix, name, mode, v));
    }
    return [];
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

// src/cli.ts
var import_path3 = __toESM(require("path"));
var program = new import_commander.Command();
program.command("upload <mode>").option("-f, --force").requiredOption("-c, --config <file>", "deploy config file", "./package.json").description("upload assets to cos").action(async (mode, opts) => {
  try {
    const deployConfig = readJsonFile(opts.config);
    const isForce = opts.force;
    const rootPath = import_path3.default.dirname(opts.config);
    const ossDeployConfig = deployConfig.ossDeploy;
    const ossConfig = readJsonFile(ossDeployConfig.ossConfigPath, rootPath);
    const options = __spreadValues({
      distPath: import_path3.default.resolve(rootPath, ossDeployConfig.distPath),
      distFilterOptions: ossDeployConfig.distFilterOptions
    }, ossConfig);
    const client = new OssDeploy(options);
    await client.uploadAssets(ossDeployConfig.ossPrefix, deployConfig.name, mode, deployConfig.version, isForce);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
program.parse(process.argv);
