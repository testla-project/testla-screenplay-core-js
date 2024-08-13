import EventEmitter from 'node:events';

class TestlaScreenplayEventEmitter extends EventEmitter {}

// register the emitter globally
// eslint-disable-next-line
// @ts-ignore
if (!global.testlaScreenplayEventEmitter) {
    // eslint-disable-next-line
    // @ts-ignore
    global.testlaScreenplayEventEmitter = new TestlaScreenplayEventEmitter();
}

// eslint-disable-next-line
// @ts-ignore
export default global.testlaScreenplayEventEmitter;
