"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkflowRegistry {
    static getOrInitialize() {
        if (!this.instance) {
            this.instance = new WorkflowRegistry();
        }
        return this.instance;
    }
    constructor() {
        this.workflowClasses = new Map();
    }
    registerWorkflowClass(WorkflowClass) {
        this.workflowClasses.set(this.getIdOfWorkflowClass(WorkflowClass), WorkflowClass);
        return this;
    }
    getIdOfWorkflowClass(WorkflowClass) {
        return WorkflowClass.getId();
    }
    unregisterWorkflowClass(WorkflowClass) {
        this.workflowClasses.delete(this.getIdOfWorkflowClass(WorkflowClass));
        return this;
    }
    resetWorkflowClasses() {
        this.workflowClasses.clear();
        return this;
    }
    buildWorkflows({ config, logger }) {
        this.loadWorkflowClasses();
        return Array.from(this.workflowClasses).map(([_, WorkflowClass]) => {
            return new WorkflowClass({ config, logger });
        });
    }
    loadWorkflowClasses() {
        // We load all exports from the workflows folder
        // in runtime so they can register themselves
        require("./workflows");
    }
}
exports.default = WorkflowRegistry;
