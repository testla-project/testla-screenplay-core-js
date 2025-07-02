export const LOGGING_IDENTIFIER = 'testla:sp';

export const STRUCTURED_LOGS_ENVVAR_NAME = 'TEASLA_SCREENPLAY_STRUCTURED_LOGS';

export const BASH_COLOR = {
    GRAY: '\x1B[90m',
    BLUE: '\x1B[94m',
    RED: '\x1B[31m',
    RED_BG: '\x1B[41m',
    RESET: '\x1B[0m',
};

export const LOGGING_STATUS_TEXT_ICON = {
    PASS: '✓',
    EXEC: '↪',
    FAIL: '✗',
    SKIP: '⤿',
};

// base indentation to match the pw:api indentation
export const LOGGING_BASE_INDENTATION = '  ';

export const LOGGING_BLANKS_PER_INDENTATION_LEVEL = 4;

export enum EXEC_STATUS {
    'STARTED' = 'started',
    'PASSED' = 'passed',
    'FAILED' = 'failed',
    'SKIPPED' = 'skipped'
}

export enum ACTIVITY_TYPE {
    'ACTION' = 'action',
    'TASK' = 'task',
    'QUESTION' = 'question'
}
