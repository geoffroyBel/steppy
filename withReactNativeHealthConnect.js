"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = exports.insertBefore = exports.insertAfter = void 0;
var config_plugins_1 = require("@expo/config-plugins");
var path = __importStar(require("node:path"));
var node_fs_1 = require("node:fs");
var createCommentSymbols = function (commentSymbol) {
    return {
        startCommentSymbol: Array.isArray(commentSymbol) ? commentSymbol[0] : commentSymbol,
        endCommentSymbol: Array.isArray(commentSymbol) ? " ".concat(commentSymbol[1]) : "",
    };
};
var createStartTag = function (commentSymbol, tag, toInsert) {
    var _a = createCommentSymbols(commentSymbol), startCommentSymbol = _a.startCommentSymbol, endCommentSymbol = _a.endCommentSymbol;
    return "".concat(startCommentSymbol, " @generated begin ").concat(tag, " - expo prebuild (DO NOT MODIFY)").concat(endCommentSymbol);
};
var createEndTag = function (commentSymbol, tag) {
    var _a = createCommentSymbols(commentSymbol), startCommentSymbol = _a.startCommentSymbol, endCommentSymbol = _a.endCommentSymbol;
    return "".concat(startCommentSymbol, " @generated end ").concat(tag).concat(endCommentSymbol);
};
var createContentToInsert = function (commentSymbol, tag, toInsert) {
    var startTag = createStartTag(commentSymbol, tag, toInsert);
    var endTag = createEndTag(commentSymbol, tag);
    return "".concat(startTag, "\n").concat(Array.isArray(toInsert) ? toInsert.join("\n") : toInsert, "\n").concat(endTag);
};
var insert = function (_a) {
    var content = _a.content, toFind = _a.toFind, toInsert = _a.toInsert, tag = _a.tag, commentSymbol = _a.commentSymbol, where = _a.where;
    var toInsertWithComments = createContentToInsert(commentSymbol, tag, toInsert);
    if (!content.includes(toFind)) {
        throw new Error("Couldn't find ".concat(toFind, " in the given props.content"));
    }
    if (!content.includes(toInsertWithComments)) {
        switch (where) {
            case "before":
                content = content.replace(toFind, "".concat(toInsertWithComments, "\n").concat(toFind));
                break;
            case "after":
                content = content.replace(toFind, "".concat(toFind, "\n").concat(toInsertWithComments));
                break;
            case "replace":
                content = content.replace(toFind, "".concat(toInsertWithComments));
                break;
        }
    }
    return content;
};
/**
 * Insert `props.toInsert` into `props.content` the line after `props.toFind`
 * @returns the modified `props.content`
 */
var insertAfter = function (props) {
    return insert(__assign(__assign({}, props), { where: "after" }));
};
exports.insertAfter = insertAfter;
/**
 * Insert `props.toInsert` into `props.content` the line before `props.toFind`
 * @returns the modified `props.content`
 */
var insertBefore = function (props) {
    return insert(__assign(__assign({}, props), { where: "before" }));
};
exports.insertBefore = insertBefore;
/**
 * Replace `props.toFind` by `props.toInsert` into `props.content`
 * @returns the modified `props.content`
 */
var replace = function (props) {
    return insert(__assign(__assign({}, props), { where: "replace" }));
};
exports.replace = replace;
/** Copies `srcFile` to `destFolder` with an optional `destFileName` or its initial name if not provided
 * @returns the path of the created file
 */
var copyFile = function (srcFile, destFolder, destFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, destFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = destFileName !== null && destFileName !== void 0 ? destFileName : path.basename(srcFile);
                return [4 /*yield*/, node_fs_1.promises.mkdir(destFolder, { recursive: true })];
            case 1:
                _a.sent();
                destFile = path.resolve(destFolder, fileName);
                return [4 /*yield*/, node_fs_1.promises.copyFile(srcFile, destFile)];
            case 2:
                _a.sent();
                return [2 /*return*/, destFile];
        }
    });
}); };
var withReactNativeHealthConnect = function (config, _a) {
    var permissionsRationaleActivityPath = _a.permissionsRationaleActivityPath;
    config = (0, config_plugins_1.withAndroidManifest)(config, function (config) { return __awaiter(void 0, void 0, void 0, function () {
        var androidManifest;
        var _a;
        return __generator(this, function (_b) {
            androidManifest = config.modResults.manifest;
            if (!((_a = androidManifest === null || androidManifest === void 0 ? void 0 : androidManifest.application) === null || _a === void 0 ? void 0 : _a[0])) {
                throw new Error("AndroidManifest.xml is not valid!");
            }
            if (!androidManifest.application[0]["activity"]) {
                throw new Error("AndroidManifest.xml is missing application activity");
            }
            androidManifest.application[0]["activity"].push({
                $: {
                    "android:name": ".PermissionsRationaleActivity",
                    "android:exported": "true",
                },
                "intent-filter": [
                    {
                        action: [{ $: { "android:name": "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" } }],
                    },
                ],
            });
            // @ts-expect-error activity-alias is not defined in the type
            if (!androidManifest.application[0]["activity-alias"]) {
                // @ts-expect-error activity-alias is not defined in the type
                androidManifest.application[0]["activity-alias"] = [];
            }
            // @ts-expect-error activity-alias is not defined in the type
            androidManifest.application[0]["activity-alias"].push({
                $: {
                    "android:name": "ViewPermissionUsageActivity",
                    "android:exported": "true",
                    "android:targetActivity": ".PermissionsRationaleActivity",
                    "android:permission": "android.permission.START_VIEW_PERMISSION_USAGE",
                },
                "intent-filter": [
                    {
                        action: [{ $: { "android:name": "android.intent.action.VIEW_PERMISSION_USAGE" } }],
                        category: [{ $: { "android:name": "android.intent.category.HEALTH_PERMISSIONS" } }],
                    },
                ],
            });
            return [2 /*return*/, config];
        });
    }); });
    config = (0, config_plugins_1.withMainActivity)(config, function (config) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            config.modResults.contents = (0, exports.insertAfter)({
                content: config.modResults.contents,
                toFind: "import com.facebook.react.defaults.DefaultReactActivityDelegate;",
                toInsert: "import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate;",
                commentSymbol: "//",
                tag: "withReactNativeHealthConnect",
            });
            config.modResults.contents = (0, exports.insertAfter)({
                content: config.modResults.contents,
                toFind: "super.onCreate(null);",
                toInsert: [
                    "HealthConnectPermissionDelegate hcpd = HealthConnectPermissionDelegate.INSTANCE;",
                    'hcpd.setPermissionDelegate(this, "com.google.android.apps.healthdata");',
                ],
                commentSymbol: "//",
                tag: "withReactNativeHealthConnect",
            });
            return [2 /*return*/, config];
        });
    }); });
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        function (config) { return __awaiter(void 0, void 0, void 0, function () {
            var projectRoot, destPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectRoot = config.modRequest.projectRoot;
                        destPath = path.resolve(projectRoot, "android/app/src/main/java/com/alanmobile");
                        return [4 /*yield*/, copyFile(permissionsRationaleActivityPath, destPath, "PermissionsRationaleActivity.kt")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, config];
                }
            });
        }); },
    ]);
    return config;
};
exports.default = withReactNativeHealthConnect;
