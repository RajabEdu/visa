"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attempt_1 = require("@lifeomic/attempt");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
class RetryExecution {
    constructor({ logger, execute, retryOptions, }) {
        this.beforeAttempt = (context, options) => {
            var _a;
            this.logger.debug(`Executing attempt number ${context.attemptNum + 1} of ${options.maxAttempts}...`);
            if ((_a = this.retryOptions) === null || _a === void 0 ? void 0 : _a.beforeAttempt) {
                this.retryOptions.beforeAttempt(context, options);
            }
        };
        this.retryExecute = execute;
        this.retryOptions = retryOptions;
        this.logger = logger.child({
            retryOptions: this.retryOptions,
        });
    }
    execute() {
        return (0, attempt_1.retry)(this.retryExecute, this.buildRetryOptions());
    }
    buildRetryOptions() {
        return (0, lodash_merge_1.default)(this.retryOptions, {
            beforeAttempt: this.beforeAttempt,
        });
    }
}
exports.default = RetryExecution;
