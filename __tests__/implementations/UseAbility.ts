import { Ability, Actor } from '../../src';

export class UseAbility extends Ability {
    private constructor(private payload: any) {
        super();
    }

    public static using(payload: any) {
        return new UseAbility(payload);
    }

    public static as(actor: Actor, alias?: any): UseAbility {
        return actor.withAbilityTo(this, alias) as UseAbility;
    }

    public async getPayload() {
        return Promise.resolve(this.payload);
    }

    public async setPayload(payload: any) {
        this.payload = payload;
        return Promise.resolve();
    }
}
