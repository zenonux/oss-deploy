import { ModeType } from "./types";
interface VersionItem {
    version: string;
    release_time: string;
}
export default class VersionManager {
    private jsonPath;
    constructor(jsonPath: string);
    private writeJsonFile;
    getJsonFile(): Promise<VersionItem[]>;
    checkHasVersion(prefix: string): Promise<boolean>;
    addVersion(prefix: string): Promise<string>;
    getNeedClearVersions(mode: ModeType, maxVersionCountOfMode: number): Promise<VersionItem[]>;
    deleteVersions(dirList: VersionItem[]): Promise<VersionItem[]>;
}
export {};
