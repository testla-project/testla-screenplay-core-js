import {
    BASH_COLOR, EXEC_STATUS, LOGGING_BASE_INDENTATION,
    LOGGING_BLANKS_PER_INDENTATION_LEVEL, LOGGING_IDENTIFIER,
} from '../constants';
import {
    IAction, ILogable, IQuestion, ITask, IActor, ExecStatus,
} from '../interfaces';
import { Question } from '../screenplay/Question';
import { printCallStack, printFilePath } from './call-stack';

/**
 * Current skipOnFail level
 */
let skipOnFailLevel = 0;

/**
 * Highers the skipOnFailLevel level
 */
export const skipOnFailLevelUp = (): void => { skipOnFailLevel += 1; };

/**
 * Lowers the skipOnFailLevel level
 */
export const skipOnFailLevelDown = (): void => { skipOnFailLevel -= 1; };

/**
 * Current indentation level
 */
let indentationLevel = 0;

/**
 * Highers the indentation level
 */
export const indentationLevelUp = (): void => { indentationLevel += 1; };

/**
 * Lowers the indentation level
 */
export const indentationLevelDown = (): void => { indentationLevel -= 1; };

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
const printCurrentTime = () => (new Date())
    .toISOString()
    .substring(11, 23);

/**
 * @param status of the activity
 * @returns status badge
 */
const printStatus = (status: ExecStatus) => {
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

/**
 * Writes the log information directly to stdout
 * @param actor THe actor who triggered an executable
 * @param element The executable
 */
const log = (actor: IActor, element: (IQuestion<any> | IAction | ITask) & ILogable, status: ExecStatus): string | undefined => {
    if (!process.env.DEBUG?.includes(LOGGING_IDENTIFIER)) {
        return undefined;
    }

    const isQuestion = element instanceof Question;

    const msg = `${
        status !== EXEC_STATUS.FAILED ? (isQuestion ? '✔️' : '↪') : '✗'
    } ${
        actor.attributes.name
    } ${
        isQuestion ? 'asks' : 'attemptsTo'
    } ${
        element.constructor.name
    }${
        printCallStack(element.getCallStack?.())
    }`;

    const color = status === EXEC_STATUS.FAILED && skipOnFailLevel === 0 ? BASH_COLOR.RED : BASH_COLOR.RESET;
    const msgActivityAndFile = `${msg}  ${BASH_COLOR.GRAY}${printFilePath(element.getCallStack?.())}${BASH_COLOR.RESET}`;

    process.stdout.write(`${LOGGING_BASE_INDENTATION}${BASH_COLOR.BLUE}testla:sp${BASH_COLOR.GRAY} ${printCurrentTime()}  ${printStatus(status)}${color} ${blankifyMsg(msgActivityAndFile, indentationLevel)}\n`);
    return msgActivityAndFile;
};

export default log;
