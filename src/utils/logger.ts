import { LOGGING_IDENTIFIER } from '../constants';
import {
    IAction, ILogable, IQuestion, ITask, IActor,
} from '../interfaces';
import { Question } from '../screenplay/Question';
import { printCallStack, printFilePath } from './call-stack';

const blanksPerLevel = 4;

let indentationLevel = 0;

export const indentationLevelUp = (): void => { indentationLevel += 1; };

export const indentationLevelDown = (): void => { indentationLevel -= 1; };

const blankifyMsg = (msg: string, level: number) => {
    let finalMsg = msg;

    for (let i = 0; i <= level * blanksPerLevel; i += 1) {
        finalMsg = ` ${finalMsg}`;
    }

    return finalMsg;
};

const printCurrentTime = () => (new Date())
    .toISOString()
    .substring(11, 23);

const BASH_GRAY = '\x1B[90m';

const BASH_RESET = '\x1B[0m';

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

    process.stdout.write(`${BASH_GRAY}[SCREENPLAY ⏱ ${printCurrentTime()}]${BASH_RESET} ${blankifyMsg(msg, indentationLevel)}  ${BASH_GRAY}${printFilePath(element.callStack)}${BASH_RESET}\n`);
};

export default log;
