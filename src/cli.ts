#! /usr/bin/env node

import { Command } from "commander";
import OssDeploy from "./index";
const program = new Command();
import { getInfoFromPkg } from "./util";
import path from "path";

program
  .command("upload <mode>")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./.deploy.config.js"
  )
  .description("upload html to server and upload assets to oss")
  .action(async (mode, opts) => {
    try {
      const config = await import(path.resolve(process.cwd(), opts.config));
      const client = new OssDeploy(config);
      const info = getInfoFromPkg();
      await client.uploadAssets(info.name, mode, info.version);
    } catch (e: any) {
      console.error(e);
    }
  });

program.parse(process.argv);
