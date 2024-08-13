import { EXEC_STATUS } from '../constants';
import {
    IActor, IAbility, IAction, IQuestion, ITask, ILogable,
} from '../interfaces';
import log, {
    indentationLevelDown, indentationLevelUp, skipOnFailLevelUp, skipOnFailLevelDown,
} from '../utils/logger';
import { Task } from './Task';

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
        const reducefn = async (chain: Promise<any>, activity: (ITask | IAction) & ILogable): Promise<any> => chain.then(async (): Promise<any> => {
            try {
                if (activity.getCanSkipOnFail()) {
                    skipOnFailLevelUp();
                }
                log(this, activity, EXEC_STATUS.START);
                if (activity instanceof Task) {
                    indentationLevelUp();
                }

                let innerRes;
                let skipped = false;

                try {
                    innerRes = await activity.performAs(this);
                } catch (e) {
                    // eslint-disable-next-line
                    if (activity.getCanSkipOnFail()) {
                        skipped = true;
                    } else {
                        throw e;
                    }
                }

                if (activity instanceof Task) {
                    indentationLevelDown();
                }

                if (skipped) {
                    log(this, activity, EXEC_STATUS.FAILED);
                }
                log(this, activity, skipped ? EXEC_STATUS.SKIPPED : EXEC_STATUS.SUCCESS);
                if (activity.getCanSkipOnFail()) {
                    skipOnFailLevelDown();
                }
                return Promise.resolve(innerRes);
            } catch (err) {
                if (activity instanceof Task) {
                    indentationLevelDown();
                }
                log(this, activity, EXEC_STATUS.FAILED);
                if (activity.getCanSkipOnFail()) {
                    skipOnFailLevelDown();
                }
                throw (err);
            }
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
    public async asks<T>(...questions: (IQuestion<T> & ILogable)[]): Promise<T> {
        // execute each activity in order.
        const reducefn = async (chain: Promise<any>, question: IQuestion<T> & ILogable): Promise<any> => chain.then(async (): Promise<any> => {
            try {
                log(this, question, EXEC_STATUS.START);
                const innerRes = await question.answeredBy(this);
                log(this, question, EXEC_STATUS.SUCCESS);
                return Promise.resolve(innerRes);
            } catch (err) {
                if (question.getIsFailAsFalse()) {
                    log(this, question, EXEC_STATUS.SUCCESS);
                    return Promise.resolve(false);
                }

                log(this, question, EXEC_STATUS.FAILED);
                throw (err);
            }
        });
        const attempsRes = await questions.reduce(reducefn, Promise.resolve());
        return Promise.resolve(attempsRes);
    }
}
