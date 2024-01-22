import { CallStackInfo } from '../interfaces';

const RELEVANT_LINE_IN_STACK = 6;

export const identifyCaller = (): { caller: string; file?: string; } => {
    const callerLine = new Error().stack?.split('\n')[RELEVANT_LINE_IN_STACK].trim();
    const isQuestion = (callerLine || '').includes('Function.get ');

    const CALLER_REGEX = !isQuestion
        ? /at Function.(.+) \(/
        : /at Function.get (.+) \[as/;

    const FILE_REGEX = /\((.+)\)/;

    // eslint-disable-next-line
    const callerName = callerLine?.match(CALLER_REGEX);
    const fileName = callerLine?.match(FILE_REGEX);

    return {
        caller: callerName ? callerName[1] : 'unknown',
        file: fileName ? fileName[1] : undefined,
    };
};

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

export const printFilePath = (callStack?: CallStackInfo[]): string => {
    if (callStack && callStack[0]?.file) {
        return `(${callStack[0].file})`;
    }
    return '';
};
