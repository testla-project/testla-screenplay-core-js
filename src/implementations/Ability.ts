import { IAbility, IActor } from '../interfaces';

/**
 * Abilities enable tasks/actions to perform specific requirements.
 */
export class Ability implements IAbility {
    public name = this.constructor.name;

    /**
     * Use this Ability as an Actor.
     *
     * @param actor
     */
    public static as(actor: IActor): IAbility {
        return actor.withAbilityTo(this);
    }
}
