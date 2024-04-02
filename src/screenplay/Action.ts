import {
    IAction, IActor, ILogable,
} from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';

/**
 * Actions can be triggered by calling them from an actor object.
 */
export abstract class Action extends UsingAlias implements IAction, ILogable {
    public canSkipOnFailure = false;

    /**
     *  Makes the provided {@link IActor}
     *  perform this Action.
     *
     * @param {IActor} actor
     * @returns {Promise<any>}
     *
     * @see {@link IActor}
     *
     * @override This method will have to be overridden with the actual integration of an action.
     */
    abstract performAs(actor: IActor): Promise<any>

    /**
     * makes the step pass even if an error is thrown
     */
    public get orSkipOnFail() {
        this.canSkipOnFailure = true;
        this.addToCallStack({ caller: 'orSkipOnFail' });
        return this;
    }
}
