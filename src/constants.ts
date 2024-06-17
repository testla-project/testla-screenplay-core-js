export const LOGGING_IDENTIFIER = 'testla:sp';

export const BASH_COLOR = {
    GRAY: '\x1B[90m',
    BLUE: '\x1B[94m',
    RED: '\x1B[31m',
    RED_BG: '\x1B[41m',
    RESET: '\x1B[0m',
};

// base indentation to match the pw:api indentation
export const LOGGING_BASE_INDENTATION = '  ';

export const LOGGING_BLANKS_PER_INDENTATION_LEVEL = 4;

export enum EXEC_STATUS {
    'START' = 'start',
    'SUCCESS' = 'success',
    'FAILED' = 'failed',
    'SKIPPED' = 'skipped'
}

export enum ACTIVITY_TYPE {
    'ACTION' = 'action',
    'TASK' = 'task',
    'QUESTION' = 'question'
}
