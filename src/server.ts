import path from "path";
import { Client } from "ssh2";
import ora from "ora";
import { ServerConfig } from "./types";
import { isFileExisted } from "./util";

export default class Server {
  private distPath: string;
  constructor(distPath: string) {
    this.distPath = distPath;
  }
  async uploadHtml(serverConfig: ServerConfig): Promise<void> {
    const localHtml = path.resolve(this.distPath, "index.html");
    const remoteHtml = path.posix.join(serverConfig.serverPath, "index.html");
    if (!isFileExisted(localHtml)) {
      throw new Error(`${localHtml} is not found.`);
    }
    const spinner = ora(`Start deploying index html...`).start();
    try {
      await this.uploadFile(localHtml, remoteHtml, serverConfig);
      spinner.succeed(
        `Deploy index.html to server ${serverConfig.host} successfully.`
      );
    } catch (e: any) {
      spinner.fail();
      throw new Error(e);
    }
  }

  private uploadFile(
    localFilePath: string,
    remoteFilePath: string,
    serverConfig: ServerConfig
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const ssh2Client = new Client();
      ssh2Client
        .on("ready", () => {
          ssh2Client.sftp((err, sftp) => {
            if (err) {
              ssh2Client.end();
              reject(err);
            }
            sftp.fastPut(localFilePath, remoteFilePath, {}, (err) => {
              if (err) {
                ssh2Client.end();
                reject(err);
              }
              ssh2Client.end();
              resolve(true);
            });
          });
        })
        .on("error", (err) => {
          reject(err);
        })
        .connect({
          host: serverConfig.host,
          username: serverConfig.username,
          password: serverConfig.password,
        });
    });
  }
}
