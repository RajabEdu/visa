import { Logger } from 'winston';
import { Page } from 'puppeteer';
import { Config, DeepPartial } from "../types";
import Workflow from "../workflow";
import { BuildAppointmentConsulatesWorkflowCommand, NotifyAvailableDatesWorkflowCommand, NavigateToGroupAppointmentWorkflowCommand, SignInWorkflowCommand } from "./commands";
import { GetAvailableAppointmentConsulatesExecutionState } from "./execution-states";
export default class GetAvailableAppointmentConsulatesWorkflow extends Workflow<GetAvailableAppointmentConsulatesExecutionState> {
    static getId(): string;
    buildDefaultConfig(): DeepPartial<Config>;
    buildExecutionState(): GetAvailableAppointmentConsulatesExecutionState;
    buildCommands({ logger, page, executionState, }: {
        logger: Logger;
        page: Page;
        executionState: GetAvailableAppointmentConsulatesExecutionState;
    }): (BuildAppointmentConsulatesWorkflowCommand | NotifyAvailableDatesWorkflowCommand | NavigateToGroupAppointmentWorkflowCommand | SignInWorkflowCommand)[];
    buildCronExpression(): string;
}
