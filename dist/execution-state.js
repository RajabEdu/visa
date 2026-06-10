"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutionState {
    constructor({ executionId }) {
        this._hasInitialized = false;
        this.executionId = executionId;
    }
    hasInitialized() {
        return this._hasInitialized;
    }
    init() {
        this.throwIfHasInitialized();
        this._hasInitialized = true;
        return this;
    }
    throwIfHasInitialized() {
        if (this._hasInitialized) {
            throw new Error('Workflow has already been initialized');
        }
    }
    finish() {
        this.throwIfHasNotInitialized();
        this._hasInitialized = false;
        return this;
    }
    throwIfHasNotInitialized() {
        if (!this._hasInitialized) {
            throw new Error('Workflow has not been initialized yet');
        }
    }
    buildLoggerLabel(_) {
        if (this._hasInitialized) {
            return `[${this.executionId}]`;
        }
    }
}
exports.default = ExecutionState;
