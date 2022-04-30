#! /usr/bin/env node
import {
  OssDeploy,
  __require,
  __toESM,
  getInfoFromPkg
} from "./chunk-OQEIS45B.mjs";

// src/cli.ts
import { Command } from "commander";
import path from "path";
var program = new Command();
program.command("upload <mode>").requiredOption("-c, --config <file>", "deploy config file", "./.deploy.config.js").description("upload html to server and upload assets to oss").action(async (mode, opts) => {
  try {
    const config = await Promise.resolve().then(() => __toESM(__require(path.resolve(process.cwd(), opts.config))));
    const client = new OssDeploy(config);
    const info = getInfoFromPkg();
    await client.uploadAssets(info.name, mode, info.version);
  } catch (e) {
    console.error(e);
  }
});
program.parse(process.argv);
