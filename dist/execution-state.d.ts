import { TransformableInfo } from 'logform';
export default class ExecutionState {
    protected executionId: String;
    private _hasInitialized;
    constructor({ executionId }: {
        executionId: String;
    });
    hasInitialized(): boolean;
    init(): ExecutionState;
    throwIfHasInitialized(): void;
    finish(): ExecutionState;
    throwIfHasNotInitialized(): void;
    buildLoggerLabel(_: TransformableInfo): String | undefined;
}
