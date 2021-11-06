import { OssConfig, VersionItem } from "./types";
export default class Oss {
    private distPath;
    private client;
    constructor(config: OssConfig, distPath?: string);
    private getTargetFilePath;
    private getLocalFilesPath;
    private getFilesPathByPrefix;
    sync(dir: string, prefix: string): Promise<void>;
    private uploadFiles;
    uploadAssets(prefix: string): Promise<void>;
    handleDel(name: string): Promise<any>;
    deleteAssets(prefix: string): Promise<boolean>;
    clearAllUnNeedAssests(dirList: VersionItem[]): Promise<boolean>;
}
