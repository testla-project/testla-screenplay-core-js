import { ITask, IActor, CallStackInfo } from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';
import { identifyCaller } from '../utils/call-stack';

/**
 * Tasks can be triggered by calling them from an actor object.
 */
export abstract class Task extends UsingAlias implements ITask {
    callStack: CallStackInfo;

    constructor() {
        super();
        this.callStack = { caller: identifyCaller() };
    }

    /**
     *  Makes the provided {@link IActor}
     *  perform this Task.
     *
     * @param {IActor} actor
     * @returns {Promise<any>}
     *
     * @see {@link IActor}
     *
     * @override This method will have to be overridden wit hthe actual integration of an action.
     */
    abstract performAs(actor: IActor): Promise<any>
}
