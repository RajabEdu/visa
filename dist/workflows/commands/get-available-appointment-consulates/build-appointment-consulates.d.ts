import WorkflowCommand from "../../../workflow-command";
import { GetAvailableAppointmentConsulatesExecutionState } from "../../execution-states";
export default class BuildAppointmentConsulatesWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
    static getId(): string;
    shouldRetry(): boolean;
    retryableExecute(): Promise<void>;
}
