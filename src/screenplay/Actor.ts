import {
    IActor, IAbility, IAction, IQuestion, ITask,
} from '../interfaces';

/**
 * Actors use abilities in order to execute tasks/actions and answer questions.
 */
export class Actor implements IActor {
    // collection of attributes assigned to the actor
    attributes: { [key: string]: any } = {};

    // set attribute
    public with(key: string, value: any): IActor {
        this.attributes = { ...this.attributes, [key]: value };
        return this;
    }

    // get attribute
    public tells(key: string): any {
        return this.attributes[key];
    }

    // map of abilities of this Actor
    private abilityMap: Map<string, IAbility> = new Map();

    /** create a new Actor with a given name. */
    public static named(name: string): IActor {
        return new Actor(name);
    }

    /**
     * Sets username and password for the actor.
     *
     * @param username
     * @param password
     * @returns the actor object
     *
     * @deprecated This method is deprecated and will be removed in the future. Use
     */
    public withCredentials(username: string, password: string): Actor {
        this.attributes.username = username;
        this.attributes.password = password;
        return this;
    }

    private constructor(name: string) {
        this.attributes = { name };
    }

    /**
     * Assign one or more abilities to the actor. e.g. Browsing, SFT-Client, HTTP-Client, ...
     *
     * @param abilities the abilities the actor will be able to use.
     */
    public can(...abilities: IAbility[]) : IActor {
        abilities.forEach((ability) => this.abilityMap.set(ability.name, ability));
        return this;
    }

    /**
     * Executes the given Tasks/Actions.
     *
     * @param activities a list of tasks to execute.
     */
    public attemptsTo(...activities: (ITask | IAction)[]): Promise<any> {
        // execute each activity in order.
        const reducefn = (chain: Promise<any>, activity: ITask | IAction): Promise<any> => chain.then((): Promise<any> => activity.performAs(this));
        return activities.reduce(reducefn, Promise.resolve());
    }

    /**
     * Verify if the actor has the given ability.
     *
     * @param ability the ability.
     */
    public withAbilityTo(ability: IAbility): IAbility {
        if (!this.abilityMap.has(ability.name)) {
            throw new Error('Error: This Actor does not have this ability!');
        }
        return this.abilityMap.get(ability.name) as IAbility;
    }

    /**
     * Ask a question.
     *
     * @param question the question to ask.
     */
    public asks<T>(question: IQuestion<T>): Promise<T> {
        return question.answeredBy(this);
    }
}
