"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class CronExecution {
    constructor({ execute, cronExpression, logger }) {
        this.execute = execute;
        this.cronExpression = cronExpression;
        this.logger = logger.child({
            cronExpression: this.cronExpression,
        });
    }
    start() {
        if (this.scheduledTask) {
            throw new Error('Cron has already started');
        }
        this.logger.debug('Starting cron...');
        this.scheduledTask = node_cron_1.default.schedule(this.cronExpression, () => {
            this.execute();
        });
    }
    stop() {
        if (!this.scheduledTask) {
            throw new Error('Cron has not started');
        }
        this.logger.debug('Stopping cron...');
        this.scheduledTask.stop();
        this.scheduledTask = undefined;
    }
}
exports.default = CronExecution;
