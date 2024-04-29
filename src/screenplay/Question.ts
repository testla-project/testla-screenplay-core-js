import { IActor, ILogable, IQuestion } from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';

/**
 * Questions can be triggered by calling them from an actor object.
 */
export abstract class Question<T> extends UsingAlias implements IQuestion<T>, ILogable {
    /**
     * Implementation of the query answer.
     *
     * @param {IActor} actor the actor that queries.
     * @returns {Promise<any<}
     */
    abstract answeredBy(actor: IActor): Promise<any>

    /**
     * If set to true the question returns fale in case of fail instead of throwing an exception
     */
    private isFailAsFalse = false;

    /**
     * Makes failing questions returning false instead of throwing an exception.
     * As a consequence the test will continue and will not be interrupted.
     */
    public get failAsFalse() {
        this.isFailAsFalse = true;
        this.addToCallStack({ caller: 'failAsFalse' });
        return this;
    }

    /**
     * Returns the failAsFalse state
     * @returns if failAsFalse is set
     */
    public getIsFailAsFalse() {
        return this.isFailAsFalse;
    }
}
