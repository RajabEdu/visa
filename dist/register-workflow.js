"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterWorkflow;
const workflow_registry_1 = __importDefault(require("./workflow-registry"));
function RegisterWorkflow(workflowClass) {
    const registry = workflow_registry_1.default.getOrInitialize();
    registry.registerWorkflowClass(workflowClass);
}
