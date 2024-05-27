import {
    ACTIVITY_TYPE, BASH_COLOR, EXEC_STATUS, LOGGING_BASE_INDENTATION, LOGGING_BLANKS_PER_INDENTATION_LEVEL,
} from '../constants';
import { ExecStatus, LogEvent } from '../interfaces';

/**
 * Indents a message based on the indentation level
 * @param msg the message to be indented
 * @param level the indentation level
 * @returns final formatted message
 */
const blankifyMsg = (msg: string, level: number) => {
    let finalMsg = msg;

    for (let i = 0; i <= level * LOGGING_BLANKS_PER_INDENTATION_LEVEL; i += 1) {
        finalMsg = ` ${finalMsg}`;
    }

    return finalMsg;
};

/**
 * @returns current time (UTC)
 */
const getCurrentTime = (date: Date) => date
    .toISOString()
    .substring(11, 23);

/**
 * @param status of the activity
 * @returns status badge
 */
const getStatusText = (status: ExecStatus, skipOnFailLevel: number) => {
    let badge = '';
    switch (status) {
        case EXEC_STATUS.START:
            badge = 'EXEC';
            break;
        case EXEC_STATUS.FAILED:
            badge = `${skipOnFailLevel === 0 ? BASH_COLOR.RED_BG : ''}FAIL`;
            break;
        case EXEC_STATUS.SKIPPED:
            badge = 'SKIP';
            break;
        default:
            badge = 'DONE';
    }
    return `${badge}${BASH_COLOR.RESET}`;
};

export const printLogEventToStdout = (event: LogEvent) => {
    // if (!process.env.DEBUG?.includes(LOGGING_IDENTIFIER)) {
    //     return undefined;
    // }

    const {
        activityType, status, actor, activityText, activity,
        skipOnFailLevel, wrapLevel, filePath, time,
    } = event;
    const isQuestion = activityType === ACTIVITY_TYPE.QUESTION;

    const msg = `${
        status !== EXEC_STATUS.FAILED ? (isQuestion ? '✔️' : '↪') : '✗'
    } ${
        actor
    } ${
        activity
    } ${
        activityText
    }`;

    const color = status === EXEC_STATUS.FAILED && skipOnFailLevel === 0 ? BASH_COLOR.RED : BASH_COLOR.RESET;
    const msgActivityAndFile = `${msg}  ${BASH_COLOR.GRAY}${filePath}${BASH_COLOR.RESET}`;

    process.stdout.write(`${LOGGING_BASE_INDENTATION}${BASH_COLOR.BLUE}testla:sp${BASH_COLOR.GRAY} ${getCurrentTime(time)}  ${getStatusText(status, skipOnFailLevel)}${color} ${blankifyMsg(msgActivityAndFile, wrapLevel)}\n`);
    return msgActivityAndFile;
};
