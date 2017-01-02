---
layout: post
title: CSS BEM Syntax Basics
description: A beginner overview on the CSS BEM naming syntax.
keywords: Cory Rylan, Web, CSS, Sass, Software Development
tags: css cleancode
date: 2015-03-16
permalink: /blog/css-bem-syntax-basics
---

What the heck is BEM and why should we care? BEM stands for "Block Element Modifier". BEM is a
way to name our CSS classes with semantic meaning and low specificity. You can check out the origin of this
flavor of BEM from Nicolas Gallagher's <a href="http://nicolasgallagher.com/about-html-semantics-front-end-architecture/" target="_blank">post</a>.

Often we find ourselves struggling to come up class names that have meaning behind their intentions. It can be difficult to create class names that
are specific to the component being designed yet maintain a low CSS specificity. BEM can solve a lot of these issues for us.

<pre class="language-css">
<code>
.block { }
.block__element { }
.block--modifier { }
</code>
</pre>

Blocks or components can be thought of as pieces of reusable HTML. Elements `__` (double underscore) are child elements of the block or component.
Modifiers `--` (double dash) are used to define a modified state the block or component is in. Lets look at a simple example block component.

<pre class="language-css">
<code>
.sign-up-form { }
.sign-up-form__button { }
.sign-up-form--small { }
</code>
</pre>

Here we are defining a block component for a sign-up form. Lets see how this looks in out markup.

<pre class="language-markup">
<code>
&lt;form class=&quot;sign-up-form--small&quot;&gt;
    &lt;input type=&quot;text&quot; /&gt;
    &lt;input type=&quot;submit&quot; class=&quot;sign-up-form__button&quot; /&gt;
&lt;/form&gt;
</code>
</pre>

Here we can see how with BEM we know what the element is doing without looking at any other markup.
We know that `.sign-up-form__button` is a child element of the `.sign-up-form` block.
We also know that this version is the small version or modifier of the regular sign up form because of our `--` modifier.

You may say the classes are long and ugly. It may seem that way but they offer rich information about their intent. They also have specific names
for their component while keeping our CSS specificity low which helps the maintainability of our code.

Lets look at another example of using BEM for a message component.
 
<pre class="language-css">
<code>
.message { background: white; }
.message--warning { background: red; }
.message--error { background: yellow; }
.message__button { display: block; }
</code>
</pre>
<pre class="language-markup">
<code>
&lt;p class=&quot;message--error&quot;&gt;
    Oh no Something went wrong...
&lt;/p&gt;
</code>
</pre>

With our message class we can have some default styles for our messages but also have modifiers that can change the state of our message.
If we want our message to have a warning state we simply add the modifier and inherit the appropriate CSS.

BEM shouldn't be used for every case. Example we wouldn't want to use it necessarily for elements that are only defined once such as the header or footer of our site.
You also wouldn't use BEM for single purpose utility classes such as `.strike` or `.bold`. BEM really shines when we structure our HTML into reusable components.

Using the CSS pre-processor Sass we can write BEM CSS with even more ease.

<pre class="language-scss">
<code>
.message { 
    background: white; 
         
    &--warning { 
        background: red; 
    }
         
    &--error { 
        background: yellow; 
    }
         
    &__button { 
        display: block; 
    }
}
</code>
</pre>
 
This Sass outputs the same CSS as above but with written less code and makes our Sass easier to read. You start to really see the component design
when mixing BEM and Sass together.

BEM may take some time to get used to but it can really help scale a large project with large amounts of CSS. BEM can be indispensable for
organizing your front end architecture.