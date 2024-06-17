import {
    ACTIVITY_TYPE,
} from '../constants';
import {
    IAction, ILogable, IQuestion, ITask, IActor, ExecStatus, LogEvent, ActivityType,
} from '../interfaces';
import { Question } from '../screenplay/Question';
import { Task } from '../screenplay/Task';
import { printCallStack, getFilePath } from './call-stack';
import testlaScreenplayEventEmitter from './event-emitter';

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

const identifyActivityType = (element: (IQuestion<any> | IAction | ITask) & ILogable): ActivityType => {
    if (element instanceof Question) {
        return ACTIVITY_TYPE.QUESTION;
    }
    if (element instanceof Task) {
        return ACTIVITY_TYPE.TASK;
    }
    return ACTIVITY_TYPE.ACTION;
};

/**
 * Writes the log information directly to stdout
 * @param actor THe actor who triggered an executable
 * @param element The executable
 */
const log = (actor: IActor, element: (IQuestion<any> | IAction | ITask) & ILogable, status: ExecStatus): void => {
    const activityType = identifyActivityType(element);
    const evt: LogEvent = {
        activityType,
        activityAction: activityType === ACTIVITY_TYPE.QUESTION ? 'asks' : 'attemptsTo',
        activityDetails: `${
            element.constructor.name
        }${
            printCallStack(element.getCallStack?.())
        }`,
        status,
        actor: actor.attributes.name,
        filePath: getFilePath(element.getCallStack?.()),
        skipOnFailLevel,
        wrapLevel: indentationLevel,
        time: new Date(),
    };
    testlaScreenplayEventEmitter.emit('logEvent', evt);
};

export default log;
