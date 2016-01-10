---
layout: post
title: JavaScript Module Pattern Basics
description: A overview on the JavaScript Module Design Pattern.
keywords: Cory Rylan, Web, JavaScript, Module Pattern, Design Pattern
tags: javascript, programming
date: 2015-03-10
permalink: /blog/javascript-module-pattern-basics
---

The Module Pattern is one of the most common design patterns used in JavaScript and for good reason. The module pattern is easy to use
and creates encapsulation of our code. Modules are commonly used as singleton style objects where only
one instance exists. The Module Pattern is great for services and testing/TDD.
There are many different variations of the module pattern so for now I will be covering the basics and the Revealing Module Pattern in ES5.

Something to note, the next version of JavaScript ES6 has a new specification for asynchronous module loading.
You can use the module patterns that will be covered with the new ES6 module loading syntax.

##Creating a module

First we start using a anonymous closure. Anonymous closures are just functions that wrap our code and create an enclosed scope around it. Closures
help keep any state or privacy within that function. Closures are one of the best and most powerful features of JavaScript.

<pre class="language-javascript">
<code>
(function() {
    'use strict';
    // Your code here
    // All function and variables are scoped to this function
}());
</code>
</pre>

This pattern is well known as a <strong>Immediately Invoked Function Expression</strong> or IIFE. The function is evaluated then immediately invoked. Its
also a good practice to run your modules in ES5 strict mode. Strict mode will protect you from some of the more dangerous parts in JavaScript.


##Exporting our module

Next we will want to export our module. This basically assigns the module to a variable that we can use to call our modules methods.

<pre class="language-javascript">
<code>
var myModule = (function() {
    'use strict';
    
}());
</code>
</pre>

Next lets create a public method for our module to call. To expose this method to code outside our module we return an `Object` with the methods defined.

<pre class="language-javascript">
<code>
var myModule = (function() {
    'use strict';
 
    return {
        publicMethod: function() {
            console.log('Hello World!');
        }
    };
}());
     
myModule.publicMethod();    // outputs 'Hello World'
</code>
</pre>

##Private methods & properties

JavaScript does not have a private keyword by default but using closures we can create private methods and private state.

<pre class="language-javascript">
<code>
var myModule = (function() {
    'use strict';
 
    var _privateProperty = 'Hello World';
     
    function _privateMethod() {
        console.log(_privateProperty);
    }
     
    return {
        publicMethod: function() {
            _privateMethod();
        }
    };
}());
  
myModule.publicMethod();                    // outputs 'Hello World'   
console.log(myModule._privateProperty);     // is undefined protected by the module closure
myModule._privateMethod();                  // is TypeError protected by the module closure
</code>
</pre>

Because our private properties are not returned they are not available outside of out module. Only our public method has given us access to our private methods.
This gives us ability to create private state and encapsulation within our code.

You may have noticed the `_` before our private methods and properties. Because JavaScript does not have a private keyword its common to prefix private properties with an underscore.

##Revealing Module Pattern

The Revealing Module Pattern is one of the most popular ways of creating modules. Using the return statement we can return a object literal that 'reveals' only the methods or properties we
want to be publicly available.

<pre class="language-javascript">
<code>
var myModule = (function() {
    'use strict';
 
    var _privateProperty = 'Hello World';
    var publicProperty = 'I am a public property';
  
    function _privateMethod() {
        console.log(_privateProperty);
    }
  
  	function publicMethod() {
    	_privateMethod();
  	}
     
    return {
        publicMethod: publicMethod,
        publicProperty: publicProperty
    };
}());
  
myModule.publicMethod();    		        // outputs 'Hello World'   
console.log(myModule.publicProperty);       // outputs 'I am a public property'
console.log(myModule._privateProperty);     // is undefined protected by the module closure
myModule._privateMethod();                  // is TypeError protected by the module closure
</code>
</pre>

The benefit to the Revealing Module Pattern is that we can look at the bottom of our modules and quickly see what is publicly available for use.

The Module Pattern is not a silver bullet for adding code re-usability to your JavaScript. Using the Module Pattern with <a href="/blog/javascript-prototypal-inheritance">Prototypal Inheritance</a>
or <a href="/blog/javascript-es6-class-syntax">ES6 Classes</a> can give you a wide range of design patterns with varying pros and cons.
