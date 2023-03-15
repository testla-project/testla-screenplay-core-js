# Flows

In this section it is described how the different components technically play together based on different use cases.

## Assigning of Ability to Actor

```javascript
    Actor.can(Ability.using(SETTINGS))
```
Puts an instance of an Ability into the Actors internal ability map.

## Triggering of actions/tasks

```javascript
    await Actor.attemptsTo(
        Action.execute(),
    )
```
Actors attemptsTo method triggers the Action internal performAs method with the given Actor.
```javascript
    Action.performAs(actor: Actor): Promise<T> {
        const ability = await Ability.as(actor);
        // ... now ability functionality can be used
        return ability.doSomething();
    }
```
The Actions performAs method internally calls the Ability's "as" method to get the instanciated instance from the Actors ability map.
```javascript
    Ability.as(actor: IActor): IAbility {
        return actor.withAbilityTo(this);
    }
```
The Actors withAbilityTo method actually gets the instance from the map.

## Triggering of questions

Questions per se follow the same flow as actions/tasks.
The only difference is the names of internal methods.
So is attemptsTo substituted with asks and performAs with answeredBy.

## Special case aliased ability

tbd
