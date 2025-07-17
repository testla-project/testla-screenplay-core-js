import { CallStackInfo, Location } from '../interfaces';

const FILE_REGEX = /at (.+)/;
const CALLER_REGEX_NON_QUESTION = /at Function.(.+) \(/;
const CALLER_REGEX_QUESTION = /at Function.get (.+) \[as/;

/**
 * Identifies the line number of the caller in the stack trace
 * @param lines the stack lines
 * @returns the line number of the caller or -1 if not found
 */
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
 * Shortens the file path by translating it to the relative path to the execution directory
 * @param filePath the file path to shorten
 * @returns shortened filepath
 */
export const shortenFilePath = (filePath: string): string => filePath.replace(process.cwd(), '.');

/**
 * Reverts a short filepath back to the full path
 * @param potentiallyShortFilePath filepath
 * @returns full filepath
 */
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
    return undefined;
};
