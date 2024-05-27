import EventEmitter from 'node:events';

class TestlaScreenplayEmitter extends EventEmitter {}

const testlaScreenplayEventEmitter = new TestlaScreenplayEmitter();

export default testlaScreenplayEventEmitter;
