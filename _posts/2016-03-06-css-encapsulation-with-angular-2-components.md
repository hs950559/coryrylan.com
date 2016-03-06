---
layout: post
title: CSS Encapsulation with Angular 2 Components
description: A intro on how to better encapsulate your CSS in Angular 2 components. Also learn the different encapsulation techniques and CSS best practices.
keywords: Cory Rylan, Angular2, CSS
tags: CSS, angular2
date: 2016-03-06
permalink: /blog/css-encapsulation-with-angular-2-components
demo: http://plnkr.co/edit/JYbmizTKUd29zfmmMmLc?p=preview
---

CSS encapsulation has always been something developers have wanted in their web applications. The ability to scope CSS to a specific component without affecting other components 
has been difficult to achieve. This post we will cover how to use Angular 2 components to encapsulate our CSS and learn the pros and cons to each technique.

In our Angular 2 app we will have three components. First is our App component, it will have two child components First and Second component.


<pre class="language-javascript">
<code>
{% raw %}
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {FirstComponent} from 'src/first.component.ts';
import {SecondComponent} from 'src/second.component.ts';

@Component({
  selector: 'demo-app',
  template: `
    &lt;h3&gt;CSS Encapsulation with Angular 2&lt;/h3&gt;
    &lt;div class=&quot;cmp&quot;&gt;
      App Component
      &lt;first-cmp&gt;&lt;/first-cmp&gt;
      &lt;second-cmp&gt;&lt;/second-cmp&gt;
    &lt;/div&gt;
  `,
  directives: [FirstComponent, SecondComponent]
})
export class App {
  constructor() { }
}

bootstrap(App);
{% endraw %}
</code>
</pre>

We link a separate style sheet into our `index.html` that has a  single global style rule that will be applied to any element with the CSS class of `cmp`.


<pre class="language-css">
<code>
{% raw %}
.cmp {
  padding: 6px;
  margin: 6px;
  border: 2px solid red;
}
{% endraw %}
</code>
</pre>


<h2>Style Techniques</h2>
Now lets take a look at our `FirstComponent` and `SecondComponent` and see the options we have to style these components.

<pre class="language-javascript">
<code>
{% raw %}
import {Component} from 'angular2/core';

@Component({
  selector: 'first-cmp',
  template: `
    &lt;div class=&quot;cmp&quot;&gt;First Component&lt;/div&gt;
    &lt;style&gt;.cmp { border: blue 2px solid; }&lt;/style&gt;`
})
export class FirstComponent {
  constructor() { }
}

@Component({
  selector: 'second-cmp',
  template: `&lt;div class=&quot;cmp&quot;&gt;Second Component&lt;/div&gt;`,
  styles: ['.cmp { border: green 2px solid; }']
})
export class SecondComponent {
  constructor() { }
}
{% endraw %}
</code>
</pre>

So looking at our two components there are two different ways to apply styles to them. In `FirstComponent` we have a style tag in out template while in the `SecondComponent` we
can use a styles property on our component decorator. Both will have the same outcome when rendering to the screen. 

<h2>View Encapsulation</h2>
Angular by default encapsulates component CSS. So lets take a look at the rendered output of our code so far.

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-2-components/rendered-output.png" 
    alt="Rendered output of Angular 2 CSS encapsulation" 
    class="float-center full-width col-6--max" />
    
So we can see that each components corresponding `.cmp` CSS class is scoped to it's own template. The default CSS behavior multiple `.cmp` classes would of caused collisions
with our styles. So lets look at the Chrome dev tools and see what the rendered HTML and CSS looks like.

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-2-components/rendered-html.png" 
    alt="Rendered output of Angular 2 CSS encapsulation" 
    class="float-center full-width col-8--max" />