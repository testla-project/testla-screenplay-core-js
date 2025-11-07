import { CallStackInfo, Location } from '../interfaces';

// Stack trace patterns
const FILE_REGEX = /at (.+)/;

// Pattern definitions for different Node.js formats and call types
const STACK_PATTERNS = {
    OLD_FORMAT: {
        PREFIX: 'at Function.',
        NON_QUESTION: /at Function.(.+) \(/,
        QUESTION: /at Function.get (.+) \[as/,
    },
    NEW_FORMAT: {
        NON_QUESTION: /^\s*at\s+([A-Za-z_$][A-Za-z0-9_$]*)\.([A-Za-z_$][A-Za-z0-9_$]*)\s*\((.+)\)/,
        QUESTION: /^\s*at\s+([A-Za-z_$][A-Za-z0-9_$]*)\.get\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\[as/,
    },
} as const;

/**
 * Determines if a stack trace line uses the old Node.js format
 * @param line the stack trace line
 * @returns true if it's an old format line
 */
const isOldFormatLine = (line: string): boolean => line.includes(STACK_PATTERNS.OLD_FORMAT.PREFIX);

/**
 * Checks if a line matches any of the caller patterns
 * @param line the stack trace line
 * @returns true if it matches a caller pattern
 */
const isCallerLine = (line: string): boolean => {
    if (isOldFormatLine(line)) {
        return true;
    }

    return STACK_PATTERNS.NEW_FORMAT.NON_QUESTION.test(line)
        || STACK_PATTERNS.NEW_FORMAT.QUESTION.test(line);
};

/**
 * Extracts caller name from any format stack trace line
 * @param line the stack trace line
 * @returns caller name or undefined
 */
const extractCallerName = (line: string): string | undefined => {
    if (isOldFormatLine(line)) {
        const isQuestion = line.includes('Function.get ');
        const pattern = isQuestion ? STACK_PATTERNS.OLD_FORMAT.QUESTION : STACK_PATTERNS.OLD_FORMAT.NON_QUESTION;
        const match = line.match(pattern);
        return match ? match[1] : undefined;
    }

    // Try new format patterns
    let match = line.match(STACK_PATTERNS.NEW_FORMAT.NON_QUESTION);
    if (match) {
        return match[2]; // method name
    }

    match = line.match(STACK_PATTERNS.NEW_FORMAT.QUESTION);
    if (match) {
        return match[2]; // question name
    }

    return undefined;
};

/**
 * Extracts file information from a stack trace line
 * @param line the stack trace line (typically the line after caller line)
 * @returns file path or undefined
 */
const extractFileName = (line: string): string | undefined => {
    const match = line.match(FILE_REGEX);
    return match ? match[1] : undefined;
};

/**
 * Identifies the line number of the caller in the stack trace
 * @param lines the stack lines
 * @returns the line number of the caller or -1 if not found
 */
export const identifyCallerLine = (lines?: string[]): number => {
    if (!lines) {
        return -1;
    }

    return lines.findIndex(isCallerLine);
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

    // Extract caller name and file information
    const callerName = extractCallerName(callerLine);
    const fileName = extractFileName(fileLine);

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
