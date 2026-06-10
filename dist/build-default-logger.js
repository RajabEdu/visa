"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildDefaultLogger;
exports.buildLogMessagePartsFromInfo = buildLogMessagePartsFromInfo;
exports.buildVerboseLogMessagePartsFromInfo = buildVerboseLogMessagePartsFromInfo;
// @ts-nocheck
const winston_1 = __importDefault(require("winston"));
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
function buildDefaultLogger() {
    return winston_1.default.createLogger({
        level: 'debug',
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.metadata(), winston_1.default.format.timestamp(), winston_1.default.format.printf((logInfo) => {
            const messageParts = buildLogMessagePartsFromInfo(logInfo);
            const verboseMessageParts = buildVerboseLogMessagePartsFromInfo(logInfo);
            const message = [...messageParts, ...verboseMessageParts].join(' ');
            return message;
        })),
        transports: [new winston_1.default.transports.Console()],
    });
}
function buildLogMessagePartsFromInfo(logInfo) {
    const { level, message, timestamp, metadata } = logInfo;
    const executionState = metadata.executionState;
    if (executionState === null || executionState === void 0 ? void 0 : executionState.hasInitialized()) {
        const executionStateLabel = executionState.buildLoggerLabel(logInfo);
        return [timestamp, `${level}:`, executionStateLabel, message];
    }
    return [timestamp, `${level}:`, message];
}
function buildVerboseLogMessagePartsFromInfo(logInfo) {
    const { metadata } = logInfo;
    const config = metadata.config;
    if (config === null || config === void 0 ? void 0 : config.isVerbose) {
        return [(0, safe_stable_stringify_1.default)(metadata)];
    }
    return [];
}
