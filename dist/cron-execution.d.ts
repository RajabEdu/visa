import { Logger } from 'winston';
export default class CronExecution {
    private execute;
    private cronExpression;
    private logger;
    private scheduledTask?;
    constructor({ execute, cronExpression, logger }: {
        execute: () => any;
        cronExpression: string;
        logger: Logger;
    });
    start(): void;
    stop(): void;
}
