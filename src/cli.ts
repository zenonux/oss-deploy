#! /usr/bin/env node

import { Command } from "commander";
import Aod from "./index";
const program = new Command();
import { getVersionFromPackage } from "./util";
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
      const client = new Aod(config);
      const version = await getVersionFromPackage();
      await client.uploadAssetsAndHtml(mode, version);
    } catch (e: any) {
      console.error(e);
    }
  });

program
  .command("clear <mode>")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./.deploy.config.js"
  )
  .description("clear unused assets in oss")
  .action(async (mode, opts) => {
    try {
      const config = await import(path.resolve(process.cwd(), opts.config));
      const client = new Aod(config);
      await client.clearAssets(mode);
    } catch (e: any) {
      console.error(e);
    }
  });

program.parse(process.argv);
