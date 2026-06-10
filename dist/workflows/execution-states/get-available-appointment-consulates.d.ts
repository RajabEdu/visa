import { AppointmentConsulate } from "../../types";
import WorkflowExecutionState from "../../workflow-execution-state";
export default class GetAvailableAppointmentConsulatesExecutionState extends WorkflowExecutionState {
    private appointmentConsulates?;
    setAppointmentConsulates(appointmentConsulates: AppointmentConsulate[]): void;
    getAppointmentConsulatesOrThrow(): AppointmentConsulate[];
}
