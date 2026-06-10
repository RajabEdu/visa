"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_execution_state_1 = __importDefault(require("../../workflow-execution-state"));
class GetAvailableAppointmentConsulatesExecutionState extends workflow_execution_state_1.default {
    setAppointmentConsulates(appointmentConsulates) {
        this.throwIfHasNotInitialized();
        this.appointmentConsulates = appointmentConsulates;
    }
    getAppointmentConsulatesOrThrow() {
        this.throwIfHasNotInitialized();
        if (!this.appointmentConsulates) {
            throw new Error('Appointment Consulates are undefined');
        }
        return this.appointmentConsulates;
    }
}
exports.default = GetAvailableAppointmentConsulatesExecutionState;
