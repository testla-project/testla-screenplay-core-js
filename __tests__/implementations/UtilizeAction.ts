import { Actor, Action } from '../../src';
import { UseAbility } from './UseAbility';

export class UtilizeAction extends Action {
    constructor(private mode: 'get' | 'set' = 'get', private payload?: any) {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        const ability = UseAbility.as(actor, this.abilityAlias);
        if (this.mode === 'set') {
            return ability.setPayload(this.payload);
        }
        return ability.getPayload();
    }

    public static getAbilityPayload(): UtilizeAction {
        const instance = new UtilizeAction();
        instance.callStack.calledWith = {};
        return instance;
    }

    public static setAbilityPayload(payload: any): UtilizeAction {
        const instance = new UtilizeAction('set', payload);
        instance.callStack.calledWith = { payload };
        return instance;
    }
}
