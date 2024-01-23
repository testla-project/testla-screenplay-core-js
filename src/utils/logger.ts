import { LOGGING_IDENTIFIER } from '../constants';
import {
    IAction, ILogable, IQuestion, ITask, IActor,
} from '../interfaces';
import { Question } from '../screenplay/Question';
import { printCallStack, printFilePath } from './call-stack';

// base indentation to match the pw:api indentation
const BASE_INDENTATION = '  ';

const BLANKS_PER_LEVEL = 4;

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

    for (let i = 0; i <= level * BLANKS_PER_LEVEL; i += 1) {
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

const BASH_COLOR = {
    GRAY: '\x1B[90m',
    BLUE: '\x1B[94m',
    RESET: '\x1B[0m',
};

/**
 * Writes the log information directly to stdout
 * @param actor THe actor who triggered an executable
 * @param element The executable
 */
const log = (actor: IActor, element: (IQuestion<any> | IAction | ITask) & ILogable): void => {
    if (!process.env.DEBUG?.includes(LOGGING_IDENTIFIER)) {
        return;
    }

    const isQuestion = element instanceof Question;

    const msg = `${
        isQuestion ? '✔️' : '↪'
    } ${
        actor.attributes.name
    } ${
        isQuestion ? 'asks' : 'attemptsTo'
    } ${
        element.constructor.name
    }${
        printCallStack(element.callStack)
    }`;

    process.stdout.write(`${BASE_INDENTATION}${BASH_COLOR.BLUE}testla:sp${BASH_COLOR.GRAY} ${printCurrentTime()}${BASH_COLOR.RESET} ${blankifyMsg(msg, indentationLevel)}  ${BASH_COLOR.GRAY}${printFilePath(element.callStack)}${BASH_COLOR.RESET}\n`);
};

export default log;
