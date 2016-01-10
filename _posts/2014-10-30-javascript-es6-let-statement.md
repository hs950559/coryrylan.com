---
layout: post
title: JavaScript ES6 let
description: Details on the new ES6 let statement coming to JavaScript
keywords: Cory Rylan, Web, JavaScript, ES6
tags: javascript, es6
date: 2014-10-30
permalink: /blog/javascript-es6-let-statement
---

There are some very exciting features coming to JavaScript over the next few months in ES2015 or known as ES6. Not all browsers
support all of the new ES6 feature set but you can use a transpiler such as <a href="https://babeljs.io/" target="_blank">BabelJS</a> 
to transpile ES6 to working in the browser ES5. Browsers are actively working on these features and some you can try out today.

This post I am going to cover the `let` statement. `let` brings some new functionality
that will help keep our code from falling into some of JavaScript's tricky parts.

JavaScript ES5 and earlier has function scoping available. It turns out you can do just fine with function
scope but programmers coming from a Java or C# background may get tripped up from using block scoping. So lets look at a example.

<pre class="language-javascript">
<code>
function foo() {
    var bar = 0;
    if(true) {
        var bar = 1;    // Same variable
    }
    console.log(bar);   // '1'
}
</code>
</pre>

In this example `foo()` returns 1 even though the inner bar assignment is in the `if` block. This is because the inner bar assignment is not scoped to the `if` block but rather the function.
This can be a common source for bugs. In JavaScript any variables declared in a function are hoisted to the top of the function. So the previous example is behaves as if you wrote it in the following
format.

<pre class="language-javascript">
<code>
function foo() {
    var bar = 0;
    var bar = undefined;
    if(true) {
        bar = 1;    // Same variable
    }
    console.log(bar);   // '1'
}
</code>
</pre>

The inner bar is hoisted to the top of the function then reassigned to equal one in the inner block. Another common case of this behavior is in `for` loops.

<pre class="language-javascript">
<code>
function foo() {
    var i = 'hello';                // Same variable
    for(var i = 0; i < 3; i++) {    // Same variable
        console.log(i);             // '1 2 3'
    }
        
    console.log(i); // '3'
}
</code>
</pre>

We get back 3 instead of 'hello' because our `i` variable was hoisted to the top of the function.
As you can see this can cause confusion and introduce bugs into our code. So using the new ES6 `let` statement we can solve some of these issues.

<pre class="language-javascript">
<code>
function foo() {
    let i = 'hello';                // Different variable
    for(let i = 0; i < 3; i++) {    // Different variable
        console.log(i);             // '1 2 3'
    }
        
    console.log(i);   // 'hello'
}
</code>
</pre>

Using `let` we can block scope our variables and prevent them from being hoisted. Using `let` also prevents the accidental creation of duplicate variables.
We will get a error if we have two variables named the same and declared with `let` within the same block. `var` would of silently
and override the first declaration.

<pre class="language-javascript">
<code>
function foo() {
    console.log(bar);    // ReferenceError
    let bar = 2;
}
 
function foo() {
    let bar;
    let bar;    // TypeError
}
</code>
</pre>

Once you start using ES6 its recommended to always use `let` over `var` for variable creation. This will help keep consistency
and prevent confusion of the two. `let` and many other ES6 features will make JavaScript easier to maintain and use for the future.