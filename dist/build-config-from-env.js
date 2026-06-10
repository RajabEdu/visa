"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildConfigFromEnv;
exports.buildConfigEnvFromEnv = buildConfigEnvFromEnv;
exports.buildConfigIsVerboseFromEnv = buildConfigIsVerboseFromEnv;
exports.buildConfigDefaultPuppeteerTimeoutFromEnv = buildConfigDefaultPuppeteerTimeoutFromEnv;
exports.buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv = buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv;
const dotenv_1 = __importDefault(require("dotenv"));
const types_1 = require("./types");
dotenv_1.default.config();
function buildConfigFromEnv() {
    return {
        env: buildConfigEnvFromEnv(),
        isVerbose: buildConfigIsVerboseFromEnv(),
        defaultPuppeteerTimeout: buildConfigDefaultPuppeteerTimeoutFromEnv(),
        workflows: {
            getAvailableAppointmentConsulates: buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv(),
        },
    };
}
function buildConfigEnvFromEnv() {
    return process.env.NODE_ENV === 'production' ? types_1.Env.PRODUCTION : types_1.Env.DEVELOPMENT;
}
function buildConfigIsVerboseFromEnv() {
    if (process.env.VERBOSE) {
        return Boolean(JSON.parse(process.env.VERBOSE.toLowerCase()));
    }
    return false;
}
function buildConfigDefaultPuppeteerTimeoutFromEnv() {
    if (process.env.DEFAULT_PUPPETEER_TIMEOUT) {
        return parseInt(process.env.DEFAULT_PUPPETEER_TIMEOUT);
    }
    return 5000;
}
function buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv() {
    if (process.env.GET_AVAILABLE_APPOINTMENT_CONSULATES_WORKFLOW_CONFIG_IN_JSON) {
        return JSON.parse(process.env.GET_AVAILABLE_APPOINTMENT_CONSULATES_WORKFLOW_CONFIG_IN_JSON);
    }
}
