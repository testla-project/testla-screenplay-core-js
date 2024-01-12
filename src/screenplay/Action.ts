import {
    IAction, IActor, CallStackInfo,
} from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';
import { identifyCaller } from '../utils/call-stack';

/**
 * Actions can be triggered by calling them from an actor object.
 */
export abstract class Action extends UsingAlias implements IAction {
    callStack: CallStackInfo;

    constructor() {
        super();
        this.callStack = { caller: identifyCaller() };
    }

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
