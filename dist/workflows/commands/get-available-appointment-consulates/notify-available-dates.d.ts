import WorkflowCommand from "../../../workflow-command";
import { GetAvailableAppointmentConsulatesExecutionState } from "../../execution-states";
export default class NotifyAvailableDatesWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
    static getId(): string;
    shouldRetry(): boolean;
    retryableExecute(): Promise<void>;
    private buildMinPreferredDate;
    private buildMaxPreferredDate;
    private buildTotalOfAvailableDatesFromAppointmentConsulates;
    private notifyAppointmentConsulatesWithAvailableDatesWithinPreferredPeriod;
    private buildEarliestAppointmentDateFromAppointmentConsulates;
    private buildAppointmentDatesFromAppointmentConsulates;
    private buildLatestAppointmentDateFromAppointmentConsulates;
    private formatDateToLocale;
}
