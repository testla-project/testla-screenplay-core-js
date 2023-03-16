import { Actor, Task } from '../../src';
import { UtilizeAction } from './UtilizeAction';

// TODO: find a way to forward alias from task to all actions inside
export class WrapperTask extends Task {
    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        return actor.attemptsTo(
            UtilizeAction.getAbilityPayload(),
        );
    }

    public static execute(): WrapperTask {
        return new WrapperTask();
    }
}
