import { Ability, Actor } from '../../src';

export class UseAbility extends Ability {
    private constructor(private payload: any) {
        super();
    }

    public static using(payload: any) {
        return new UseAbility(payload);
    }

    public static as(actor: Actor): UseAbility {
        return actor.withAbilityTo(this) as UseAbility;
    }

    public async retrievePayload() {
        return Promise.resolve(this.payload);
    }
}
