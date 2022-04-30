import fs from "fs";
import { ModeType } from "./types";
export const getInfoFromPkg = (): {
  name: string;
  version: string;
} => {
  const { name, version } = JSON.parse(
    fs.readFileSync("./package.json", "utf8")
  );
  return {
    name,
    version,
  };
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
  name: string,
  mode: ModeType,
  version: string
): (string | null)[] => {
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
