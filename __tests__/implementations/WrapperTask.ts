import { Actor, Task, Action } from '../../src';
import { UtilizeAction } from './UtilizeAction';

export class WrapperTask extends Task {
    // defined the actions / subtasks to execute
    private activities: (Task | Action)[] = [
        UtilizeAction.getAbilityPayload(),
    ];
    
    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        // provide the ability aias to all executes
        this.activities.forEach(execute => {
            execute.withAbilityAlias(this.abilityAlias);
        });

        return actor.attemptsTo(
            ...this.activities,
        );
    }

    public static execute(): WrapperTask {
        return new WrapperTask();
    }
}
