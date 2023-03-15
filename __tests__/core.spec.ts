import { Actor } from '../src';
import { UseAbility } from './implementations/UseAbility';
import { UtilizeAction } from './implementations/UtilizeAction';

describe('Testing the core', () => {
    test('Defining an actor who states its name and attributes', async () => {
        const TestActor = Actor.named('Test Actor')
            .with('an attribute', 1);
        expect(TestActor.states('name')).toBe('Test Actor');
        expect(TestActor.states('an attribute')).toBe(1);
    });

    test('Register an ability with an actor', async () => {
        const TestActor = Actor.named('Test Actor')
            .can(UseAbility.using('test'));
        const retrievedValue = await TestActor.attemptsTo(UtilizeAction.ability());
        expect(retrievedValue).toBe('test');
    });
});
