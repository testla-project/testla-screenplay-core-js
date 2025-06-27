import { CallStackInfo, Location } from '../interfaces';

const FILE_REGEX = /at (.+)/;
const CALLER_REGEX_NON_QUESTION = /at Function.(.+) \(/;
const CALLER_REGEX_QUESTION = /at Function.get (.+) \[as/;

const identifyCallerLine = (lines?: string[]): number => {
    if (lines) {
        return lines.findIndex((line: string) => line.includes('at Function.'));
    }
    return -1;
};

/**
 * Identifies the current caller information
 * @returns caller and file
 */
export const identifyCaller = (): { caller: string; file?: string; } => {
    const { stack } = new Error();
    const stackLines = stack?.split('\n') || [''];
    const callerLineNo = identifyCallerLine(stackLines);
    const fileLineNo = callerLineNo + 1;
    const callerLine = stackLines[callerLineNo].trim();
    const fileLine = stackLines[fileLineNo].trim();
    const isQuestion = (callerLine || '').includes('Function.get ');

    const callerRegex = !isQuestion
        ? CALLER_REGEX_NON_QUESTION
        : CALLER_REGEX_QUESTION;

    // eslint-disable-next-line
    const callerName = callerLine?.match(callerRegex);
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
                .map(([, value]) => `${
                    typeof value === 'object' || Array.isArray(value)
                        ? JSON.stringify(value)
                        : typeof value === 'string' ? `'${value}'` : value
                }`)
                .join(', ')
        }${
            info.calledWith ? ')' : ''
        }`)
        .join('');
};

/**
 * Gets the filename without path
 * @param callStack the callstack information
 * @returns string
 */
// export const getFilePath = (callStack?: CallStackInfo[]): string => {
//     if (callStack && callStack[0]?.file) {
//         const path = `${callStack[0].file.split(' ').slice(-1)}`;
//         const cleanedPathArray = path
//             .replaceAll(/[()]/ig, '')
//             // show path relative to execution path
//             .replace(process.cwd(), '.')
//             .split(':');
//         cleanedPathArray.pop();
//         return cleanedPathArray.join(':');
//     }
//     return '';
// };

export const shortenFilePath = (filePath: string): string => filePath.replace(process.cwd(), '.');

export const getFullFilePath = (potentiallyShortFilePath: string): string => (potentiallyShortFilePath.startsWith('./')
    ? potentiallyShortFilePath.replace('./', `${process.cwd()}/`)
    : potentiallyShortFilePath);

/**
 * Gets the location
 * @param callStack the callstack information
 * @returns Location
 */
export const getLocation = (callStack?: CallStackInfo[]): Location | undefined => {
    if (callStack && callStack[0]?.file) {
        const path = `${callStack[0].file.split(' ').slice(-1)}`;
        // show path relative to execution path
        const cleanedPathArray = shortenFilePath(
            path
                .replaceAll(/[()]/ig, ''),
        )
            .split(':');
        return {
            file: cleanedPathArray[0],
            line: parseInt(cleanedPathArray[1], 10) || 0,
            column: parseInt(cleanedPathArray[2], 10) || 0,
        };
    }
};
