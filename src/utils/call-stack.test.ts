import { identifyCallerByStack, identifyCallerLine } from './call-stack';

const STACKTRACE_LINES_BEFORE_NODE_24 = [
    'Error: ',
    '    at identifyCaller (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.ts:24:23)',
    '    at new UsingLogging (/Users/bru0008k/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Action (/Users/bru0008k/code/testla-screenplay-core-js/src/screenplay/Action.ts:10:9)',
    '    at new UtilizeAction (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:6:9)',
    '    at Function.getAbilityPayload (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:19:26)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27',
    '    at Generator.next (<anonymous>)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:4:12)',
    '    at Object.<anonymous> (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:32)',
    '    at Promise.then.completed (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:298:28)',
    '    at new Promise (<anonymous>)',
    '    at callAsyncCircusFn (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:231:10)',
    '    at _callCircusTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:316:40)',
    '    at processTicksAndRejections (node:internal/process/task_queues:105:5)',
    '    at _runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:252:3)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:126:9)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:121:9)',
    '    at run (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:71:3)',
    '    at runAndTransformResultsToJestFormat (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)',
    '    at jestAdapter (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)',
    '    at runTestInternal (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:367:16)',
    '    at runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:444:34)',
    '    at Object.worker (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/testWorker.js:106:12)',
];

const STACKTRACE_LINES_AFTER_NODE_24 = [
    'Error: ',
    '    at identifyCaller (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.ts:24:23)',
    '    at new UsingLogging (/Users/bru0008k/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Action (/Users/bru0008k/code/testla-screenplay-core-js/src/screenplay/Action.ts:10:9)',
    '    at new UtilizeAction (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:6:9)',
    '    at UtilizeAction.getAbilityPayload (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:19:26)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27',
    '    at Generator.next (<anonymous>)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:4:12)',
    '    at Object.<anonymous> (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:32)',
    '    at Promise.then.completed (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:298:28)',
    '    at new Promise (<anonymous>)',
    '    at callAsyncCircusFn (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:231:10)',
    '    at _callCircusTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:316:40)',
    '    at processTicksAndRejections (node:internal/process/task_queues:105:5)',
    '    at _runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:252:3)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:126:9)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:121:9)',
    '    at run (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:71:3)',
    '    at runAndTransformResultsToJestFormat (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)',
    '    at jestAdapter (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)',
    '    at runTestInternal (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:367:16)',
    '    at runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:444:34)',
    '    at Object.worker (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/testWorker.js:106:12)',
];

const STACKTRACE_LINES_BEFORE_NODE_24_QUESTION = [
    'Error: ',
    '    at identifyCaller (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.ts:97:23)',
    '    at new UsingLogging (/Users/bru0008k/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Question (/Users/bru0008k/code/testla-screenplay-core-js/src/screenplay/Question.ts:10:9)',
    '    at new SampleQuestion (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:8:9)',
    '    at Function.get toHave [as toHave] (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:19:16)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45',
    '    at Generator.next (<anonymous>)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:4:12)',
    '    at Object.<anonymous> (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:24:77)',
    '    at Promise.then.completed (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:298:28)',
    '    at new Promise (<anonymous>)',
    '    at callAsyncCircusFn (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:231:10)',
    '    at _callCircusTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:316:40)',
    '    at processTicksAndRejections (node:internal/process/task_queues:105:5)',
    '    at _runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:252:3)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:126:9)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:121:9)',
    '    at run (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:71:3)',
    '    at runAndTransformResultsToJestFormat (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)',
    '    at jestAdapter (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)',
    '    at runTestInternal (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:367:16)',
    '    at runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:444:34)',
    '    at Object.worker (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/testWorker.js:106:12)',
];

const STACKTRACE_LINES_AFTER_NODE_24_QUESTION = [
    'Error: ',
    '    at identifyCaller (/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.ts:97:23)',
    '    at new UsingLogging (/Users/bru0008k/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Question (/Users/bru0008k/code/testla-screenplay-core-js/src/screenplay/Question.ts:10:9)',
    '    at new SampleQuestion (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:8:9)',
    '    at SampleQuestion.get toHave [as toHave] (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:19:16)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45',
    '    at Generator.next (<anonymous>)',
    '    at /Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:4:12)',
    '    at Object.<anonymous> (/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:24:77)',
    '    at Promise.then.completed (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:298:28)',
    '    at new Promise (<anonymous>)',
    '    at callAsyncCircusFn (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/utils.js:231:10)',
    '    at _callCircusTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:316:40)',
    '    at processTicksAndRejections (node:internal/process/task_queues:105:5)',
    '    at _runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:252:3)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:126:9)',
    '    at _runTestsForDescribeBlock (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:121:9)',
    '    at run (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/run.js:71:3)',
    '    at runAndTransformResultsToJestFormat (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)',
    '    at jestAdapter (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)',
    '    at runTestInternal (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:367:16)',
    '    at runTest (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/runTest.js:444:34)',
    '    at Object.worker (/Users/bru0008k/code/testla-screenplay-core-js/node_modules/jest-runner/build/testWorker.js:106:12)',
];

const STACKTRACE_BEFORE_NODE_24 = STACKTRACE_LINES_BEFORE_NODE_24.join('\n');
const STACKTRACE_BEFORE_NODE_24_QUESTION = STACKTRACE_LINES_BEFORE_NODE_24_QUESTION.join('\n');
const STACKTRACE_AFTER_NODE_24 = STACKTRACE_LINES_AFTER_NODE_24.join('\n');
const STACKTRACE_AFTER_NODE_24_QUESTION = STACKTRACE_LINES_AFTER_NODE_24_QUESTION.join('\n');

describe('Call Stack Util', () => {
    test('identifyCallerLine before node 24', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_BEFORE_NODE_24)).toBe(5);
    });

    test('identifyCallerLine after node 24', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_AFTER_NODE_24)).toBe(5);
    });

    test('identifyCallerLine before node 24 (question)', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_BEFORE_NODE_24_QUESTION)).toBe(5);
    });

    test('identifyCallerLine after node 24 (question)', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_AFTER_NODE_24_QUESTION)).toBe(5);
    });

    test('identifyCallerByStack before node 24', async () => {
        expect(identifyCallerByStack(STACKTRACE_BEFORE_NODE_24)).toEqual({ caller: 'getAbilityPayload', file: '/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27' });
    });

    test('identifyCallerByStack after node 24', async () => {
        expect(identifyCallerByStack(STACKTRACE_AFTER_NODE_24)).toEqual({ caller: 'getAbilityPayload', file: '/Users/bru0008k/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27' });
    });

    test('identifyCallerByStack before node 24 (question)', async () => {
        expect(identifyCallerByStack(STACKTRACE_BEFORE_NODE_24_QUESTION)).toEqual({ caller: 'toHave', file: '/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45' });
    });

    test('identifyCallerByStack after node 24 (question)', async () => {
        expect(identifyCallerByStack(STACKTRACE_AFTER_NODE_24_QUESTION)).toEqual({ caller: 'toHave', file: '/Users/bru0008k/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45' });
    });
});
