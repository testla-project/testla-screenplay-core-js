# Testla

## Introduction

The testla project is a collection of tools to help in the QA automation process.
testla screenplay core defines the frame for an implementation of the Screenplay Pattern.

## Screenplay Pattern Overview

The Screenplay Pattern is a design pattern for automatic interacting with software products. It can handle any type of interaction - (Web-) UI, API. Test automation is the most popular use case for the pattern. 

## The Design

The Screenplay Pattern can be summarized in one line: Actors use Abilities to perform Interactions. 
- **Actors**, initiate Interactions
- **Abilities**, enable Actors to initiate Interactions
- **Interactions** are procedures that exercise the behaviors under test
  - **Tasks**, executes Actions on the features under test
  - **Actions**, use Locators, Requests, etc. to interact with the features under Test
  - **Questions**, return state about the features under test

The diagram below illustrates how these parts fit together:

![Screenplay Pattern](./doc/assets/screenplay.png)

### Actors and Abilities

The Screenplay Pattern is a user-centric model with users and external systems interacting with the system under test represented as actors. `Actors` are a key element of the pattern as they are the ones performing the test scenarios.

Actors need `abilities` to enable them interacting with any interface of the system. How does it know how to connect your actors to those interfaces? Well, it doesn't unless you tell it, and that's where abilities come into play.

#### Define your own ability

```typescript
import { Ability } from '@testla/screenplay';

export class MyBrowseAbility extends Ability {
    private constructor(page: Page) {
        super();
        this.page = page;
    }
    
    // passing in whatever is required for this ability
    // in our example a page object from playwright
    public static using(page: Page): MyBrowseAbility {
        return new MyBrowseAbility(page);
    }

    // this function is essential so that the actor can execute
    // a task/action with this ability
    public static as(actor: Actor): MyBrowseAbility {
        return actor.withAbilityTo(this) as MyBrowseAbility;
    }

    // navigate functionality by using playwright spicific code for our example
    public async navigate(url: string): Promise<void> {
        return this.page.goto(url);
    }

    // fill functionality by using playwright spicific code for our example
    public async fill(locator: string, value: string): Promise<void> {
        return this.page.fill(locator, value);
    }

    // click functionality by using playwright spicific code for our example
    public async click(locator: string): Promise<void> {
        return this.page.click(locator);
    }

    // find functionality by using playwright spicific code for our example
    public async find(locator: string): Promise<any> {
        return this.page.waitForSelector(locator);
    }

    // further implementations
    // ...
}
```

#### Defining an Actor with an Ability

For example, Ute will interact with the Web UI using the above defined ability. 

```typescript
const Ute = Actor.named('Ute').can(MyBrowseAbility.using(page));
```

### Custom Actions

#### How to define a custom action

`Abilities` enable actors to perform `actions` with the system under test. `Actions` are command objects that instruct an actor how to use their abilities to perform the given activity. 

```typescript
import { Action } from '@testla/screenplay';

export class Navigate extends Action {
    // typescript requires class variable definitions
    private readonly url: string;

    private constructor(url: string) {
        super();
        this.url = url;
    }

    // the actual implementation of the action
    public performAs(actor: Actor): Promise<any> {
        return MyBrowseAbility.as(actor).navigate(this.url);
    }

    // static member method to invoke the action
    public static to(url: string): Navigate {
        return new Navigate(url);
    }
}
```

#### How to use the custom action

Here, we instruct Ute to use the action to navigate to a web page. 

```typescript
await Ute.attemptsTo(Navigate.to('https://example.com'));
```

### Custom Tasks

#### How to define a custom task

`Tasks` model sequences of activities and help you capture meaningful steps of an actor workflow in your domain. Typically, tasks correspond to higher-level, business domain-specific activities like to `SignUp`, `PlaceATrade`, `TransferFunds`, and so on. 

```typescript
import { Task } from '@testla/screenplay';

export class Login extends Task {
    // the actual implementation of the task
    public async performAs(actor: Actor): Promise<any> {
        return actor.attemptsTo(
            Navigate.to('https://www.my-fancy-url.com'),
            Fill.with('#username', actor.username || ''),
            Fill.with('#password', actor.password || ''),
            Click.on('#login-button'),
        );
    }

    // static member method to invoke the task
    public static toApp(): Login {
        return new Login();
    }
}
```
#### How to use the custom task

Here, we instruct Ute to go through the login flow of an app. 

```typescript
await Ute.attemptsTo(Login.toApp());
```

### Custom Questions

#### How to define a custom question

Apart from enabling interactions, abilities also enable actors to answer questions about the state of the system under test. 

```typescript
import { Question } from '@testla/screenplay';

export class LoginStatus extends Question<any> {
    private constructor(private checkMode: 'toBe' | 'notToBe') {
        super();
    }
    
    // the actual implementation of the question
    public async answeredBy(actor: Actor): Promise<any> {
        let success = false;

        try {
            await MyBrowseAbility.as(actor).find('#logged-in-indicator');
            success = true;
        }

        expect(success).toBe(this.checkMode === 'toBe');
        return true;
    }

    static get toBe() {
        return new LoginStatus('toBe');
    }

    static get notToBe() {
        return new LoginStatus('notToBe');
    }

    public successful(): LoginStatus {
        return this;
    }
}
```

#### How to use the custom question

For example, we could instruct Ute to ask the question about the last response status. 

```typescript
await Ute.asks(LoginStatus.toBe.successful());
```

### Write your first test

```typescript
import { Actor } from "@testla/screenplay";

test.describe('My Test', () => {
    test('My first test', async ({ page }) => {
        const ute = Actor.named('Ute')
            .with('username', 'ute')
            .with('password', 'ute-password');
            .can(MyBrowseAbility.using(page));

        await ute.attemptsTo(Login.toApp());

        await ute.asks(LoginStatus.toBe.successful());
    });
});
```

### Proceeding with the test when an action/task fails

You may have actions or tasks which might (expectedly) fail during the test. An example is to click an element if it is present while it is also fine to proceed with the test when the element is not available.

This can be achieved as follows:

```javascript
await actor.attemptsTo(
    // this action might fail but the test will continue
    Click.on('#eventually-available').orSkipOnFail,
    Click.on('#definitely-available'),
);
```

### Use failing questions for test flow controls

In some cases you may want to ask questions to find out about the status of the system under test to make decisions on how to move on with your test. In order to not fail a test but receive information about questions being answered negative you can use `failAsFalse` on a question which then returns a boolean value instead.

```javascript
// find out if question was answered with false
const wasLoggedIn = await actors.asks(
    Login.toBe.successful().failAsFalse,
);

// proceed based on answer from above
if (wasLoggedIn === false) {
    // some code to be executed on false case
}
```

### Detailed explaination of the internal call flow

To understand the internal component call flow better please refer to the [flow guide](./doc/flows.md). This guide also provides detailed information about how to use aliases for abilities.

## Logging

Testla comes with logging which helps you to debug your test code. When logging is enabled all activities an actor triggers are logged in a comprehensive way to stdout. To enable logging set the DEBUG environment variable as follows:

```typescript
DEBUG=testla:sp
```

To understand how to enable logging in custom Actions and Questions please refer to the [logging guide](./doc/logging.md).

---

# Credits
This library is inspired by the [Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/) as described by Jan Molak and the [Serenity/JS](https://serenity-js.org/) implementation of it. 