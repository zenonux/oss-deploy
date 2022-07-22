#! /usr/bin/env node

import { Command } from "commander";
import {OssDeploy} from "./index";
const program = new Command();
import { readJsonFile } from "./util";
import { ModeType, Options } from "./types";
import path from "path";

program
  .command("upload <mode>")
  .option("-f, --force")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./package.json"
  )
  .description("upload assets to cos")
  .action(async (mode: ModeType, opts: any) => {
    try {
      const deployConfig = readJsonFile(opts.config);
      const isForce = opts.force;
      const rootPath = path.dirname(opts.config);
      const ossDeployConfig=deployConfig.ossDeploy

      const ossConfig = readJsonFile(ossDeployConfig.ossConfigPath, rootPath);
      const options = {
        distPath: path.resolve(rootPath, ossDeployConfig.distPath),
        distFilterOptions: ossDeployConfig.distFilterOptions,
        ...ossConfig,
      };
      const client = new OssDeploy(options as Options);
      await client.uploadAssets(ossDeployConfig.ossPrefix, deployConfig.name, mode, deployConfig.version, isForce);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);
