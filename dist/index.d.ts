declare type ModeType = "test" | "stag" | "prod";
declare type OssOptions = {
    Region: string;
    SecretId: string;
    SecretKey: string;
    Bucket: string;
};
declare type Options = OssOptions & {
    distPath: string;
    distFilterOptions: Record<string, any>;
    ossPrefix: string;
    ossConfigPath: string;
};

declare const generatePrefix: (ossPrefix: string, name: string, mode: ModeType, version: string) => string;
declare class OssDeploy {
    private _oss;
    private _distPath;
    private _distFilterOptions;
    private _versions;
    constructor(options: Options);
    uploadAssets(ossPrefix: string | undefined, name: string, mode: ModeType, version: string, isForce: boolean): Promise<void>;
    private _clearAssets;
    private _getNeedClearVersionList;
    private _validateOptions;
}

export { OssDeploy, generatePrefix };
