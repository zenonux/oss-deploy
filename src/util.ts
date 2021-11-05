import fs from "fs";
import jsonfile from "jsonfile";
export const isFileExisted = async (filePath: string): Promise<boolean> => {
  const has = await fs.promises
    .access(filePath, fs.constants.F_OK | fs.constants.R_OK)
    .then(() => true)
    .catch(() => false);
  return has;
};

export const getVersionFromPackage = async (): Promise<string> => {
  const data = await jsonfile.readFile("./package.json");
  return data.version;
};
