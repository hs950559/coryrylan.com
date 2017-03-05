---
layout: post
title: Angular Async Data Binding with ngIf and ngElse
description: Learn how to use the ngIf and ngElse statement to easily bind async data and Observables to our Angular templates.
keywords: Cory Rylan, Angular 4, Angular, RxJS
tags: angular rxjs
date: 2017-02-23
updated: 2016-03-04
permalink: /blog/angular-async-data-binding-with-ng-if-and-ng-else
demo: https://embed.plnkr.co/Q2Gqn5aq6YYISS5cn9M1/
---

<p class="message">
  This article is for versions of Angular 4 and later.
</p>

In this article we are going to cover a new feature introduced in Angular 4. This feature is 
a special added syntax to the `ngIf` statement to make it easier to bind async data to our Angular 
templates.

When building Angular applications its likely you are working with Observables (specifically RxJS)
to handle asynchronous data. Typically we get this async data through Angular's Http service which returns
a Observable with our data response.

In this next example we are going to bind some user data to a component from a artificially created
Observable that emulates a slow api connection instead of calling an API directly. 

<pre class="language-typescript">
<code>
{% raw %}
import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  user: Observable&lt;any&gt;;
  
  constructor() { }
  
  ngOnInit() {
    // Fake Slow Async Data
    this.user = Observable.of({
      firstName: 'Luke',
      lastName: 'Skywalker',
      age: 65,
      height: 172,
      mass: 77,
      homeWorld: 'Tatooine'
    }).delay(2000); // Delay the response for 2 seconds
  }
}
{% endraw %}
</code>
</pre>

In this component we have and Observable that emits some async data and using RxJS operators.
We are causing the data to slow down by a couple of seconds to emulate a slow network connection. 
This code has nothing to do with our `ngElse` feature just note we are binding a user property
on our component as an Observable containing a User Object.

With our data being an Observable we need to subscribe to it to retrieve the data. We could 
do this in our component or we can use a special Angular pipe called the `async` pipe.
This pipe automatically subscribes to the Observable for us. Lets take a look at our template.

<pre class="language-html">
<code>
{% raw %}
&lt;h2&gt;Without ngIf and ngElse&lt;/h2&gt;
&lt;div&gt;
  &lt;h2&gt;{{(user | async)?.firstName}} {{(user | async)?.lastName}}&lt;/h2&gt;
  &lt;dl&gt;
    &lt;dt&gt;Age:&lt;/dt&gt;
    &lt;dd&gt;{{(user | async)?.age}}&lt;/dd&gt;

    &lt;dt&gt;Height:&lt;/dt&gt;
    &lt;dd&gt;{{(user | async)?.height}}&lt;/dd&gt;

    &lt;dt&gt;Mass:&lt;/dt&gt;
    &lt;dd&gt;{{(user | async)?.mass}}&lt;/dd&gt;

    &lt;dt&gt;Home World:&lt;/dt&gt;
    &lt;dd&gt;{{(user | async)?.homeWorld}}&lt;/dd&gt;
  &lt;/dl&gt;
&lt;/div&gt;
{% endraw %}
</code>
</pre>

So notice we can bind our Observable to our template with the `async` pipe but we have a couple 
syntax pain points. First, every time we want to display a property we have to pipe the User Observable
into the Async Pipe each time `user | async`. The next issue is since the data is async we have to use
a special Elvis operator `?` every time we access a property. The elvis operator only checks the property
if it exists on the object and the object is loaded. `(user | async)?.firstName`.

As you can see this is really verbose and not exactly terse. Nor does this template handle a 
loading message while the data loads into our template. Lets now look at the new `ngElse` feature.

<h2>NgFor and NgElse</h2>

We would really like to be able to subscribe to our Async Pipe once and avoid the extra 
ceremony in our templates. Lets take a look at the updated component template using the new ngElse feature.

<pre class="language-html">
<code>
{% raw %}
&lt;h1&gt;With ngIf and ngElse&lt;/h1&gt;
&lt;div *ngIf="user | async; let user; else loading"&gt;
  &lt;h2&gt;{{user.firstName}} {{user.lastName}}&lt;/h2&gt;
  &lt;dl&gt;
    &lt;dt&gt;Age:&lt;/dt&gt;
    &lt;dd&gt;{{user.age}}&lt;/dd&gt;

    &lt;dt&gt;Height:&lt;/dt&gt;
    &lt;dd&gt;{{user.height}}&lt;/dd&gt;

    &lt;dt&gt;Mass:&lt;/dt&gt;
    &lt;dd&gt;{{user.mass}}&lt;/dd&gt;

    &lt;dt&gt;Home World:&lt;/dt&gt;
    &lt;dd&gt;{{user.homeWorld}}&lt;/dd&gt;
  &lt;/dl&gt;
&lt;/div&gt;
&lt;ng-template #loading&gt;Loading User Data...&lt;/ng-template&gt;
{% endraw %}
</code>
</pre>

Lets break down what is happening in our template. The first line has several parts.

<pre class="language-html">
<code>
{% raw %}
&lt;div *ngIf="user | async; let user; else loading"&gt;
{% endraw %}
</code>
</pre>

First we are using a traditional `*ngIf` in combination with the `async` pipe to show our element if the user
is loaded.

Next is the `let user;` statement in the `*ngIf`. Here we are creating a local template variable
that Angular assigns the value from the Observable. This allows us to interact directly with our
user Object without having to use the `async` pipe over and over.

The last statement `else loading` tells Angular if the condition is not met to 
show the loading template. The loading template is denoted using the `ng-template` tag with a 
`#loading` template reference name.

<pre class="language-html">
<code>
{% raw %}
&lt;template #loading&gt;Loading User Data...&lt;/template&gt;
{% endraw %}
</code>
</pre>

Angular template tags are not rendered in the browser until needed. When the 
user is not loaded Angular will show the loading template.
Once loaded it will render the div element with the user content.

With this new syntax we can reduce the need of the async pipe while having a nice
feedback mechanism for when to show a loading indicator for users.
Make sure to check out the demo below!