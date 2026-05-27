import { LOGGING_IDENTIFIER, STRUCTURED_LOGS_ENVVAR_NAME } from '../constants';
import { CallStackCalledWith, CallStackInfo } from '../interfaces';
import { identifyCaller } from '../utils/call-stack';

export abstract class UsingLogging {
    protected callStack?: CallStackInfo[];

    constructor() {
        if (
            // regular formatted console debug logs
            !process.env.DEBUG?.includes(LOGGING_IDENTIFIER)
            // structured logs to be caught for parsing i.e. for playewright reporter
            && process.env[STRUCTURED_LOGS_ENVVAR_NAME] !== 'true'
        ) {
            return;
        }

        this.callStack = [identifyCaller()];
    }

    protected setCallStackInitializeCalledWith(calledWith: CallStackCalledWith): void {
        if (this.callStack) {
            this.callStack[0].calledWith = calledWith;
        }
    }

    protected addToCallStack(entry: CallStackInfo): void {
        if (this.callStack) {
            this.callStack.push(entry);
        }
    }
}
