---
layout: post
title: Introduction to Angular 2 ngClass and ngStyle
description: Learn how to dynamically control CSS and CSS classes and in Angular 2
keywords: Cory Rylan, Angular 2, AngularJS, TypeScript, CSS
tags: angular2, css
date: 2016-02-08
permalink: /blog/introduction-to-angular-2-ngclass-and-ngstyle
demo: http://plnkr.co/edit/HyB1rg7xxWqCNwTuZCYV?p=preview
---

Creating dynamic styles in web applications can be a real problem, With Angular 2 we have multiple ways to handle our dynamic CSS and CSS classes
with the new template syntax as well as some built in directives.

First lets look at the primitives the new Angular 2 syntax gives us out of the box. Using the `[property]` syntax we can easily access
any element or components properties. 


<pre class="language-markup">
<code>
{% raw %}
&lt;div [style.color]="'orange'"&gt;style using property syntax, this text is orange&lt;/div&gt;
{% endraw %}
</code>
</pre>

In the example above we can directly access the style property of our div element. This is different than an attribute. Properties 
are the properties defined on our DOM object. Lets look at what that would look like in plain JavaScript.

<pre class="language-javascript">
<code>
{% raw %}
let myDiv = document.getElementById('.my-div');
myDiv.style.color = 'orange';   // updating the div via its properties
{% endraw %}
</code>
</pre>

