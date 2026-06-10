"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_command_1 = __importDefault(require("../../../workflow-command"));
class NavigateToGroupAppointmentWorkflowCommand extends workflow_command_1.default {
    static getId() {
        return 'navigate-to-group-appointment';
    }
    shouldRetry() {
        return true;
    }
    async retryableExecute() {
        await this.page.waitForSelector('body.groups');
        const { visaSystemLocation, visaGroupId } = this.config.workflows.getAvailableAppointmentConsulates;
        await this.page.goto(`https://ais.usvisa-info.com/${visaSystemLocation}/niv/schedule/${visaGroupId}/appointment`, {
            waitUntil: 'networkidle0',
        });
    }
}
exports.default = NavigateToGroupAppointmentWorkflowCommand;
