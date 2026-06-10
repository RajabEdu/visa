import { TransformableInfo } from 'logform';
import ExecutionState from "./execution-state";
export default class WorkflowExecutionState extends ExecutionState {
    private commandsExecution;
    private totalOfCommands;
    private currentCommand?;
    constructor({ executionId }: {
        executionId: String;
    });
    setTotalOfCommands(totalOfCommands: number): ExecutionState;
    nextCommand(): ExecutionState;
    finish(): ExecutionState;
    initCommands(): void;
    finishCommands(): void;
    buildLoggerLabel(logInfo: TransformableInfo): String | undefined;
}
