import { EXEC_STATUS, ACTIVITY_TYPE } from './constants';

export interface IActor {
    // collection of attributes assigned to the actor
    attributes: { [key: string]: any };

    // set attribute
    with(key: string, value: any): IActor;

    // get attribute
    states(key: string): any;

    // connection to questions
    asks<T>(...question: IQuestion<T>[]): Promise<T>;

    // connection to abilities
    withAbilityTo(ability: IAbility, alias?: string): IAbility;
    can(ability: IAbility): IActor;

    // connection to tasks/actions
    attemptsTo(...activities: (ITask | IAction)[]): Promise<any>;
}

export type CallStackCalledWith = { [key: string]: any };

export type CallStackInfo = {
    // the called function i.e. the static function to initialize actions/tasks/questions
    caller: string;
    // an object holding key/value pairs for all input attributes
    calledWith?: CallStackCalledWith;
    // the file where the caller is lovcated
    file?: string;
};

export interface ILogable {
    getCallStack?(): CallStackInfo[] | undefined;
}

export interface IAbility {
    // this is an empty interface, since every ability has its own
    // call patterns and therefore there is no common ground
    // only the name attribute needs to be set for internal reference
    name: string;
    // in addition aliases can be set
    alias?: string;
}

/**
 * An object representing an action that an {@link IActor} can perform.
 */
export interface IAction {
    /**
     *  Makes the provided {@link IActor}
     *  perform this Action.
     *
     * @param {IActor} actor
     * @returns {Promise<any>}
     *
     * @see {@link IActor}
     */
    performAs(actor: IActor): Promise<any>;

    /**
     * Returns the failAsFalse state
     * @returns if failAsFalse is set
     */
    getCanSkipOnFail(): boolean;
}

/**
 * An object representing a task that an {@link IActor} can perform.
 */
export interface ITask {
    /**
     *  Makes the provided {@link IActor}
     *  perform this Task.
     *
     * @param {IActor} actor
     * @returns {Promise<any>}
     *
     * @see {@link IActor}
     */
    performAs(actor: IActor): Promise<any>;

    /**
     * Returns the failAsFalse state
     * @returns if failAsFalse is set
     */
    getCanSkipOnFail(): boolean;
}

export interface IQuestion<T> {
    /**
     * Implementation of the query answer.
     *
     * @param {IActor} actor the actor that queries.
     */
    answeredBy(actor: IActor): Promise<T>;

    /**
     * Returns the failAsFalse state
     * @returns if failAsFalse is set
     */
    getIsFailAsFalse(): boolean;
}

export type ExecStatus = EXEC_STATUS;

export type ActivityType = ACTIVITY_TYPE;

export type ActivityDetail = {
    methodName: string;
    parameters?: { [key: string]: any };
};

export type Location = {
    file: string;
    line: number;
    column: number;
};

export type LogEvent = {
    activityType: ActivityType;
    activityAction: string;
    activityDetails: ActivityDetail[];
    status: ExecStatus;
    actor: string;
    location?: Location;
    skipOnFailLevel: number;
    wrapLevel: number;
    time: Date;
};
