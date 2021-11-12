"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ali_oss_1 = __importDefault(require("ali-oss"));
var ora_1 = __importDefault(require("ora"));
var path_1 = __importDefault(require("path"));
var readdirp_1 = __importDefault(require("readdirp"));
var inquirer_1 = __importDefault(require("inquirer"));
var Oss = /** @class */ (function () {
    function Oss(config, distPath) {
        this.distPath = distPath;
        this.client = new ali_oss_1.default({
            region: config.region,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucket,
        });
    }
    Oss.prototype.uploadAssets = function (prefix) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var spinner, dirPath, _b, _c, entry, fullPath, relativePath, prefixPath, e_2, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        spinner = (0, ora_1.default)("Start deploying " + prefix + " assets...").start();
                        dirPath = path_1.default.resolve(this.distPath);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, 10, 15]);
                        _b = __asyncValues((0, readdirp_1.default)(dirPath));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 8];
                        entry = _c.value;
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 6, , 7]);
                        fullPath = entry.fullPath;
                        relativePath = path_1.default.relative(dirPath, fullPath);
                        prefixPath = prefix + "/" + relativePath;
                        return [4 /*yield*/, this.client.put(prefixPath.replace("\\", "/"), fullPath)];
                    case 5:
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _d.sent();
                        spinner.fail();
                        throw e_2;
                    case 7: return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _d.trys.push([10, , 13, 14]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _a.call(_b)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15:
                        spinner.succeed("Deploy " + prefix + " assets succeed.");
                        return [2 /*return*/];
                }
            });
        });
    };
    Oss.prototype.handleDel = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.delete(name)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        error_1.failObjectName = name;
                        return [2 /*return*/, error_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Oss.prototype.deleteAssets = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var spinner, list;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spinner = (0, ora_1.default)("Start removing " + prefix + " assest...").start();
                        return [4 /*yield*/, this.client.list({
                                prefix: prefix,
                                "max-keys": 100,
                            }, {})];
                    case 1:
                        list = _a.sent();
                        list.objects = list.objects || [];
                        return [4 /*yield*/, Promise.all(list.objects.map(function (v) { return _this.handleDel(v.name); }))];
                    case 2:
                        _a.sent();
                        spinner.succeed("Remove " + prefix + " assets succeed.");
                        return [2 /*return*/];
                }
            });
        });
    };
    Oss.prototype.clearAllUnNeedAssests = function (dirList) {
        var dirList_1, dirList_1_1;
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var dirStr, answer, dir, e_3_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (dirList.length <= 0) {
                            throw "No assets needs clear.";
                        }
                        dirStr = dirList.map(function (val) { return val.version; }).join(",");
                        console.warn("Need clear versions:" + dirStr);
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: "confirm",
                                    name: "clear",
                                    message: "Confirm to clear " + dirStr + " static assets?",
                                    default: false,
                                },
                            ])];
                    case 1:
                        answer = _b.sent();
                        if (!answer.clear) {
                            throw "Clear " + dirStr + " assets has been cancelled.";
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, 9, 14]);
                        dirList_1 = __asyncValues(dirList);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, dirList_1.next()];
                    case 4:
                        if (!(dirList_1_1 = _b.sent(), !dirList_1_1.done)) return [3 /*break*/, 7];
                        dir = dirList_1_1.value;
                        return [4 /*yield*/, this.deleteAssets(dir.version)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _b.trys.push([9, , 12, 13]);
                        if (!(dirList_1_1 && !dirList_1_1.done && (_a = dirList_1.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _a.call(dirList_1)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return Oss;
}());
exports.default = Oss;
