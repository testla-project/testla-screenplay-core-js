import { ITask, IActor, ILogable } from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';

/**
 * Tasks can be triggered by calling them from an actor object.
 */
export abstract class Task extends UsingAlias implements ITask, ILogable {
    /**
     * Determines if the step can be skipped on failure
     */
    private canSkipOnFail = false;

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

    /**
     * makes the step pass even if an error is thrown
     */
    public get orSkipOnFail() {
        this.canSkipOnFail = true;
        this.addToCallStack({ caller: 'orSkipOnFail' });
        return this;
    }

    /**
     * Returns the orSkipOnFail state
     * @returns if orSkipOnFail is set
     */
    public getCanSkipOnFail() {
        return this.canSkipOnFail;
    }
}
