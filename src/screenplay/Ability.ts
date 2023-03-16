import { IAbility, IActor } from '../interfaces';

/**
 * Abilities enable tasks/actions to perform specific requirements.
 */
export class Ability implements IAbility {
    /**
     * Name with which the ability is identified internally on actor level.
     */
    public name: string = this.constructor.name;

    public alias?: string = undefined;

    /**
     * Use this Ability as an Actor.
     *
     * @param actor
     */
    public static as(actor: IActor, alias?: string): IAbility {
        return actor.withAbilityTo(this, alias);
    }

    public withAlias(name: string) {
        this.alias = name;
        return this;
    }
}
