import { CallStackInfo } from '../interfaces';

export const identifyCaller = (): string => {
    const callerLine = new Error().stack?.split('\n')[6].trim();
    const callerName = callerLine?.match(/at Function.(.+) \(/);
    return callerName ? callerName[1] : 'unknown';
};

export const printCallStack = (callStack?: CallStackInfo[]): string => {
    if (!callStack) {
        return '';
    }

    return callStack
        .map((info: CallStackInfo) => `.${
            info.caller
        }(${
            Object.entries(info.calledWith || {})
                .map(([key, value]) => `${key}: ${
                    typeof value === 'string' ? `'${value}'` : value
                }`)
        })`)
        .join('');
};
