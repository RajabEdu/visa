import { AttemptFunction, AttemptOptions } from '@lifeomic/attempt';
import { Logger } from 'winston';
import Execution from "./execution";
export default class RetryExecution<TExecutionOutput> implements Execution<TExecutionOutput> {
    private logger;
    private retryExecute;
    private retryOptions;
    constructor({ logger, execute, retryOptions, }: {
        logger: Logger;
        execute: AttemptFunction<TExecutionOutput>;
        retryOptions: AttemptOptions<TExecutionOutput> | null;
    });
    execute(): Promise<TExecutionOutput>;
    private buildRetryOptions;
    private beforeAttempt;
}
