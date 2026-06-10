"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execution_state_1 = __importDefault(require("./execution-state"));
class WorkflowExecutionState extends execution_state_1.default {
    constructor({ executionId }) {
        super({ executionId });
        this.totalOfCommands = 0;
        this.commandsExecution = new execution_state_1.default({ executionId });
    }
    setTotalOfCommands(totalOfCommands) {
        this.commandsExecution.throwIfHasInitialized();
        this.totalOfCommands = totalOfCommands;
        return this;
    }
    nextCommand() {
        this.commandsExecution.throwIfHasNotInitialized();
        const nextCommand = typeof this.currentCommand === 'number' ? this.currentCommand + 1 : 1;
        const doesNextCommandExist = nextCommand <= this.totalOfCommands;
        if (!doesNextCommandExist) {
            throw new Error('Workflow has already reached the last command');
        }
        this.currentCommand = nextCommand;
        return this;
    }
    finish() {
        super.finish();
        this.currentCommand = undefined;
        return this;
    }
    initCommands() {
        this.throwIfHasNotInitialized();
        this.commandsExecution.init();
    }
    finishCommands() {
        this.throwIfHasNotInitialized();
        this.commandsExecution.finish();
    }
    buildLoggerLabel(logInfo) {
        const label = super.buildLoggerLabel(logInfo);
        const shouldLogProgressOfCommands = this.commandsExecution.hasInitialized();
        if (shouldLogProgressOfCommands) {
            return `${label} [${this.currentCommand}/${this.totalOfCommands}]`;
        }
        return label;
    }
}
exports.default = WorkflowExecutionState;
