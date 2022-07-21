import fs from "fs";
import path from "path";
import { ModeType } from "./types";

export const readJsonFile = (
  file: string,
  root?: string
): Record<string, any> => {
  const filePath = path.resolve(root || process.cwd(), file);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const validateName = (name: string) => {
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

const validateMode = (mode: ModeType) => {
  if (!mode) {
    return false;
  }
  if (mode !== "prod" && mode != "stag") {
    return false;
  }
  return true;
};

const validateVersion = (version: string) => {
  if (!version) {
    return false;
  }
  const reg = /^\d+.\d+.\d+$/gi;
  if (!reg.test(version)) {
    return false;
  }
  return true;
};

export const validateUploadOptions = (
  ossPrefix:string,
  name: string,
  mode: ModeType,
  version: string
): (string | null)[] => {
  if (!validateName(ossPrefix)) {
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
