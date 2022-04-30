declare type ModeType = "stag" | "prod";
declare type OssOptions = {
    Region: string;
    SecretId: string;
    SecretKey: string;
    Bucket: string;
};
declare type Options = OssOptions & {
    distPath: string;
};

declare class OssDeploy {
    private _oss;
    private _distPath;
    private _versions;
    constructor(options: Options);
    uploadAssets(name: string, mode: ModeType, version: string): Promise<void>;
    private _clearAssets;
    private _getNeedClearVersionList;
    private _buildPrefix;
    private _validateOptions;
}

export { OssDeploy as default };
