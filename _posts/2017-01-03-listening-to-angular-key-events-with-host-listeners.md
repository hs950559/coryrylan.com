---
layout: post
title: Listening to Angular Key Events with Host Listeners
description: Lear how to listen to keyboard events with Angular and the Host Listener API.
keywords: Cory Rylan, Angular 2, Angular, key events
tags: angular
date: 2017-01-02
permalink: /blog/listening-to-angular-key-events-with-host-listeners
demo: http://plnkr.co/edit/M6O4YVAmNY9Qi9m8ef33?p=preview
---

{% include ng-version.html %}

A common pattern in many web applications is the ability to react to users via key board events
or shortcuts. With Angular we try to avoid touching the DOM for certain rendering and performance
reasons. There is a specific API within Angular we can use to listen to window events like the 
`keyup` and `keydown` events.

## Host Listeners

To listen to the `window` for events we will use the `HostListener` API. This API allows us to register
a special listener for events in the browser and then call methods in our components to react to them.

In our example we have a simple counter component that can increment and decrement a value on the 
view. Our counter component will have two buttons and we will listen to the `keyup` 
event to be able to use the arrow keys for the component. Here is our rendered output:

<video src="/assets/video/posts/2017-01-03-listening-to-angular-key-events-with-host-listeners/angular-host-listener-example.mp4" autoplay loop controls bp-layout="float-center 5--max" class="img-border"></video>

In our rendered counter component I can increment and decrement the value with the arrow keys. To
do this we use the `HostListener` API. Lets take a look at the template first.

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
key events will be in the TypeScript side of the component unlike the `click` events in the template.

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