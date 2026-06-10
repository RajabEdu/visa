import { Logger } from 'winston';
import { AttemptOptions } from '@lifeomic/attempt';
import Execution from "./execution";
export default abstract class RetryableExecution<TExecutionOutput> implements Execution<TExecutionOutput> {
    protected logger: Logger;
    constructor({ logger }: {
        logger: Logger;
    });
    abstract retryableExecute(): Promise<TExecutionOutput>;
    execute(): Promise<TExecutionOutput>;
    shouldRetry(): boolean;
    buildRetryOptions(): AttemptOptions<TExecutionOutput> | null;
}
