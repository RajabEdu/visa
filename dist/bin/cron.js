#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_config_from_env_1 = __importDefault(require("../build-config-from-env"));
const build_default_logger_1 = __importDefault(require("../build-default-logger"));
const workflow_registry_1 = __importDefault(require("../workflow-registry"));
const env_1 = require("../types/env");
const config = (0, build_config_from_env_1.default)();
const logger = (0, build_default_logger_1.default)();
const workflows = workflow_registry_1.default.getOrInitialize().buildWorkflows({ config, logger });
if (config.env === env_1.Env.DEVELOPMENT) {
    workflows.forEach((workflow) => {
        workflow.execute();
    });
}
if (config.env === env_1.Env.PRODUCTION) {
    workflows.forEach((workflow) => {
        const cron = workflow.getOrBuildCronExecution();
        cron.start();
    });
    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received');
        workflows.forEach((workflow) => {
            const cron = workflow.getOrBuildCronExecution();
            cron.stop();
        });
    });
}
