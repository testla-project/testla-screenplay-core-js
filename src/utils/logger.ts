import {
    ACTIVITY_TYPE,
} from '../constants';
import {
    IAction, ILogable, IQuestion, ITask, IActor, ExecStatus, LogEvent, ActivityType,
    CallStackInfo,
} from '../interfaces';
import { Question } from '../screenplay/Question';
import { Task } from '../screenplay/Task';
import { getLocation } from './call-stack';
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
 * @param actor The actor who triggered an executable
 * @param element The executable
 */
const log = (actor: IActor, element: (IQuestion<any> | IAction | ITask) & ILogable, status: ExecStatus, time?: Date): void => {
    const activityType = identifyActivityType(element);
    const activityDetails = [{
        methodName: element.constructor.name,
    }];
    const toAdd = element.getCallStack?.()?.map((callstack: CallStackInfo) => ({
        methodName: callstack.caller,
        parameters: callstack.calledWith,
    }));
    activityDetails.push(...(toAdd || []));
    const evt: LogEvent = {
        activityType,
        activityAction: activityType === ACTIVITY_TYPE.QUESTION ? 'asks' : 'attemptsTo',
        activityDetails,
        status,
        actor: actor.attributes.name,
        location: getLocation(element.getCallStack?.()),
        skipOnFailLevel,
        wrapLevel: indentationLevel,
        time: time || new Date(),
    };
    testlaScreenplayEventEmitter.emit('logEvent', evt);
};

export default log;
