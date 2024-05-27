import { Actor } from './screenplay/Actor';
import { Ability } from './screenplay/Ability';
import { Action } from './screenplay/Action';
import { Task } from './screenplay/Task';
import { Question } from './screenplay/Question';
import testlaScreenplayEventEmitter from './utils/event-emitter';
import { LogEvent } from './interfaces';
import { printLogEventToStdout } from './utils/print';
import { LOGGING_IDENTIFIER, ACTIVITY_TYPE, EXEC_STATUS } from './constants';

export {
    Actor, Ability, Action, Task, Question, testlaScreenplayEventEmitter,
    ACTIVITY_TYPE, EXEC_STATUS,
};

// register printing logs to stdout if applicable
if (process.env.DEBUG?.includes(LOGGING_IDENTIFIER)) {
    testlaScreenplayEventEmitter.on('logEvent', (event: LogEvent) => printLogEventToStdout(event));
}
