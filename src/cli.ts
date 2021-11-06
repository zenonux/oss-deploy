#! /usr/bin/env node

import { Command } from "commander";
import Aod from "./index";
const program = new Command();
import { getVersionFromPackage } from "./util";
import path from "path";
import Oss from "./oss";

program
  .command("sync <dir> <prefix>")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./.deploy.config.js"
  )
  .description("同步本地文件至oss")
  .action(async (dir, prefix, opts) => {
    const config = await import(path.resolve(process.cwd(), opts.config));
    const oss = new Oss(config.oss);
    await oss.sync(dir, prefix);
  });

program
  .command("upload <mode>")
  .requiredOption(
    "-c, --config <file>",
    "deploy config file",
    "./.deploy.config.js"
  )
  .description("upload html to server and upload assets to oss")
  .action(async (mode, opts) => {
    const config = await import(path.resolve(process.cwd(), opts.config));
    const client = new Aod(config);
    const version = await getVersionFromPackage();
    await client.uploadAssetsAndHtml(mode, version);
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
    const config = await import(path.resolve(process.cwd(), opts.config));
    const client = new Aod(config);
    await client.clearAssets(mode);
  });

program.parse(process.argv);
