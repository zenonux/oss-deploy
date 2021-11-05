import { AliOssConfig, VersionItem } from "./types";
export default class AliOSS {
    private distPath;
    private syncPrefix;
    private client;
    constructor(config: AliOssConfig, distPath?: string);
    sync(dir: string): Promise<void>;
    private getLocalFiles;
    private uploadFiles;
    private getAllFilesInOssDir;
    uploadAssets(prefix: string): Promise<void>;
    handleDel(name: string): Promise<any>;
    deleteAssets(prefix: string): Promise<boolean>;
    clearAllUnNeedAssests(dirList: VersionItem[]): Promise<boolean>;
}
