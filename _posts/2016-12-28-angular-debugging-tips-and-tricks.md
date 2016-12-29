---
layout: post
title: Angular Debugging Tips and Tricks
description: Learn helpful tips and tricks to debug Angular apps.
keywords: Cory Rylan, Angular 2, Angular, Debugging
tags: angular, typescript
date: 2016-12-28
permalink: /blog/angular-debugging-tips-and-tricks
---

{% include ng-version.html %}

In this post we will cover some handy tips and tricks with debugging Angular apps. 
For this post we will be using a [Angular CLI](https://cli.angular.io) project and doing 
some debugging with the [NG Pokedex](https://ng-pokedex.firebaseapp.com/) demo app.
We will cover some of the following types of errors and debugging tips:

- [Augury](/blog/angular-debugging-tips-and-tricks#augury)
- [TypeScript](/blog/angular-debugging-tips-and-tricks#typescript-types)
- [HTML Templates](/blog/angular-debugging-tips-and-tricks#template-errors-and-the-html-parser)
- [Editors and language services](/blog/angular-debugging-tips-and-tricks#visual-studio-code-and-the-angular-language-service)

## Augury

First we will cover a helpful Chrome add on tool called Augury. You can download Augury at
[augury.angular.io](https://augury.angular.io/). Augury adds some helpful tools that allow 
us to better understand our Angular apps. We can view things like the component tree and 
how our app is broken up. We can inspect each component and see its properties and 
events associated with it. 

<img src="/assets/images/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-augury.png" alt="Angular Augury debugging" bp-layout="full-width 8--max float-center" class="img-border" />

Another helpful feature of Augury is the ability to see the injector graph for the dependency injection
system. This helps us visualize the dependencies in our project. There is a router inspector as well
to see what active routes are available in our app. Note to use Augury you must make sure
you Angular app is in development mode. If you call `enableProdMode()` in your app, Angular will disable
the debugging hooks Augury needs at development time to give us the useful information about our app.

## TypeScript Types

One of the great features of Angular is the use of TypeScript as it's primary language.
Most Angular 2.x+ apps are written in TypeScript and we get a lot of benefit with it. 

With TypeScript we get static type checking and features like interfaces. TypeScript is 
essentially the latest JavaScript + optional static types.
What does that do for us? Well it prevents us from accidentally passing the wrong types
around. Example we have a simple add function and with TypeScript's type annotations we 
catch silly errors like accidentally passing a string when it it should be a number.

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/typescript-static-checking.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

Another great feature of TypeScript is the ability to create interfaces. Interfaces are like 
contracts for what your objects and data structures should look like. This allows us to make sure like the example
above that we have the correct object. Our editors can give us some better 
information about what object we are using.

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/typescript-vscode.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

## TypeScript Source Maps

We see that TypeScript can help catch some bugs at development time but what if we needs
to debug and step through code in the browser? Well with the Angular CLI we get extra generated
files called source maps to help us out. 

As we can see below this is what our simple about
component looks like after the TypeScript has been compiled down to plain ES5 JavaScript.
Its not terrible looking we can understand what it's doing but we can get a better
debugging experience with source maps.

<img src="/assets/images/posts/2016-12-28-angular-debugging-tips-and-tricks/compiled-code.png" alt="Angular Augury debugging" bp-layout="full-width 6--max float-center" class="img-border" />

Source maps "map" our generated JavaScript to our TypeScript code. So if we use a `debugger;` 
statement to pause on our code, instead of Chrome showing the compiled ES5 JavaScript it will 
show us the TypeScript. 

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/typescript-source-maps.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

Chrome isn't using TypeScript but matching line for line where the 
compiled JavaScript came from in our TypeScript code. This allows us to step through
and debug our TypeScript code in the browser. Pretty useful!

## TypeScript Runtime Errors

What happens if we get a runtime error in our application? What do our Angular app errors
look like? Well lets create an error in our `AboutComponent`.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle('About Angular Pokédex');
    this.method1();
  }

  method1() {
    this.method2();
  }

  method2() {
    this.method3();
  }

  method3() {
    throw new Error('Something bad happened.');
  }
}
{% endraw %}
</code>
</pre>

So we will trigger an error when `method3()` is called. Lets look at how Angular handles this.

<img src="/assets/images/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-stack-trace.png" alt="Angular Augury debugging" bp-layout="full-width 7--max float-center" class="img-border" />

Wow that is a lot of red. But if we look closely we can see Angular has logged out the exact stack trace
that triggered the error at the top of the console. If we click one of the link it will take us
straight to the code that ran and caused the issue.

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-stack-trace.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

So runtime and compile time errors with Angular and TypeScript is pretty great. We get full stack
traces and links directly to the code that caused the issue. What happens though when 
we have a bug in our templates/HTML?

## Template Errors and the HTML Parser

The Angular built a custom HTML parser instead of using the browser for a few reasons.
First it allows out HTML templates to be case sensitive and also allows Angular to provide better
errors in our templates. Let make a couple simple errors in our component.

<pre class="language-html">
<code>
{% raw %}
&lt;h1&gt;About&lt;/h1&gt;

&lt;ul&gt;
	&lt;li&gt;
	  Insperation from 
    &lt;a href="https://www.pokedex.org/"&gt;pokedex.org
	&lt;/li&gt;
&lt;/ul&gt;
{% endraw %}
</code>
</pre>

If you notice in our About Template we are missing a closing `a` tag on our last HTML anchor causing
a HTML error. If we inspect the console we will see a `SyntaxError` thrown with a exception
message. 

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-html-template-error.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

If look at the exception message we can see the Angular parser has pointed to the line of invalid 
HTML for us. Now most editors and IDEs would pick up on a missing closing tag but in the 
next example we will see some even better template error handling.

### Properties and Events

Some other common errors with Angular templates are simple typos with property and method names.
In our about component lets make a few properties and a method to call from our template.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  message = 'Hello World';

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle('About Angular Pokédex');
  }

  sayHello() {
    console.log(this.message);
  }
}
{% endraw %}
</code>
</pre>

So in our `AboutComponent` we have a `message` property and `sayHello()` method that we will reference
in our template.

<img src="/assets/images/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-template-typo.png" alt="Angular Augury debugging" bp-layout="full-width 7--max float-center" class="img-border" />

We can see we have a typo with our message property but if we start our app theres no errors!
Angular templates are somewhat tolerant of referencing properties that don't exist on our component.
If the property doesn't exist Angular simply doesn't show anything on the screen and doesn't give
an error. Not supper helpful but in a later example we will see how we can improve this
behavior. Next lets make a typo in our template and in our click event call `sayHelloTypo()`.

<img src="/assets/images/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-stack-trace-event-error.png" alt="Angular Augury debugging" bp-layout="full-width 7--max float-center" class="img-border" />

We have quite a bit in our error log but if we break it down its fairly useful. Angular spits out
the full stack trace but really just the first line is what we care about.

`Error in ./AboutComponent class AboutComponent - inline template:4:0 caused by: self.context.sayHelloTypo is not a function`

The first line tells us which component had the error and then the method that was attempted 
to be executed. These errors are great for debugging runtime errors but what can we do to improve our 
development experience in our editors?

## Visual Studio Code and the Angular Language Service

The Angular team is working on a project called the Angular Language Service.
This service acts as a plugin to our editor to allow our editor to better understand 
our component templates. With Angular's template syntax the Language Service
can statically analyze our templates and help us catch errors early on in development.

<video src="/assets/video/posts/2016-12-28-angular-debugging-tips-and-tricks/angular-language-service.mp4" autoplay loop controls bp-layout="float-center 8--max"></video>

So in the video above we can see the Angular Language Service is allowing my editor ([Visual Studio Code](https://code.visualstudio.com/))
to understand what properties and methods are available in my component for the template to use.
This is a great improvement and adds a lot productivity to our development enviroment.

The Angular Language Service is in early Alpha and you can try it out now by downloading
the the VSCode plugin here. [VS Code Language Service](https://github.com/angular/vscode-ng-language-service).
The language service is not specific to Visual Studio Code and will eventually make its way to other
editors in the near future!

In summary Angular 2 and later versions have some great improvements in debugging over prior versions.
We can expect to see event more improvements as Angular matures.
