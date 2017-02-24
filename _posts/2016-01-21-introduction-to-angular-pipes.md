---
layout: post
title: Introduction to Angular Pipes
description: Learn Angular pipes and how to create your own custom pipe.
keywords: Cory Rylan, Angular, TypeScript, JavaScript
tags: angular typescript
date: 2016-01-21
updated: 2016-12-19
permalink: /blog/introduction-to-angular-pipes
demo: https://embed.plnkr.co/3WnMwD56lEAOUh1jIgn2/
---

{% include ng-version.html %}

Angular 2.x and later has many new concepts and some of the same concepts from Angular 1.x. In Angular 1 we had filter which helped format or transform 
how data was displayed in our templates. In Angular 2.x and later we have a very similar feature but renamed to Pipes. This rename was to better align of what
the feature does. Coming from the Unix background we `|` pipe together commands. So in Angular we use the same `|` pipe character to format our
data.

First lets look at a simple pipe built into Angular the date pipe. The date pipe simply formats our date in our templates.

<pre class="language-markup">
<code>
{% raw %}
&lt;p&gt;{{date | date:'shortDate'}}&lt;/p&gt;

&lt;p&gt;{{date | date:'longDate'}}&lt;/p&gt;
{% endraw %}
</code>
</pre>

The date `Wed Jan 20 2016 22:01:58 GMT-0600 (Central Standard Time)` would be formated to `1/20/2016` and `January 20, 2016`.

## Custom Pipes

Now lets build our own custom pipe. In our use case we get dynamic content from an API. We would like the content to 
be shortened if it is past a certain length and add an ellipsis at the end. So our example would take a 100 character string 
down to 50 characters with an ellipsis at the end. Lets look at what our template using our pipe would look like.

<pre class="language-markup">
<code>
{% raw %}
&lt;p&gt;{{longText | ellipsis:50 }}&lt;/p&gt;
{% endraw %}
</code>
</pre>

In our template the pipe takes in a parameter of how long we would like the text to be. Next we can look into our ellipsis pipe.

<pre class="language-typescript">
<code>
{% raw %}
import { Pipe } from '@angular/core';

@Pipe({
    name: 'ellipsis'
})
export class EllipsisPipe {
  transform(val, args) {
    if (args === undefined) {
      return val;
    }

    if (val.length > args) {
      return val.substring(0, args) + '...';
    } else {
      return val;
    }
  }
}
{% endraw %}
</code>
</pre>

First we import the `Pipe` decorator from Angular core. This decorator allows us to add metadata to describe our Class and how it should behave. 
For our pipe we only have a name property in our decorator. This simply tells Angular what name to look for in our templates. Next our Class has a method called
`transform`. This method is called by Angular to get the result of our pipe. The `transform` method take two parameters, first the value that is being formated
or piped in and the second a list of parameters/ arguments passed into our pipe.

In the method we check if there was anything passed in. If no length was defined we just return back the string. The second statement takes the string and 
trims of extra characters and adds the ellipsis. Next take a look at our `AppModule` imports and registers the pipe.

<pre class="language-typescript">
<code>
{% raw %}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { EllipsisPipe } from './ellipsis.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    EllipsisPipe,
    AppComponent
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
{% endraw %}
</code>
</pre>

Our `AppModule` is where we register all the Components, Pipes and Services of our app. We then bootstrap our app from
our `AppModule`. Read more about [@NgModule here](https://angular.io/docs/ts/latest/guide/ngmodule.html). Next lets
look at our `AppComponent` using the eillipsis pipe.

<pre class="language-typescript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: '&lt;p&gt;{{longText | ellipsis:50 }}&lt;/p&gt;'
})
export class App {
  constructor() { 
    this.longText = 'Bacon ipsum dolor amet bacon t-bone tongue ball tip salami, flank capicola. Leberkas ribeye pork pork loin. Biltong porchetta picanha capicola tri-tip boudin. Tenderloin leberkas chicken, ham pig pork loin flank salami ham hock chuck meatball kevin. Meatloaf capicola landjaeger ground round ham hock ball tip boudin shank pork chop ribeye rump frankfurter turkey. Spare ribs short loin pork chop, biltong capicola shoulder pig drumstick pork porchetta brisket venison turducken sausage. Pig alcatra short loin jowl, prosciutto leberkas ham chuck.';
  }
}
{% endraw %}
</code>
</pre>

So our output for the long string above would be `Bacon ipsum dolor amet bacon t-bone tongue ball ti...`.

Take a look at the demo link below of the ellipsis pipe. Angular 2 pipes are not much different from AngularJS 1.x filters
but align with new EcmaScript2015 and EcmaScript2016 syntax used in Angular.
