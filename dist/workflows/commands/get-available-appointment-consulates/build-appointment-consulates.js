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
const workflow_command_1 = __importDefault(require("../../../workflow-command"));
class BuildAppointmentConsulatesWorkflowCommand extends workflow_command_1.default {
    static getId() {
        return 'build-appointment-consulates';
    }
    shouldRetry() {
        return true;
    }
    async retryableExecute() {
        const availableConsulatesInput = await this.page.waitForSelector('#appointments_consulate_appointment_facility_id');
        await availableConsulatesInput.select();
        const availableConsulates = await availableConsulatesInput.evaluate((select) => Object.fromEntries(Array.from(select.options)
            .map((option) => [option.value, option.textContent])
            .filter(([cityId]) => Boolean(cityId))));
        const appointmentConsulates = [];
        const { visaGroupId } = this.config.workflows.getAvailableAppointmentConsulates;
        for (const cityId in availableConsulates) {
            const cityName = availableConsulates[cityId];
            const consulateLogger = this.logger.child({ cityId, cityName });
            await availableConsulatesInput.select(cityId);
            let consulateAvailableDatesResponse;
            await this.page.waitForResponse(async (response) => {
                const responseUrl = response.url();
                const doesResponseMatchAvailableDatesEndpoint = Boolean(responseUrl.match(new RegExp(`/niv/schedule/${visaGroupId}/appointment/days/${cityId}.json`)));
                if (doesResponseMatchAvailableDatesEndpoint) {
                    consulateAvailableDatesResponse = response;
                }
                return doesResponseMatchAvailableDatesEndpoint;
            });
            const didConsulateAvailableDatesResponseSucceeded = [200, 304].includes(consulateAvailableDatesResponse.status());
            if (!didConsulateAvailableDatesResponseSucceeded) {
                consulateLogger.debug('Consulate available dates request has failed', {
                    response: consulateAvailableDatesResponse,
                });
                appointmentConsulates.push({ cityId, cityName, availableDates: [] });
                continue;
            }
            const availableAppointments = await consulateAvailableDatesResponse.json();
            const availableDates = availableAppointments.map((availableAppointment) => {
                return dateFns.parse(availableAppointment.date, 'yyyy-MM-dd', new Date());
            });
            if (!availableDates.length) {
                consulateLogger.debug('Consulate available dates list is empty. Did you get soft-banned?', {
                    response: consulateAvailableDatesResponse,
                });
            }
            appointmentConsulates.push({ cityId, cityName, availableDates });
        }
        this.executionState.setAppointmentConsulates(appointmentConsulates);
    }
}
exports.default = BuildAppointmentConsulatesWorkflowCommand;
