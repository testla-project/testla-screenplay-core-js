export interface IActor {
    // collection of attributes assigned to the actor
    attributes: { [key: string]: any };

    // set attribute
    with(key: string, value: any): IActor;

    // get attribute
    states(key: string): any;

    // connection to questions
    asks<T>(question: IQuestion<T>, activityResult: T): Promise<T>;

    // connection to abilities
    withAbilityTo(ability: IAbility): IAbility;
    can(ability: IAbility): IActor;

    // connection to tasks/actions
    attemptsTo(...activities: (ITask | IAction)[]): Promise<any>;
}

export interface IAbility {
    // this is an empty interface, since every ability has its own
    // call patterns and therefore there is no common ground
    // only the name attribute needs to be set for internal reference
    name: string;
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
}

export interface IQuestion<T> {
    /**
     * Implementation of the query answer.
     *
     * @param {IActor} actor the actor that queries.
     */
    answeredBy(actor: IActor): Promise<T>;
}
