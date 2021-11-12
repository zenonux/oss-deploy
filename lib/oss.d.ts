import { OssConfig, VersionItem } from "./types";
export default class Oss {
    private distPath;
    private client;
    constructor(config: OssConfig, distPath: string);
    uploadAssets(prefix: string): Promise<void>;
    handleDel(name: string): Promise<any>;
    deleteAssets(prefix: string): Promise<void>;
    clearAllUnNeedAssests(dirList: VersionItem[]): Promise<void>;
}
