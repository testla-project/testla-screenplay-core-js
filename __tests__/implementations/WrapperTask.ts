import { Actor, Task } from '../../src';
import { UtilizeAction } from './UtilizeAction';

export class WrapperTask extends Task {
    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        return actor.attemptsTo(
            UtilizeAction.ability(),
        );
    }

    public static execute(): WrapperTask {
        return new WrapperTask();
    }
}
