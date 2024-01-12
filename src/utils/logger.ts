import {
    IAction, ILogable, IQuestion, ITask, IActor,
} from '../interfaces';
import { printCallStack } from './call-stack';

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

const log = (actor: IActor, element: (IQuestion<any> | IAction | ITask) & ILogable): void => {
    if (!process.env.DEBUG?.includes('testla:screenplay')) {
        return;
    }

    const msg = `${
        actor.attributes.name
    } attemptsTo ${
        element.constructor.name
    }${
        printCallStack(element.callStack)
    }`;

    process.stdout.write(`[TESTLA/SCREENPLAY]${blankifyMsg(msg, indentationLevel)}\n`);
};

export default log;
