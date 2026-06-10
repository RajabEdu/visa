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
const twilio_1 = __importDefault(require("twilio"));
const dateFns = __importStar(require("date-fns"));
const Eta = __importStar(require("eta"));
const workflow_command_1 = __importDefault(require("../../../workflow-command"));
class NotifyAvailableDatesWorkflowCommand extends workflow_command_1.default {
    static getId() {
        return 'notify-available-dates';
    }
    shouldRetry() {
        return true;
    }
    async retryableExecute() {
        const appointmentConsulates = this.executionState.getAppointmentConsulatesOrThrow();
        const minPreferredDate = this.buildMinPreferredDate();
        const maxPreferredDate = this.buildMaxPreferredDate();
        const consulatesWithAvailableDateWithinPreferredPeriod = appointmentConsulates.map((consulate) => {
            return {
                ...consulate,
                availableDates: consulate.availableDates.filter((availableDate) => {
                    const isPreferredDate = dateFns.isWithinInterval(availableDate, {
                        start: minPreferredDate,
                        end: maxPreferredDate,
                    });
                    if (this.config.isVerbose) {
                        this.logger.debug('Checking if available date is within the preferred period...', {
                            availableDate,
                            minPreferredDate,
                            maxPreferredDate,
                            isPreferredDate,
                        });
                    }
                    return isPreferredDate;
                }),
            };
        });
        const consulatesWithSomePreferredAvailableDate = consulatesWithAvailableDateWithinPreferredPeriod.filter(({ availableDates }) => {
            return availableDates.length > 0;
        });
        const totalOfAvailableDates = this.buildTotalOfAvailableDatesFromAppointmentConsulates(consulatesWithSomePreferredAvailableDate);
        const loggerWithPreferredAvailableDates = this.logger.child({
            consulatesWithAvailableDateWithinPreferredPeriod,
        });
        if (totalOfAvailableDates > 0) {
            loggerWithPreferredAvailableDates.debug(`Notifying ${totalOfAvailableDates} available dates...`);
            await this.notifyAppointmentConsulatesWithAvailableDatesWithinPreferredPeriod(consulatesWithSomePreferredAvailableDate);
            return;
        }
        loggerWithPreferredAvailableDates.debug('Skipping notification...');
    }
    buildMinPreferredDate() {
        const { visaMinAppointmentDate } = this.config.workflows.getAvailableAppointmentConsulates;
        return dateFns.startOfDay(dateFns.parse(visaMinAppointmentDate, 'yyyy-MM-dd', new Date()));
    }
    buildMaxPreferredDate() {
        const { visaMaxAppointmentDate } = this.config.workflows.getAvailableAppointmentConsulates;
        return dateFns.endOfDay(dateFns.parse(visaMaxAppointmentDate, 'yyyy-MM-dd', new Date()));
    }
    buildTotalOfAvailableDatesFromAppointmentConsulates(appointmentConsulates) {
        const totalOfAvailableDates = appointmentConsulates.reduce((partialTotalOfAvailableDates, { availableDates }) => {
            return partialTotalOfAvailableDates + availableDates.length;
        }, 0);
        return totalOfAvailableDates;
    }
    async notifyAppointmentConsulatesWithAvailableDatesWithinPreferredPeriod(appointmentConsulates) {
        const { twilioAccountSid, twilioAuthToken, visaNotificationMessage, visaNotificationMessageLang, twilioCallerNumber, twilioReceiverNumber, } = this.config.workflows.getAvailableAppointmentConsulates;
        const availableCities = appointmentConsulates.map(({ cityName }) => cityName);
        const { cityName: earliestAvailableCityName, date: earliestAvailableDate } = this.buildEarliestAppointmentDateFromAppointmentConsulates(appointmentConsulates);
        const { cityName: latestAvailableCityName, date: latestAvailableDate } = this.buildLatestAppointmentDateFromAppointmentConsulates(appointmentConsulates);
        const totalOfAvailableDates = this.buildTotalOfAvailableDatesFromAppointmentConsulates(appointmentConsulates);
        const messageTemplateVariables = {
            availableCities,
            totalOfAvailableDates,
            earliestAvailableCityName,
            earliestAvailableDate: this.formatDateToLocale(earliestAvailableDate),
            latestAvailableCityName,
            latestAvailableDate: this.formatDateToLocale(latestAvailableDate),
        };
        const message = (new (require("eta").Eta)()).renderString(visaNotificationMessage, messageTemplateVariables);
        this.logger.debug(`Notifying the following message: "${message}"`, { messageTemplateVariables });
        const twilioClient = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
        const twiml = new twilio_1.default.twiml.VoiceResponse();
        twiml.say({
            language: visaNotificationMessageLang,
            loop: 5,
        }, message);
        await twilioClient.calls.create({
            twiml: twiml.toString(),
            from: twilioCallerNumber,
            to: twilioReceiverNumber,
        });
    }
    buildEarliestAppointmentDateFromAppointmentConsulates(appointmentConsulates) {
        const appointmentDates = this.buildAppointmentDatesFromAppointmentConsulates(appointmentConsulates);
        const [earliestAppointment] = appointmentDates.sort((leftAppointmentDate, rightAppointmentDate) => {
            const areLeftAndRightDatesEqual = dateFns.isEqual(leftAppointmentDate.date, rightAppointmentDate.date);
            if (areLeftAndRightDatesEqual) {
                return 0;
            }
            const earliestDate = dateFns.min([leftAppointmentDate.date, rightAppointmentDate.date]);
            const isLeftDateSoonerThanRight = dateFns.isEqual(earliestDate, leftAppointmentDate.date);
            if (isLeftDateSoonerThanRight) {
                return -1;
            }
            return 1;
        });
        return earliestAppointment;
    }
    buildAppointmentDatesFromAppointmentConsulates(appointmentConsulates) {
        const initialAppointmentDates = [];
        return appointmentConsulates.reduce((partialAppointmentDates, consulate) => {
            const { cityId, cityName, availableDates } = consulate;
            const consulateAppointmentDates = availableDates.map((date) => {
                return { cityId, cityName, date };
            });
            return [...partialAppointmentDates, ...consulateAppointmentDates];
        }, initialAppointmentDates);
    }
    buildLatestAppointmentDateFromAppointmentConsulates(appointmentConsulates) {
        const appointmentDates = this.buildAppointmentDatesFromAppointmentConsulates(appointmentConsulates);
        const [latestAppointment] = appointmentDates.sort((leftAppointmentDate, rightAppointmentDate) => {
            const areLeftAndRightDatesEqual = dateFns.isEqual(leftAppointmentDate.date, rightAppointmentDate.date);
            if (areLeftAndRightDatesEqual) {
                return 0;
            }
            const latestDate = dateFns.max([leftAppointmentDate.date, rightAppointmentDate.date]);
            const isLeftDateLaterThanRight = dateFns.isEqual(latestDate, leftAppointmentDate.date);
            if (isLeftDateLaterThanRight) {
                return -1;
            }
            return 1;
        });
        return latestAppointment;
    }
    formatDateToLocale(date) {
        const { visaNotificationMessageLang } = this.config.workflows.getAvailableAppointmentConsulates;
        const locale = require(`date-fns/locale/${visaNotificationMessageLang}`);
        return dateFns.format(date, 'PPP', { locale });
    }
}
exports.default = NotifyAvailableDatesWorkflowCommand;
