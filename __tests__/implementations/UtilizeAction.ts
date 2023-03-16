import { Actor, Action } from '../../src';
import { UseAbility } from './UseAbility';

export class UtilizeAction extends Action {
    constructor(private mode: 'get' | 'set' = 'get', private payload?: any) {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        const ability = UseAbility.as(actor);
        if (this.mode === 'set') {
            return ability.setPayload(this.payload);
        }
        return ability.getPayload();
    }

    public static getAbilityPayload(): UtilizeAction {
        return new UtilizeAction();
    }

    public static setAbilityPayload(payload: any): UtilizeAction {
        return new UtilizeAction('set', payload);
    }
}
