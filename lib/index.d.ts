import { Config, ModeType } from "./types";
export default class Aod {
    private config;
    private oss;
    private server;
    private versionManager;
    constructor(opts: Config);
    uploadAssetsAndHtml(mode: ModeType, version: string): Promise<undefined | void>;
    clearAssets(mode: ModeType): Promise<undefined | void>;
    private validateConfig;
}
