import { IAction, IActor } from '../interfaces';

/**
 * Actions can be triggered by calling them from an actor object.
 */
export abstract class Action implements IAction {
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
}
