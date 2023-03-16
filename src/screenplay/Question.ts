import { IActor, IQuestion } from '../interfaces';
import { UsingAlias } from '../templates/UsingAlias';

/**
 * Questions can be triggered by calling them from an actor object.
 */
export abstract class Question<T> extends UsingAlias implements IQuestion<T> {
    /**
     * Implementation of the query answer.
     *
     * @param {IActor} actor the actor that queries.
     * @returns {Promise<any<}
     */
    abstract answeredBy(actor: IActor): Promise<any>
}
