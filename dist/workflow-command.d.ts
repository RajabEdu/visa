import { Page } from 'puppeteer';
import { Logger } from 'winston';
import { Config } from "./types";
import ExecutionState from "./execution-state";
import RetryableExecution from "./retryable-execution";
export default abstract class WorkflowCommand<TExecutionState extends ExecutionState> extends RetryableExecution<void> {
    protected config: Config;
    protected page: Page;
    protected executionState: TExecutionState;
    constructor({ logger, config, page, executionState, }: {
        logger: Logger;
        config: Config;
        page: Page;
        executionState: TExecutionState;
    });
    static getId(): string;
    getId(): string;
}
