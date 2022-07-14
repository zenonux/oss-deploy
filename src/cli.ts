#! /usr/bin/env node

import { Command } from 'commander'
import OssDeploy from './index'
const program = new Command()
import { readJsonFile } from './util'
import { ModeType, Options } from './types'
import path from 'path'

program
  .command('upload <mode>')
  .option('-f, --force')
  .requiredOption(
    '-c, --config <file>',
    'deploy config file',
    './deploy.config.json'
  )
  .description('upload assets to cos')
  .action(async (mode: ModeType, opts: any) => {
    try {
      const config = readJsonFile(opts.config)
      const isForce = opts.force
      const rootPath = path.dirname(opts.config)
      const ossConfig = readJsonFile(config.ossConfigPath, rootPath)
      const options = {
        distPath: path.resolve(rootPath, config.distPath),
        distFilterOptions: config.distFilterOptions,
        ...ossConfig,
      }
      const client = new OssDeploy(options as Options)
      const { name, version } = readJsonFile(config.packageJsonPath, rootPath)
      await client.uploadAssets(name, mode, version, isForce)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
