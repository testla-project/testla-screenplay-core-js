# Flows

In this section it is described how the different components technically play together based on different use cases.

## General flow without aliasing of abilities

### Assigning of Ability to Actor

```javascript
    Actor.can(Ability.using(SETTINGS));
```
Puts an instance of an Ability into the Actors internal ability map.

### Triggering of actions/tasks

```javascript
    await Actor.attemptsTo(
        Action.execute(),
    );
```
Actors attemptsTo method triggers the Action internal performAs method with the given Actor.
```javascript
    Action.performAs(actor: Actor): Promise<T> {
        const ability = await Ability.as(actor);
        // ... now ability functionality can be used
        return ability.doSomething();
    };
```
The Actions performAs method internally calls the Ability's "as" method to get the instanciated instance from the Actors ability map.
```javascript
    Ability.as(actor: IActor): IAbility {
        return actor.withAbilityTo(this);
    };
```
The Actors withAbilityTo method actually gets the instance from the map.

### Triggering of questions

Questions per se follow the same flow as actions/tasks.
The only difference is the names of internal methods.
So is attemptsTo substituted with asks and performAs with answeredBy.

```javascript
    await Actor.asks(
        Question.toBe.truthy(),
    );
```

```javascript
    Question.answeredBy(actor: Actor): Promise<T> {
        const ability = await Ability.as(actor);
        // ... now ability functionality can be used
        expect(ability.doSomething()).toBe(true);
        return true;
    };
```

## Special flow with aliased ability

It happens that there is the need to make use of the same ability but with different settings. A usecase for that could be to invoke 2 different APIs with different base URLs and authentication tokens.

### Assigning of Abilities to Actor

```javascript
    Actor
        .can(Ability.using(SETTINGS_1))
        .can(Ability.using(SETTINGS_2)).withAlias('aliased');
```
Puts 2 instances of an Ability with different configuration into the Actors internal ability map.
The first one is the default without alias, the second one gets an alias.

### Triggering of actions

```javascript
    await Actor.attemptsTo(
        // trigger action with default ability
        Action.execute(),
        // trigger action with aliased ability
        Action.execute().withAbilityAlias('aliased'),
    );
```
Actors attemptsTo method triggers the Action internal performAs method with the given Actor and the defined ability alias.
```javascript
    Action.performAs(actor: Actor): Promise<T> {
        // this.abilityAlias is provided via Action which extends UsingAlias
        const ability = await Ability.as(actor, this.abilityAlias);
        // ... now ability functionality can be used
        return ability.doSomething();
    };
```
The Actions performAs method internally calls the Ability's "as" method to get the instanciated instance from the Actors ability map.
```javascript
    Ability.as(actor: IActor, alias?: any): IAbility {
        return actor.withAbilityTo(this, alias);
    };
```
The Actors withAbilityTo method actually gets the instance from the map.
If an alias is provided the aliased version of the ability is used else the default one.

### Triggering of tasks

```javascript
    await Actor.attemptsTo(
        // trigger task with default ability
        Task.execute(),
        // trigger task with aliased ability
        Task.execute().withAbilityAlias('aliased'),
    );
```
Tasks are collections of Actions and/or sub-Tasks.
The first usecase is to pass down the defined ability alias to all actions/tasks.
```javascript
    Task.performAs(actor: Actor): Promise<T> {
        // define the actions / subtasks to execute
        const activities: (Task | Action)[] = [
            Action.execute(),
            Task.execute(),
        ];

        // provide the ability alias to all activities
        this.activities.forEach(activity => {
            activity.withAbilityAlias(this.abilityAlias);
        });

        // execute the activities and return the result
        return actor.attemptsTo(
            ...this.activities,
        );
    };
```
The second usecase is to pass down the defined ability alias to only specific actions/tasks.
```javascript
    Task.performAs(actor: Actor): Promise<T> {
        return actor.attemptsTo(
            Action.execute().withAbilityAlias(this.abilityAlias),
            Task.execute(),
        );
    };
```
The third usecase is to pass down the ability aliases independent from any passed in alias.
```javascript
    Task.performAs(actor: Actor): Promise<T> {
        return actor.attemptsTo(
            Action.execute().withAbilityAlias('aliased'),
            Task.execute().withAbilityAlias('another alias'),
        );
    };
```

### Triggering of questions

Questions per se follow the same flow as actions/tasks.
The only difference is the names of internal methods.
So is attemptsTo substituted with asks and performAs with answeredBy.

```javascript
    await Actor.asks(
        Question.toBe.truthy().withAbilityAlias('aliased'),
    );
```

```javascript
    Question.answeredBy(actor: Actor): Promise<T> {
        const ability = await Ability.as(actor, this.abilityAlias);
        // ... now ability functionality can be used
        expect(ability.doSomething()).toBe(true);
        return true;
    };
```