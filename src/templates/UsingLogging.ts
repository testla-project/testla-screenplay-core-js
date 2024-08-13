import { LOGGING_IDENTIFIER, STRUCTURED_LOGS_ENVVAR_NAME } from '../constants';
import { CallStackCalledWith, CallStackInfo } from '../interfaces';
import { identifyCaller } from '../utils/call-stack';

export class UsingLogging {
    private callStack?: CallStackInfo[];

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

    setCallStackInitializeCalledWith(calledWith: CallStackCalledWith) {
        if (this.callStack) {
            this.callStack[0].calledWith = calledWith;
        }
    }

    addToCallStack(entry: CallStackInfo) {
        if (this.callStack) {
            this.callStack.push(entry);
        }
    }

    getCallStack() {
        return this.callStack;
    }
}
