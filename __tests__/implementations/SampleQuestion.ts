import { Actor, Question } from '../../src';
import { UseAbility } from './UseAbility';

export class SampleQuestion extends Question<boolean> {
    private val: any;

    private constructor(private checkMode: 'toHave' | 'notToHave') {
        super();
    }

    public async answeredBy(actor: Actor): Promise<boolean> {
        const payload = await UseAbility.as(actor).retrievePayload();
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
        return this;
    }
}
