import { Actor, Question } from '../../src';
import { UseAbility } from './UseAbility';

export class SampleQuestion extends Question<boolean> {
    private val: any;

    private constructor(private checkMode: 'toHave' | 'notToHave') {
        super();
    }

    public async answeredBy(actor: Actor): Promise<boolean> {
        const ability = UseAbility.as(actor, this.abilityAlias);
        const payload = await ability.getPayload();
        expect(this.val === payload).toBe(this.checkMode === 'toHave');
        return true;
    }

    static get toHave() {
        return new SampleQuestion('toHave');
    }

    static get notToHave() {
        return new SampleQuestion('notToHave');
    }

    public payload(val: any): SampleQuestion {
        this.val = val;
        this.addToCallStack({ caller: 'payload', calledWith: { val } });
        return this;
    }
}
