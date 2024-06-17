import { LOGGING_IDENTIFIER } from '../constants';
import { CallStackCalledWith, CallStackInfo } from '../interfaces';
import { identifyCaller } from '../utils/call-stack';

export class UsingLogging {
    private callStack?: CallStackInfo[];

    constructor() {
        if (
            // regular formatted console debug logs
            !process.env.DEBUG?.includes(LOGGING_IDENTIFIER)
            // structured logs to be caught for parsing i.e. for playewright reporter
            && process.env.TEASLA_SCREENPLAY_STRUCTURED_LOGS !== 'true'
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
