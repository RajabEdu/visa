"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const retry_execution_1 = __importDefault(require("./retry-execution"));
class RetryableExecution {
    constructor({ logger }) {
        this.logger = logger;
    }
    execute() {
        if (!this.shouldRetry()) {
            return this.retryableExecute();
        }
        const retryableExecute = new retry_execution_1.default({
            logger: this.logger,
            execute: this.retryableExecute.bind(this),
            retryOptions: this.buildRetryOptions(),
        });
        return retryableExecute.execute();
    }
    shouldRetry() {
        return false;
    }
    buildRetryOptions() {
        return null;
    }
}
exports.default = RetryableExecution;
