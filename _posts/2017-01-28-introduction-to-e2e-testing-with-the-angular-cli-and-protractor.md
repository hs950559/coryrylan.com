---
layout: post
title: Introduction to E2E Testing with the Angular CLI and Protractor
description: Learn how to write end to end tests or also known as integration tests with the Angular CLI and Protractor
keywords: Cory Rylan, Angular 2, Angular, Protractor, E2E
tags: angular protractor
date: 2017-01-31
permalink: /blog/introduction-to-e2e-testing-with-the-angular-cli-and-protractor
demo: https://github.com/splintercode/ng-pokedex
---

{% include ng-version.html %}

<h4>Early Draft Post</h4>

End to end testing (E2E) or also known as integration testing is a great way to make sure at a high level overview 
that our applications function correctly. Commonly we use E2E tests to help ensure our components are working properly together
to cohesively make a fully functioning feature. E2E tests are not Unit tests. Unit tests should test a small isolated piece of
code while the E2E test is a high level test of a feature or several interactions. E2E tests are also 
ideal for making sure critical line of business features such as checkouts and sign ups are well tested. I wont dig into 
all the details of Unit tests vs E2E tests but focus on how integration and E2E tests work in Angular 2 and later.

We will use the <a href="https://ng-pokedex.firebaseapp.com">Angular Pokédex</a> app for our example. The NG-Pokédex app 
allows users to view and search Pokemon characters. For our app we would really want make sure this core feature works
every time we go to deploy our app. This is where an automated E2E test will be invaluable. Our E2E tests can open our
app in the browser and interact with our app to make sure the feature works correctly. 

In our Pokédex app the user can open a modal to see details about specific Pokémon and then use the arrow keys to navigate
between Pokémon. We would like to write a E2E test to make sure this functionality works in our application. Lets take a
look at a running E2E test that tests this feature.

<video src="/assets/video/posts/2017-01-28-introduction-to-e2e-testing-with-the-angular-cli-and-protractor/angular-e2e-test.mp4" autoplay loop controls bp-layout="float-center 8--max" class="img-border"></video>

This short video clip shows a Angular E2E test automatically opening a browser and running through
our tests to make sure our application is behaving properly. I slowed down the tests slightly so it 
is visible that our tests are interacting with the browser.

## Angular CLI and Protractor

The NG-Pokédex app is an <a href="https://cli.angular.io">Angular CLI</a> app. The Angular CLI gives us all the functionality
we need for scaffolding, building and testing our Angular applications. This scaffolding the Angular CLI provides includes unit tests
and the setup needed for our E2E tests. 

Our E2E tests are powered by a testing library called <a href="http://www.protractortest.org/">Protractor</a>. Protractor is a E2E test runner that can take 
scenario tests and run them in the browser for us like in the video above. The test code itself is written using <a href="https://jasmine.github.io/">Jasmine</a>.
Jasmine is a testing library the provides all the assertion and utility functions needed to write unit and E2E tests. Lets take a look at a simple example of a E2E test.

In our Angular CLI project we have a folder named <code>e2e</code>. This is where our e2e tests are kept. 
In the Angular Pokédex app repo we have a few tests already created. Lets take a look at the first one.
There are two parts to writing an E2E test with Protractor. First is our Page Object Class located
in the `app.po.ts` file.

<pre class="language-typescript">
<code>
{% raw %}
// app.po.ts
import { browser, element, by } from 'protractor';

export class NgPokedexPage {
  navigateTo() {
    // Navigate to the home page of the app
    return browser.get('/');
  }

  getHeadingText() {
    // Get the home page heading element reference
    return element(by.css('app-root h1')).getText();
  }
}
{% endraw %}
</code>
</pre>

Our Page Object Class is a Class that describes a high level page view. This one is our Page Object describing our 
home page. The Page Object Class has all of the logic to find the elements on our page and how to navigate to the URL.
This Page Object finds our home page heading. We use the Protractor `by.css()` function to select 
elements on the page. There are many ways to select elements but for now we will just use the `by.css()`.
Next lets take a look at the actual E2E test in the `app.e2e-spec.ts` file.

<pre class="language-typescript">
<code>
{% raw %}
// app.e2e-spec.ts
import { NgPokedexPage } from './app.po';

describe('ng-pokedex App', function() {
  let page: NgPokedexPage;

  beforeEach(() => {
    page = new NgPokedexPage();
  });

  it('should display heading saying NG-Pokédex', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('NG-Pokédex');
  });
});
{% endraw %}
</code>
</pre>

Our E2E test is using Jasmine. We first describe our E2E test. Then we import our Page Object class to use and 
create a new `NgPokedexPage` instance in the `beforeEach` function. This will create a new isolated test page for each
E2E test. With Jasmine we give a description to the test with the `it()` function. The `it` 
function takes a function to execute and runs an expectation to make sure the test passes. In our test we run
`page.navigateTo();` to browse to our home page. 

The first test we run `expect(page.getHeadingText()).toEqual('NG-Pokédex');`.
This line is our expectation. We expect the heading for the home page to say `NG-Pokédex`. To run our tests
we run the following command in our Angular CLI project: `ng run e2e`. This will trigger Protractor to open the browser
to start our app and run our tests.

While this is a overly simple example it touches the most basic E2E test. The Angular CLI provides a example test
when a CLI project is created. Now lets write a more complex example like we saw in our video clip above.

### Page Object

In the next test in the NG-Pokédex app we will check that the modal component properly opens and the user can 
navigate between Pokémon with the arrow keys. First we need to create our Page Object for our Pokémon list page.

<pre class="language-typescript">
<code>
{% raw %}
// pokemon.po.ts
import { browser, element, by, Key } from 'protractor';

export class PokemonPage {
  navigateTo() {
    return browser.get('/pokemon');
  }

  getPokemonCardElements() {
    return element.all(by.css('.card--media'));
  }

  getFirstPokemonCardElement() {
    return element(by.css('.card--media'));
  }

  getOpenModalElement() {
    return element(by.tagName('app-pokemon-modal'));
  }

  getOpenModalHeadingElement() {
    return element(by.css('app-pokemon-modal h1'));
  }

  selectNextKey() {
    browser.actions().sendKeys(Key.ARROW_RIGHT).perform();
  }

  selectPrevKey() {
    browser.actions().sendKeys(Key.ARROW_LEFT).perform();
  }

  selectEscapeKey() {
    browser.actions().sendKeys(Key.ESCAPE).perform();
  }
}
{% endraw %}
</code>
</pre>

In our Page Object we have a few new methods and Protractor selectors to help test our page. First we have the `navigateTo()`
method to browse to the `/pokemon` URL.
We use the `element.all(by.css('.card--media'));` to get a list of elements by the CSS selector `.card--media`. This CSS 
class is the class used on our individual Pokémon cards. We also have `element(by.tagName('app-pokemon-modal'));` to select
and return a single element by the tag name of that element. In Angular this would commonly be the component selector.

Last we have a few methods to trigger key events in the browser for test. For example:
`browser.actions().sendKeys(Key.ARROW_RIGHT).perform();` allows us to use Protractor utility methods and trigger key events
in the browser during our tests. Now that we have our Page Object to get all the elements and interact with our 
page we can write our E2E test for our scenario.

### E2E Test

In our E2E scenario we want to test that the user can navigate and view Pokémon on the page. 

<pre class="language-typescript">
<code>
{% raw %}
// pokemon.e2e-spec.ts
import { PokemonPage } from './pokemon.po';
import { browser } from 'protractor';

describe('ng-pokedex pokemon view', function () {
  let page: PokemonPage;

  beforeEach(() => {
    page = new PokemonPage();
  });

  it('should display a list of pokemon', () => {
    page.navigateTo();
    expect(page.getPokemonCardElements().count()).toBe(151);
  });

  it('should open and view a particular pokemon', () => {
    page.navigateTo();
    page.getFirstPokemonCardElement().click();

    expect(page.getOpenModalElement()).toBeTruthy();
    expect(page.getOpenModalHeadingElement().getText()).toBe('Bulbasaur #1');
  });

  it('should open and allow arrow keys to navigate between pokemon', () => {
    page.navigateTo();
    page.getFirstPokemonCardElement().click();

    page.selectNextKey();
    expect(page.getOpenModalHeadingElement().getText()).toBe('Ivysaur #2');

    page.selectPrevKey();
    page.selectPrevKey();
    expect(page.getOpenModalHeadingElement().getText()).toBe('Mew #151');
  });
});
{% endraw %}
</code>
</pre>

Our first test we get the list of elements and count to make sure all 151 Pokémon are rendered.

<pre class="language-typescript">
<code>
{% raw %}
it('should display a list of pokemon', () => {
  page.navigateTo();
  expect(page.getPokemonCardElements().count()).toBe(151);
});
{% endraw %}
</code>
</pre>

The following test we can call our Page Object to get references to the elements on the page.
Once we have the elements we can trigger click events and arrow key events.

<pre class="language-typescript">
<code>
{% raw %}
it('should open and allow arrow keys to navigate between pokemon', () => {
  // Open the modal
  page.navigateTo();
  page.getFirstPokemonCardElement().click();

  // Trigger the right arrow, check to make sure the view updated with a different Pokédex
  page.selectNextKey();
  expect(page.getOpenModalHeadingElement().getText()).toBe('Ivysaur #2');

  // Trigger the left arrow twice
  page.selectPrevKey();
  page.selectPrevKey();

  // Check to make sure the view updated with a different Pokédex
  expect(page.getOpenModalHeadingElement().getText()).toBe('Mew #151');
});
{% endraw %}
</code>
</pre>

In this test we click the first Pokémon card opening the modal component. Once opened we trigger arrow key events
and check that the view updates with different Pokémon by checking the heading value. Our end result is once again
this:

<video src="/assets/video/posts/2017-01-28-introduction-to-e2e-testing-with-the-angular-cli-and-protractor/angular-e2e-test.mp4" autoplay loop controls bp-layout="float-center 8--max" class="img-border"></video>

## Angular 2 + Protractor Gotchas

Protractor makes E2E and integration tests easy for Angular apps. Protractor knows when to run and check the DOM after
Angular has done rendering the page. Although Protractor was designed primarily for Angular there are a few 
gotchas for Angular 2 and later. 

In earlier version of Angular (1.x) you could check for elements by binding and model values on a Angular controller
like the following:

<pre class="language-typescript">
<code>
{% raw %}
// Find an element with a certain ng-model.
by.model('name')

// Find an element bound to the given variable.
by.binding('bindingname')
{% endraw %}
</code>
</pre>

Unfortunately as of this writing Protractor has not updated to support these types of selectors for versions of Angular 2 and later.
For now we must use sectors like `by.css()` and `by.tagName()`. While this isn't that inconvenient it does tie our 
E2E tests more to our HTML structure which makes our tests more likely to break if the HTML changes.

## Summary
In summary E2E tests with Protractor, Jasmine and the Angular CLI its easier to set up now more than ever. The CLI does
a lot of the heavy lifting in our applications. I highly recommend reading Carmen Popoviciu's fantastic 
<a href="https://github.com/CarmenPopoviciu/protractor-styleguide">Protractor Style Guide</a> to dive more into writing
clean Protractor tests. Be sure to check out the demo project below for the E2E source code.
