"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_command_1 = __importDefault(require("../../../workflow-command"));
class SignInWorkflowCommand extends workflow_command_1.default {
    static getId() {
        return 'sign-in';
    }
    shouldRetry() {
        return true;
    }
    async retryableExecute() {
        const { visaSystemLocation } = this.config.workflows.getAvailableAppointmentConsulates;
        await this.page.goto(`https://ais.usvisa-info.com/${visaSystemLocation}/niv/users/sign_in`, {
            waitUntil: 'networkidle0',
        });
        const emailInputElement = await this.page.waitForSelector('#user_email');
        const { visaCredentialsEmail, visaCredentialsPassword } = this.config.workflows.getAvailableAppointmentConsulates;
        await emailInputElement.click();
        await this.page.keyboard.type(visaCredentialsEmail, { delay: 50 });
        const passwordInputElement = await this.page.waitForSelector('#user_password');
        await passwordInputElement.click();
        await this.page.keyboard.type(visaCredentialsPassword, { delay: 50 });
        const policyAgreementInputElement = await this.page.waitForSelector('#policy_confirmed');
        await policyAgreementInputElement.click();
        await this.page.screenshot({ path: '/tmp/debug.png' });
        await this.page.keyboard.press('Enter');
    }
}
exports.default = SignInWorkflowCommand;
