import { ServerConfig } from "./types";
export default class Server {
    private distPath;
    constructor(distPath: string);
    uploadHtml(serverConfig: ServerConfig): Promise<void>;
    private uploadFile;
}
