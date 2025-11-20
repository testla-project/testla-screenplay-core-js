import { identifyCallerByStack, identifyCallerLine } from './call-stack';

const STACKTRACE_LINES_BEFORE_NODE_24 = [
    'Error: ',
    '    at identifyCaller (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.ts:24:23)',
    '    at new UsingLogging (/Users/me/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Action (/Users/me/code/testla-screenplay-core-js/src/screenplay/Action.ts:10:9)',
    '    at new UtilizeAction (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:6:9)',
    '    at Function.getAbilityPayload (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:19:26)',
    '    at /Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27',
    '    at Generator.next (<anonymous>)',
    '    at /Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:4:12)',
    '    at Object.<anonymous> (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:32)',
];

const STACKTRACE_LINES_AFTER_NODE_24 = [
    'Error: ',
    '    at identifyCaller (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.ts:24:23)',
    '    at new UsingLogging (/Users/me/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Action (/Users/me/code/testla-screenplay-core-js/src/screenplay/Action.ts:10:9)',
    '    at new UtilizeAction (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:6:9)',
    '    at UtilizeAction.getAbilityPayload (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/UtilizeAction.ts:19:26)',
    '    at /Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27',
    '    at Generator.next (<anonymous>)',
    '    at /Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:4:12)',
    '    at Object.<anonymous> (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:8:32)',
];

const STACKTRACE_LINES_BEFORE_NODE_24_QUESTION = [
    'Error: ',
    '    at identifyCaller (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.ts:97:23)',
    '    at new UsingLogging (/Users/me/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Question (/Users/me/code/testla-screenplay-core-js/src/screenplay/Question.ts:10:9)',
    '    at new SampleQuestion (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:8:9)',
    '    at Function.get toHave [as toHave] (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:19:16)',
    '    at /Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45',
    '    at Generator.next (<anonymous>)',
    '    at /Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:4:12)',
    '    at Object.<anonymous> (/Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:24:77)',
];

const STACKTRACE_LINES_AFTER_NODE_24_QUESTION = [
    'Error: ',
    '    at identifyCaller (/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.ts:97:23)',
    '    at new UsingLogging (/Users/me/code/testla-screenplay-core-js/src/templates/UsingLogging.ts:18:41)',
    '    at new Question (/Users/me/code/testla-screenplay-core-js/src/screenplay/Question.ts:10:9)',
    '    at new SampleQuestion (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:8:9)',
    '    at SampleQuestion.get toHave [as toHave] (/Users/me/code/testla-screenplay-core-js/__tests__/implementations/SampleQuestion.ts:19:16)',
    '    at /Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45',
    '    at Generator.next (<anonymous>)',
    '    at /Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:8:71',
    '    at new Promise (<anonymous>)',
    '    at Object.<anonymous>.__awaiter (/Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:4:12)',
    '    at Object.<anonymous> (/Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:24:77)',
];

const STACKTRACE_BEFORE_NODE_24 = STACKTRACE_LINES_BEFORE_NODE_24.join('\n');
const STACKTRACE_BEFORE_NODE_24_QUESTION = STACKTRACE_LINES_BEFORE_NODE_24_QUESTION.join('\n');
const STACKTRACE_AFTER_NODE_24 = STACKTRACE_LINES_AFTER_NODE_24.join('\n');
const STACKTRACE_AFTER_NODE_24_QUESTION = STACKTRACE_LINES_AFTER_NODE_24_QUESTION.join('\n');

const LINE_TO_BE_IDENTIFIED = 5;
const CALLER_TO_BE_IDENTIFIED = { caller: 'getAbilityPayload', file: '/Users/me/code/testla-screenplay-core-js/src/utils/call-stack.test.ts:18:27' };
const CALLER_TO_BE_IDENTIFIED_QUESTION = { caller: 'toHave', file: '/Users/me/code/testla-screenplay-core-js/__tests__/logging.spec.ts:27:45' };

describe('Call Stack Util', () => {
    test('identifyCallerLine before node 24', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_BEFORE_NODE_24)).toBe(LINE_TO_BE_IDENTIFIED);
    });

    test('identifyCallerLine after node 24', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_AFTER_NODE_24)).toBe(LINE_TO_BE_IDENTIFIED);
    });

    test('identifyCallerLine before node 24 (question)', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_BEFORE_NODE_24_QUESTION)).toBe(LINE_TO_BE_IDENTIFIED);
    });

    test('identifyCallerLine after node 24 (question)', async () => {
        expect(identifyCallerLine(STACKTRACE_LINES_AFTER_NODE_24_QUESTION)).toBe(LINE_TO_BE_IDENTIFIED);
    });

    test('identifyCallerByStack before node 24', async () => {
        expect(identifyCallerByStack(STACKTRACE_BEFORE_NODE_24)).toEqual(CALLER_TO_BE_IDENTIFIED);
    });

    test('identifyCallerByStack after node 24', async () => {
        expect(identifyCallerByStack(STACKTRACE_AFTER_NODE_24)).toEqual(CALLER_TO_BE_IDENTIFIED);
    });

    test('identifyCallerByStack before node 24 (question)', async () => {
        expect(identifyCallerByStack(STACKTRACE_BEFORE_NODE_24_QUESTION)).toEqual(CALLER_TO_BE_IDENTIFIED_QUESTION);
    });

    test('identifyCallerByStack after node 24 (question)', async () => {
        expect(identifyCallerByStack(STACKTRACE_AFTER_NODE_24_QUESTION)).toEqual(CALLER_TO_BE_IDENTIFIED_QUESTION);
    });
});
