import {
    BASH_COLOR, EXEC_STATUS, LOGGING_BASE_INDENTATION, LOGGING_BLANKS_PER_INDENTATION_LEVEL,
    LOGGING_STATUS_TEXT_ICON,
} from '../constants';
import { ActivityDetail, ExecStatus, LogEvent } from '../interfaces';
import { stringifyLogEvent } from './event';

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
export const getStatusText = (status: ExecStatus) => {
    let badge = '';
    switch (status) {
        case EXEC_STATUS.START:
            badge = 'EXEC';
            break;
        case EXEC_STATUS.SKIPPED:
            badge = 'SKIP';
            break;
        case EXEC_STATUS.SUCCESS:
            badge = 'DONE';
            break;
        case EXEC_STATUS.FAILED:
        default:
            badge = 'FAIL';
    }
    return badge;
};

/**
 * @param status of the activity
 * @returns status text icon
 */
export const getStatusIcon = (status: string): string => {
    switch (status) {
        case EXEC_STATUS.SKIPPED:
            return LOGGING_STATUS_TEXT_ICON.SKIP;
        case EXEC_STATUS.START:
            return LOGGING_STATUS_TEXT_ICON.EXEC;
        case EXEC_STATUS.SUCCESS:
            return LOGGING_STATUS_TEXT_ICON.PASS;
        case EXEC_STATUS.FAILED:
        default:
            return LOGGING_STATUS_TEXT_ICON.FAIL;
    }
};

export const activityDetailsToString = (details: ActivityDetail[]) => details.map((detail) => {
    let detailString = detail.methodName;
    if (detail.parameters) {
        const paramList: string[] = [];
        Object.entries(detail.parameters || {}).forEach(([, value]) => {
            paramList.push(
                typeof value === 'string' ? `"${value}"` : `${value}`,
            );
        });
        detailString += `(${paramList.join(', ')})`;
    }
    return detailString;
}).join('.');

export const printLogEventToStdout = (event: LogEvent, raw = false): void => {
    let log: string;

    if (raw) {
        log = `${stringifyLogEvent(event)}\n`;
    } else {
        const {
            status, actor, activityDetails, activityAction,
            skipOnFailLevel, wrapLevel, location, time,
        } = event;
        const filePath = location ? `${location.file}:${location.line}` : '';
        // const isQuestion = activityType === ACTIVITY_TYPE.QUESTION;

        const msg = `${
            // status !== EXEC_STATUS.FAILED ? (isQuestion ? '✔️' : '↪') : '✗'
            getStatusIcon(status)
        } ${
            actor
        } ${
            activityAction
        } ${
            activityDetailsToString(activityDetails)
        }`;

        const color = status === EXEC_STATUS.FAILED && skipOnFailLevel === 0 ? BASH_COLOR.RED : BASH_COLOR.RESET;
        const statusTextBgColor = status === EXEC_STATUS.FAILED && skipOnFailLevel === 0 ? BASH_COLOR.RED_BG : '';
        const msgActivityAndFile = `${msg}  ${BASH_COLOR.GRAY}(${filePath})${BASH_COLOR.RESET}`;
        log = `${
            LOGGING_BASE_INDENTATION
        }${
            BASH_COLOR.BLUE
        }testla:sp${
            BASH_COLOR.GRAY
        } ${
            getCurrentTime(time)
        }  ${
            statusTextBgColor
        }${
            getStatusText(status)
        }${
            BASH_COLOR.RESET
        }${
            color
        } ${
            blankifyMsg(msgActivityAndFile, wrapLevel)
        }\n`;
    }

    process.stdout.write(log);
};
