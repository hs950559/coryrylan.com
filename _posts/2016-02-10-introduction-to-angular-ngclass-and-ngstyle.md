---
layout: post
title: Introduction to Angular ngClass and ngStyle
description: Learn how to dynamically control CSS and CSS classes and in Angular
keywords: Cory Rylan, Angular, CSS
tags: angular css
date: 2016-02-10
updated: 2016-12-19
permalink: /blog/introduction-to-angular-ngclass-and-ngstyle
demo: http://plnkr.co/edit/HyB1rg7xxWqCNwTuZCYV?p=preview
---

{% include ng-version.html %}

Creating dynamic styles in web applications can be a real pain. Luckily with Angular we have multiple ways to handle our dynamic CSS and CSS classes
with the new template syntax as well as some built in directives.

## Angular Template Property Syntax
First lets look at how we would change a `<div>` color property in pure JavaScript.

<pre class="language-javascript">
<code>
{% raw %}
let myDiv = document.getElementById('my-div');
myDiv.style.color = 'orange';   // updating the div via its properties
{% endraw %}
</code>
</pre>

Now lets look at the primitives the Angular syntax gives us out of the box. Using the `[property]` syntax we can easily access
any element or component properties. 

<pre class="language-markup">
<code>
{% raw %}
&lt;div [style.color]="'orange'"&gt;style using property syntax, this text is orange&lt;/div&gt;
{% endraw %}
</code>
</pre>

In the example above we can directly access the style property of our div element. This is different than an attribute. Properties 
are the properties defined on our DOM object just like the one we updated in our first example with just plain JavaScript.

We can also use the Angular property syntax to add CSS classes to elements.

<pre class="language-markup">
<code>
{% raw %}
&lt;div [className]="'blue'"&gt;CSS class using property syntax, this text is blue&lt;/div&gt;
{% endraw %}
</code>
</pre>

## ngStyle and ngClass
Out of the box with the new syntax we don't need special `ng-class` or `ng-style` directives like in Angular 1. But with Angular we still have these built in directives.
These directives offer syntactic sugar for more complex ways of altering our element styles. First lets look at `ngStyle`.

<pre class="language-markup">
<code>
{% raw %}
&lt;div [ngStyle]="{'color': 'blue', 'font-size': '24px', 'font-weight': 'bold'}"&gt;
  style using ngStyle
&lt;/div&gt;
{% endraw %}
</code>
</pre>

In this example using `ngStyle` we can easily style multiple properties of our element. We also can bind these properties to values that can be updated 
by the user or our components.

<video src="/assets/video/posts/2016-02-10-introduction-to-angular-ngclass-and-ngstyle/ng-style-demo.mp4" autoplay loop controls bp-layout="float-center 3--max"></video>

<pre class="language-markup">
<code>
{% raw %}
&lt;div [ngStyle]="{'color': color, 'font-size': size, 'font-weight': 'bold'}"&gt;
  style using ngStyle
&lt;/div&gt;

&lt;input [(ngModel)]="color" />
&lt;button (click)="size = size + 1">+&lt;/button&gt;
&lt;button (click)="size = size - 1">-&lt;/button&gt;
{% endraw %}
</code>
</pre>

Next lets look at the `ngClass` directive and the options it provides to update classes on our components and HTML elements.

<pre class="language-markup">
<code>
{% raw %}
&lt;div [ngClass]=&quot;[&#39;bold-text&#39;, &#39;green&#39;]&quot;&gt;array of classes&lt;/div&gt;
&lt;div [ngClass]=&quot;&#39;italic-text blue&#39;&quot;&gt;string of classes&lt;/div&gt;
&lt;div [ngClass]=&quot;{&#39;small-text&#39;: true, &#39;red&#39;: true}&quot;&gt;object of classes&lt;/div&gt;
{% endraw %}
</code>
</pre>

Same as `ngStyle` the `ngClass` allows multiple ways to add and toggle our CSS. We can bind these classes directly to our component properties to 
update them dynamically as needed. Between the new template syntax and a few more directives our Angular apps are easier than ever to style.
Click the demo button below to see a working plnkr of the code.