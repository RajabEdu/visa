"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateFns = __importStar(require("date-fns"));
const workflow_1 = __importDefault(require("../workflow"));
const register_workflow_1 = __importDefault(require("../register-workflow"));
const commands_1 = require("./commands");
const execution_states_1 = require("./execution-states");
let GetAvailableAppointmentConsulatesWorkflow = class GetAvailableAppointmentConsulatesWorkflow extends workflow_1.default {
    static getId() {
        return 'get-available-appointment-consulates';
    }
    buildDefaultConfig() {
        return {
            workflows: {
                getAvailableAppointmentConsulates: {
                    cronExpression: '*/15 * * * *',
                    visaSystemLocation: 'en-br',
                    visaMinAppointmentDate: dateFns.format(dateFns.startOfMonth(new Date()), 'yyyy-MM-dd'),
                    visaMaxAppointmentDate: dateFns.format(dateFns.endOfMonth(new Date()), 'yyyy-MM-dd'),
                    visaNotificationMessage: 'This is Visa Appointment Bot. I found <%= it.totalOfAvailableDates %> available dates. Hurry to reschedule your appointment.',
                    visaNotificationMessageLang: 'en-US',
                },
            },
        };
    }
    buildExecutionState() {
        return new execution_states_1.GetAvailableAppointmentConsulatesExecutionState({
            executionId: this.getId(),
        });
    }
    buildCommands({ logger, page, executionState, }) {
        return [
            new commands_1.SignInWorkflowCommand({ logger, config: this.config, page, executionState }),
            new commands_1.NavigateToGroupAppointmentWorkflowCommand({ logger, config: this.config, page, executionState }),
            new commands_1.BuildAppointmentConsulatesWorkflowCommand({ logger, config: this.config, page, executionState }),
            new commands_1.NotifyAvailableDatesWorkflowCommand({ logger, config: this.config, page, executionState }),
        ];
    }
    buildCronExpression() {
        return this.config.workflows.getAvailableAppointmentConsulates.cronExpression;
    }
};
GetAvailableAppointmentConsulatesWorkflow = __decorate([
    register_workflow_1.default
], GetAvailableAppointmentConsulatesWorkflow);
exports.default = GetAvailableAppointmentConsulatesWorkflow;
