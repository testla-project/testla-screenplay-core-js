import { Actor, Action } from '../../src';
import { UseAbility } from './UseAbility';

export class UtilizeAction extends Action {
    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        return UseAbility.as(actor).retrievePayload();
    }

    public static ability(): UtilizeAction {
        return new UtilizeAction();
    }
}
