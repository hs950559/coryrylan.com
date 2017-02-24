---
layout: post
title: Listening to Angular Key Events with Host Listeners
description: Learn how to listen to keyboard events with Angular and the Host Listener API.
keywords: Cory Rylan, Angular 2, Angular, key events
tags: angular
date: 2017-01-06
permalink: /blog/listening-to-angular-key-events-with-host-listeners
demo: https://embed.plnkr.co/M6O4YVAmNY9Qi9m8ef33/
---

{% include ng-version.html %}

A common pattern in many web applications is the ability to react to users via key board events
or shortcuts. This great for user experience and accessibility. 
Typically we register window and document events to accomplish this.
With Angular we try to avoid touching the DOM directly for certain 
[rendering](https://universal.angular.io/) and performance reasons. There is a specific API within 
Angular we can use to listen to global window and document events like the `keyup` and `keydown` events.

## Host Listeners

To listen to the `window` for events we will use the `HostListener` API. This API allows us to register
a special listener for events in the browser and then call methods in our components to react to them.

In our example we have a simple counter component that can increment and decrement a value on the 
view. Our counter component will have two buttons. We will listen to the `keyup` 
event to be able to use the keyboard arrow keys for the component. Here is our rendered output:

<video src="/assets/video/posts/2017-01-06-listening-to-angular-key-events-with-host-listeners/angular-host-listener-example.mp4" autoplay loop controls bp-layout="float-center 5--max" class="img-border"></video>

In our rendered counter component I can increment and decrement the value with the buttons and 
the keyboard arrow keys. Lets take a look at the component template first.

<pre class="language-html">
<code>
{% raw %}
&lt;h1&gt;Angular Host Listeners and Key Events&lt;/h1&gt;

&lt;button (click)="decrement()"&gt;-&lt;/button&gt;
{{value}}
&lt;button (click)="increment()"&gt;+&lt;/button&gt;
{% endraw %}
</code>
</pre>

So in our template we show a single property `value` and then have two buttons that call
the `increment()` and `decrement()` methods. Take notice that all of the code to listen to 
key events will be in the TypeScript side of the component unlike the 
local `click` events in the template.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, HostListener } from '@angular/core';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  value = 0;
  constructor() { }
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.increment();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.decrement();
    }
  }
  
  increment() {
    this.value++;
  }
  
  decrement() {
    this.value--;
  }
}
{% endraw %}
</code>
</pre>

The first thing in our component is to notice the `HostListener` decorator in import 
in out component. This special decorator is how we can listen to out host events. Out host
is essentially the element or document our component is located in.
We add the `@HostListener` to the `keyEvent()` method with a few important parameters.

<pre class="language-javascript">
<code>
{% raw %}
@HostListener('window:keyup', ['$event'])
keyEvent(event: KeyboardEvent) {
  console.log(event);
  
  if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
    this.increment();
  }

  if (event.keyCode === KEY_CODE.LEFT_ARROW) {
    this.decrement();
  }
}
{% endraw %}
</code>
</pre>

The `@HostListener` has two parameters. The first is the name of the host event we would 
like to listen to. For our use case it will be the `window:keyup` event. The second parameters
takes a list of arguments returned by the event you are listening to. So for our `keyup` event
Angular will pass us back a copy of the `keyup` event via the `$event` variable. This is similar
to the `$event` that we commonly use in our templates to pass back other local events.

Now the the event is registered, every time the event is triggered in the DOM Angular will call
our `keyEvent()` method passing in the event. Once we have the event we can check the 
`KeyboardEvent` for the key code. For our counter component we created a simple TypeScript interface
to hold the key codes we care about. When the appropriate key code is returned we call
the `increment()` or `decrement()` methods.
