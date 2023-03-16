import {
    IActor, IAbility, IAction, IQuestion, ITask,
} from '../interfaces';

/**
 * Actors use abilities in order to execute tasks/actions and answer questions.
 */
export class Actor implements IActor {
    // collection of attributes assigned to the actor
    attributes: { [key: string]: any } = {};

    /**
     * Store an attribute in the actors attribute collection.
     * @param key attribute name
     * @param value attribute value
     * @returns {Actor}
     */
    public with(key: string, value: any): Actor {
        this.attributes = { ...this.attributes, [key]: value };
        return this;
    }

    /**
     * Get an attribute from the actors attribute collection.
     * @param key Key for the attribute
     * @returns Value for the requested attribute
     */
    public states(key: string): any {
        return this.attributes[key];
    }

    // map of abilities of this Actor
    private abilityMap: Map<string, IAbility> = new Map();

    /** Create a new Actor with a given name. */
    public static named(name: string): Actor {
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
    public can(...abilities: IAbility[]) : Actor {
        abilities.forEach((ability) => {
            const abilityIdentifier = `${ability.name}${ability.alias ? `-${ability.alias}` : ''}`;
            if (this.abilityMap.get(abilityIdentifier) !== undefined) {
                throw (new Error('Error: Ability with this identifier already defined'));
            }
            this.abilityMap.set(abilityIdentifier, ability);
        });
        return this;
    }

    /**
     * Executes the given Tasks/Actions.
     *
     * @param activities a list of tasks to execute.
     */
    public async attemptsTo(...activities: (ITask | IAction)[]): Promise<any> {
        // execute each activity in order.
        const reducefn = async (chain: Promise<any>, activity: ITask | IAction): Promise<any> => chain.then(async (): Promise<any> => {
            const innerRes = await activity.performAs(this);
            return Promise.resolve(innerRes);
        });
        const attempsRes = await activities.reduce(reducefn, Promise.resolve());
        return Promise.resolve(attempsRes);
    }

    /**
     * Verify if the actor has the given ability.
     *
     * @param ability the ability.
     */
    public withAbilityTo(ability: IAbility, alias?: string): IAbility {
        const abilityIdentifier = `${ability.name}${alias ? `-${alias}` : ''}`;
        if (!this.abilityMap.has(abilityIdentifier)) {
            throw new Error(`Error: This Actor does not have the required ability '${ability.name}'${alias ? `(with alias '${alias}')` : ''}!`);
        }
        return this.abilityMap.get(abilityIdentifier) as IAbility;
    }

    /**
     * Ask a question.
     *
     * @param question the question to ask.
     */
    public async asks<T>(question: IQuestion<T>): Promise<T> {
        return question.answeredBy(this);
    }
}
