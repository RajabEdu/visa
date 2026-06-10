import { Page } from 'puppeteer';
import { Logger } from 'winston';
import WorkflowCommand from "./workflow-command";
import CronExecution from "./cron-execution";
import { Config, DeepPartial } from "./types";
import WorkflowExecutionState from "./workflow-execution-state";
import RetryableExecution from "./retryable-execution";
export default abstract class Workflow<TExecutionState extends WorkflowExecutionState = WorkflowExecutionState> extends RetryableExecution<void> {
    protected config: Config;
    protected puppeteer: any;
    private executionState;
    private browser?;
    private page?;
    private cronExecution?;
    static getId(): string;
    constructor({ config, logger }: {
        config: Config;
        logger: Logger;
    });
    buildDefaultConfig(): DeepPartial<Config>;
    retryableExecute(): Promise<void>;
    abstract buildExecutionState(): TExecutionState;
    getId(): string;
    abstract buildCommands({ logger, page, executionState, }: {
        logger: Logger;
        page: Page;
        executionState: TExecutionState;
    }): WorkflowCommand<TExecutionState>[];
    private executeCommands;
    private getOrBuildPage;
    protected buildPage(): Promise<Page>;
    private getOrBuildBrowser;
    private buildBrowser;
    private buildBrowserOptions;
    private destroyPage;
    private destroyBrowser;
    getOrBuildCronExecution(): CronExecution;
    abstract buildCronExpression(): string;
}
