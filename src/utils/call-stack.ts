import { CallStackInfo } from '../interfaces';

const RELEVANT_CALLER_LINE_IN_STACK = 6;

const RELEVANT_FILE_LINE_IN_STACK = RELEVANT_CALLER_LINE_IN_STACK + 1;

/**
 * Identifies the current caller information
 * @returns caller and file
 */
export const identifyCaller = (): { caller: string; file?: string; } => {
    const { stack } = new Error();
    const callerLine = stack?.split('\n')[RELEVANT_CALLER_LINE_IN_STACK].trim();
    const fileLine = stack?.split('\n')[RELEVANT_FILE_LINE_IN_STACK].trim();
    const isQuestion = (callerLine || '').includes('Function.get ');

    const CALLER_REGEX = !isQuestion
        ? /at Function.(.+) \(/
        : /at Function.get (.+) \[as/;

    const FILE_REGEX = /at (.+)/;

    // eslint-disable-next-line
    const callerName = callerLine?.match(CALLER_REGEX);
    const fileName = fileLine?.match(FILE_REGEX);

    return {
        caller: callerName ? callerName[1] : 'unknown',
        file: fileName ? fileName[1] : undefined,
    };
};

/**
 * Print full callstack
 * @param callStack the callstack information
 * @returns callstack as a string
 */
export const printCallStack = (callStack?: CallStackInfo[]): string => {
    if (!callStack) {
        return '';
    }

    return callStack
        .map((info: CallStackInfo) => `.${
            info.caller
        }${
            info.calledWith ? '(' : ''
        }${
            Object.entries(info.calledWith || {})
                .map(([key, value]) => `${key}: ${
                    typeof value === 'string' ? `'${value}'` : value
                }`)
        }${
            info.calledWith ? ')' : ''
        }`)
        .join('');
};

/**
 * Prints the filename without path
 * @param callStack the callstack information
 * @returns string
 */
export const printFilePath = (callStack?: CallStackInfo[]): string => {
    if (callStack && callStack[0]?.file) {
        return `(${callStack[0].file.split('/').slice(-1)})`;
    }
    return '';
};
