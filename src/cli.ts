#! /usr/bin/env node

const { Command } = require("commander");
import OssDeploy from "./index";
const program = new Command();
import { readJsonFile } from "./util";
import { ModeType, Options } from "./types";

program
  .command("upload <mode>")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./deploy.config.json"
  )
  .description("upload assets to cos")
  .action(async (mode: ModeType, opts: any) => {
    try {
      const config = readJsonFile(opts.config);
      const ossConfig = readJsonFile(config.ossConfigPath);
      const options = {
        distPath: config.distPath,
        distFilterOptions:config.distFilterOptions,
        ...ossConfig,
      };
      const client = new OssDeploy(options as Options);
      const { name, version } = readJsonFile(config.packageJsonPath);
      await client.uploadAssets(name, mode, version);
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  });

program.parse(process.argv);
