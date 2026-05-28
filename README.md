# ![Testla Logo](./doc/testla-logo-32.png) Testla Screenplay

[![NPM Version](https://badge.fury.io/js/@testla%2Fscreenplay.svg)](https://badge.fury.io/js/@testla%2Fscreenplay)
[![Downloads](https://img.shields.io/npm/dm/@testla/screenplay.svg)](https://npm-stat.com/charts.html?package=@testla/screenplay)

## What is Testla Screenplay

**Testla Screenplay** is a free and open-source acceptance testing library that can help you establish a clear link between the expected business functionality and the actual working state of your software system.

We've designed Testla Screenplay to make it easier for you to create test scenarios that build a shared understanding and trust between your business sponsors and delivery teams and to help you prove that your system meets and continues to meet its requirements.

It enables you to create multi-actor acceptance and regression tests that captures your **domain vocabulary**, model your **business workflows**, and help you write **high-quality test automation code** you can reuse across projects and teams.

## Your tests will look like this

```typescript
import { Actor } from "@testla/screenplay";
import { Login } from "@my/task";
import { LoginStatus } from "@my/question";

test.describe('My Test', () => {
    test('My first test', async ({ page }) => {
        const Bob = Actor.named('Bob')
            .with('username', 'Bob')
            .with('password', 'my-password');
            .can(MyBrowseAbility.using(page));

        await Bob.attemptsTo(Login.toApp());

        await Bob.asks(LoginStatus.toBe.successful());
    });
});
```

## Installation

Get started by installing Testla Screenplay using npm. Ofcourse you can also install it via a different package manager of your choise.

```bash
npm install @testla/screenplay
```

If you are setting up a new test project you may want to consider using our installer tool [Create Testla Screenplay](https://testla-project.github.io/testla-screenplay-documentation/modules/create-testla-screenplay/introduction). It will guide you through the install routine letting you choose packages you want to install and creates a full project folder structure.

## 👨‍🏫 Learn Testla Screenplay

Testla Screenplay offers plenty of resources to help you get started with the solution:

- [Screenplay Pattern Overview](https://testla-project.github.io/testla-screenplay-documentation/docs/screenplay-pattern)
- [Guide 🚀️](https://testla-project.github.io/testla-screenplay-documentation/docs/tutorial-basics/introduction) - comprehensive introduction to Testla Screenplay
- [Screenplay Elements](https://testla-project.github.io/testla-screenplay-documentation/modules/testla-screenplay/introduction) - API reference and usage examples for Testla Screenplay Essentials
- [Issues](https://github.com/testla-project/testla-screenplay-core-js/issues) - Feature Requests or Defects

## 📣 Your feedback matters!

Do you find Testla useful? Give it a ⭐ star on GitHub!<br>
Found a bug? Need a feature? Raise [an issue](https://github.com/testla-project/testla-screenplay-core-js/issues?state=open)
or submit a pull request.<br>
Want to get in direct contact with us? Use our [Discord Community](https://discord.com/channels/1194567305489813554/1194607548427411467).

# Credits
This library is inspired by the [Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/) as described by Jan Molak and the [Serenity/JS](https://serenity-js.org/) implementation of it. 