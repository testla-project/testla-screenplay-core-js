import { CallStackInfo, Location } from '../interfaces';

const FILE_REGEX = /at (.+)/;
const CALLER_REGEX_NON_QUESTION = /at Function.(.+) \(/;
const CALLER_REGEX_QUESTION = /at Function.get (.+) \[as/;

/**
 * Identifies the line number of the caller in the stack trace
 * @param lines the stack lines
 * @returns the line number of the caller or -1 if not found
 */
export const identifyCallerLine = (lines?: string[]): number => {
    if (!lines) {
        return -1;
    }

    return lines.findIndex((line: string) => {
        // Check for old format before node 24: "at Function."
        if (line.includes('at Function.')) {
            return true;
        }

        // Check for new format as of node 24: "at ObjectName.methodName (filepath)"
        // Extract object name from the line and verify it matches the file path
        const newFormatMatch = line.match(/^\s*at\s+([A-Za-z_$][A-Za-z0-9_$]*)\.[A-Za-z_$][A-Za-z0-9_$]*\s*\((.+)\)/);
        if (newFormatMatch) {
            const objectName = newFormatMatch[1];
            const filePath = newFormatMatch[2];

            // Extract filename without extension from the file path
            const fileMatch = filePath.match(/\/([^\/]+)\.(?:ts|js|tsx|jsx):/);
            if (fileMatch) {
                const fileName = fileMatch[1];
                // Verify that the object name matches the filename
                return objectName === fileName;
            }
        }

        return false;
    });
};

/**
 * Identifies the current caller information by stack string
 * @param stack the stack string
 * @returns caller and file
 */
export const identifyCallerByStack = (stack: string | undefined): { caller: string; file?: string; } => {
    const stackLines = stack?.split('\n') || [''];
    const callerLineNo = identifyCallerLine(stackLines);

    if (callerLineNo === -1) {
        return {
            caller: 'unknown',
        };
    }

    const fileLineNo = callerLineNo + 1;
    const callerLine = stackLines[callerLineNo].trim();
    const fileLine = stackLines[fileLineNo].trim();

    let callerName: string | undefined;

    // Check for old format first: "at Function."
    if (callerLine.includes('at Function.')) {
        const isQuestion = callerLine.includes('Function.get ');
        const callerRegex = !isQuestion
            ? CALLER_REGEX_NON_QUESTION
            : CALLER_REGEX_QUESTION;

        const callerMatch = callerLine.match(callerRegex);
        callerName = callerMatch ? callerMatch[1] : undefined;
    } else {
        // Check for new format: "at ObjectName.methodName (filepath)"
        const newFormatMatch = callerLine.match(/^\s*at\s+([A-Za-z_$][A-Za-z0-9_$]*)\.([A-Za-z_$][A-Za-z0-9_$]*)\s*\((.+)\)/);
        if (newFormatMatch) {
            const methodName = newFormatMatch[2];
            callerName = methodName;
        }
    }

    // Always get filename from the line after the caller line
    const fileMatch = fileLine.match(FILE_REGEX);
    const fileName = fileMatch ? fileMatch[1] : undefined;

    return {
        caller: callerName || 'unknown',
        file: fileName,
    };
};

/**
 * Identifies the current caller information
 * @returns caller and file
 */
export const identifyCaller = (): { caller: string; file?: string; } => {
    const { stack } = new Error();
    return identifyCallerByStack(stack);
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
