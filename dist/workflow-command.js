"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const retryable_execution_1 = __importDefault(require("./retryable-execution"));
class WorkflowCommand extends retryable_execution_1.default {
    constructor({ logger, config, page, executionState, }) {
        super({ logger });
        this.config = config;
        this.page = page;
        this.executionState = executionState;
        this.logger = this.logger.child({
            commandId: this.getId(),
            config: this.config,
            executionState: this.executionState,
        });
    }
    static getId() {
        throw new Error('Command ID is undefined');
    }
    getId() {
        return this.constructor.getId();
    }
}
exports.default = WorkflowCommand;
