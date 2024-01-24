import { LOGGING_IDENTIFIER } from '../constants';
import { CallStackCalledWith, CallStackInfo } from '../interfaces';
import { identifyCaller } from '../utils/call-stack';

export class UsingLogging {
    callStack?: CallStackInfo[];

    constructor() {
        if (!process.env.DEBUG?.includes(LOGGING_IDENTIFIER)) {
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
}
