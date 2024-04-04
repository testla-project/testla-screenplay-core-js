import { Actor, Task, Action } from '../../src';
import { UtilizeAction } from './UtilizeAction';

export class WrapperTask extends Task {
    // define the actions / subtasks to execute
    private activities: (Task | Action)[] = [
        UtilizeAction.getAbilityPayload(),
    ];

    private actionSkipable = false;

    // eslint-disable-next-line class-methods-use-this
    public async performAs(actor: Actor): Promise<any> {
        // provide the ability alias to all activities
        this.activities.forEach((activity: Task | Action) => {
            if (this.actionSkipable) {
                // eslint-disable-next-line
                activity.orSkipOnFail;
            }
            activity.withAbilityAlias(this.abilityAlias);
        });

        return actor.attemptsTo(
            ...this.activities,
        );
    }

    public static execute(): WrapperTask {
        const instance = new WrapperTask();
        instance.setCallStackInitializeCalledWith({});
        return instance;
    }

    public get canSkipInnerAction(): WrapperTask {
        this.actionSkipable = true;
        this.addToCallStack({ caller: 'canSkipInnerAction' });
        return this;
    }
}
