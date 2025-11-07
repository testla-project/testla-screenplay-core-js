import { Actor, testlaScreenplayEventEmitter, LogEvent } from '../src';
import { UseAbility } from './implementations/UseAbility';
import { UtilizeAction } from './implementations/UtilizeAction';

describe('Testing logging', () => {
    test('Testing that log events are emitted correctly', async () => {
        const logStack: LogEvent[] = [];
        testlaScreenplayEventEmitter.on('logEvent', (event: LogEvent) => {
            const timeAdjustedEvent = { ...event, time: new Date('2025-11-06T07:10:47.065Z') };
            logStack.push(timeAdjustedEvent);
        });

        const TestActor = Actor.named('Test Actor')
            .can(UseAbility.using('test'));
        await TestActor.attemptsTo(
            UtilizeAction.getAbilityPayload(),
        );

        expect(JSON.stringify(logStack)).toEqual('[{"activityType":"action","activityAction":"attemptsTo","activityDetails":[{"methodName":"UtilizeAction"}],"status":"started","actor":"Test Actor","skipOnFailLevel":0,"wrapLevel":0,"time":"2025-11-06T07:10:47.065Z"},{"activityType":"action","activityAction":"attemptsTo","activityDetails":[{"methodName":"UtilizeAction"}],"status":"passed","actor":"Test Actor","skipOnFailLevel":0,"wrapLevel":0,"time":"2025-11-06T07:10:47.065Z"}]');
    });
});
