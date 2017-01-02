---
layout: post
title: JavaScript ES6 Class Syntax
description: A beginner overview on the new ES6 ES2015 JavaScript Class syntax.
keywords: Cory Rylan, Web, JavaScript, ES6, ES2015, Class, Prototype, Inheritance
tags: javascript es2015
date: 2015-02-15
permalink: /blog/javascript-es6-class-syntax
---

ECMAScript 2015 or more well known as ES6 is the next specification for JavaScript. ES6 brings exciting features to
JavaScript including new syntax improvements. This post I am going to cover the new `Class` syntax.
JavaScript has been a prototypal based language using object prototypes to create object inheritance and code reuse.
The new ES6 `Class` adds a new syntax on top of traditional prototypes.

Something I cannot stress enough is the new `Class` is syntactic sugar on prototypes. Under the hood ES6 Classes
are still using prototypal inheritance. If you are unfamiliar with prototypes I would suggest you read my previous post on
<a href="/blog/javascript-prototypal-inheritance">JavaScript Prototypal Inheritance</a>.

## Constructors

In ES5 or the current widely supported version of JavaScript we use prototypes to create object inheritance. Prior to ES6 we
used function constructors similar to this.

<pre class="language-javascript">
<code>
// ES5 Constructor Function
function Person(name) {
  this.name = name;
}
         
var bob = new Person('Bob');
console.log(bob.name);  // Outputs 'Bob'
</code>
</pre>

ES6 has the new reserved keyword `Class` with a `constructor` statement. So the ES6 equivalent of our `Person`
function constructor would be the following.

<pre class="language-javascript">
<code>
// ES6 Class
class Person {
    constructor(name) {
        this.name = name;
    }
}
         
let bob = new Person('Bob');
console.log(bob.name);  // Outputs 'Bob'
</code>
</pre>

The new syntax gives us a dedicated constructor statement that runs on object creation. Constructors are helpful for any object
initialization logic.

## Methods
Next lets look at adding a function to our Person. In ES5 we would of had something like this.

<pre class="language-javascript">
<code>
// ES5 adding a method to the Person prototype
Person.prototype.walk = function() {
  console.log(this.name + ' is walking.');
}
         
var bob = new Person('Bob');
bob.walk(); // Outputs 'Bob is walking.'
</code>
</pre>

ES6 offers us a much more terse and clean syntax to achieve the same goal.

<pre class="language-javascript">
<code>
// ES6 Class adding a method to the Person prototype 
class Person {
    constructor(name) {
        this.name = name;
    }
         
    walk() {
        console.log(this.name + ' is walking.');
    }
}
         
let bob = new Person('Bob');
console.log(bob.name);  // Outputs 'Bob is walking'
</code>
</pre>

## Get &amp; Set
ES6 classes brings a new syntax for getters and setters on object properties. Get and set allows us to run code on the reading or writing of a property.
ES5 had getters and setters as well but was not widely used because of older IE browsers.
ES5 getters and setters did not have as nice of a syntax that ES6 brings us. So lets create a `get` and `set` for our name property.

<pre class="language-javascript">
<code>
// ES6 get and set
class Person {
    constructor(name) {
        this._name = name;
    }
  
    get name() {
        return this._name.toUpperCase();
    }
  
    set name(newName) {
        this._name = newName;   // validation could be checked here such as only allowing non numerical values
    }
  
    walk() {
        console.log(this._name + ' is walking.');
    }
}
         
let bob = new Person('Bob');
console.log(bob.name);  // Outputs 'BOB'
</code>
</pre>

In our class above we have a getter and setter for our name property. We use '_' convention to create a backing field to store our name property. With out this every time
get or set is called it would cause a stack overflow. The get would be called and which would cause the get to be called again over and over causing a infinite loop.

Something to note is that our backing field `this._name` is not private. Someone could still access `bob._name` and retrieve the property.
To achieve private state on objects you would use ES6 `symbol` and `module` to create true encapsulation and private state. Private methods can be created
using `module` or traditional closures using an IIFE. Private properties and functions using symbols and modules will be covered in a follow up post.

## Inheritance

Now lets look into inheritance using traditional prototypes in ES5 syntax. We will create a `Programmer` object to inherit our `Person` object.
Our programmer object will inherit person and also have a `writeCode()` method.

<pre class="language-javascript">
<code>
// ES5 Prototype inheritance
function Programmer(name, programmingLanguage) {
    this.name = name;
    this.programmingLanguage = programmingLanguage;
}
         
Programmer.prototype = Object.create(Person.prototype);
Programmer.prototype.constructor = Programmer;
         
Programmer.prototype.writeCode = function() {
    console.log(this.name + ' is coding in ' + this.programmingLanguage + '.');
}
 
var cory = new Programmer('Cory', 'JavaScript');
cory.walk();        // Outputs 'Cory is walking.'
cory.writeCode();   // Outputs 'Cory is coding in JavaScript.'
</code>
</pre>

Now lets look at the new ES6 Class syntax for inheritance using the `extend` keyword.

<pre class="language-javascript">
<code>      
class Programmer extends Person { 
    constructor(name, programmingLanguage) {
        super(name);
        this.programmingLanguage = programmingLanguage;
    }
  
    writeCode() {
        console.log(this._name + ' is coding in ' + this._programmingLanguage + '.');
    }
}
 
let cory = new Programmer('Cory', 'JavaScript');
cory.walk();        // Outputs 'Cory is walking.'
cory.writeCode();   // Outputs 'Cory is coding in JavaScript.'
</code>
</pre>

You can see the class syntax offers a clean syntax for prototypal inheritance. One detail you may notice is the `super()` keyword.
The super keyword lets us call the parent object that is being inherited. It is good advice to avoid this as this can cause an even tighter coupling between your
objects but there are occasions where it is appropriate to use. In this case it can be used in the constructor to assign to the super constructor. If the Person
constructor contained any logic, custom getters or setters for the name property we would want to use the super and not duplicate the logic in the Programmer class.
If a constructor is not defined on a child class the super class constructor will be invoked by default.

## Overview

Here is on final look at our Person and Programmer classes. The getters and setters are not necessary in this use case but are there to demonstrate the new syntax.

<pre class="language-javascript">
<code>      
class Person {
    constructor(name) {
        this._name = name;
    }
  
    get name() {
        return this._name;
    }
  
    set name(newName) {
        this._name = newName;
    }
  
    walk() {
        console.log(this._name + ' is walking.');
    }
}
         
class Programmer extends Person { 
    constructor(name, programmingLanguage) {
        super(name);
        this._programmingLanguage = programmingLanguage;
    }
  
    get programmingLanguage() {
        return this._programmingLanguage;
    }
  
    set programmingLanguage(newprogrammingLanguage) {
        this._programmingLanguage = newprogrammingLanguage;
    }
  
    writeCode() {
        console.log(this._name + ' is coding in ' + this._programmingLanguage + '.');
    }
}
         
let bob = new Person('Bob');
bob.walk();
         
let cory = new Programmer('Cory', 'JavaScript');
cory.walk();
cory.writeCode();
console.log(cory.name);
</code>
</pre>

A codepen.io demo of the code above can be found <a href="http://codepen.io/coryrylan/pen/PwOKWp">here</a>.
ES6 classes bring some syntactical sugar to prototypes. Just remember that is all ES6 classes are, syntactic sugar.
Remember classes are just one of many options to organize and structure code. There are many other great design patterns for
code reuse such as the <a href="/blog/javascript-module-pattern-basics">module pattern</a>.

ES6 brings some great improvements to making
JavaScript a more productive programming language and is already being implemented in browsers today. To start writing ES6 today check out
<a href="http://babeljs.io/" target="_blank">Babel JS (formerly 6to5)</a> a transpiler that transpile ES6 JavaScript to ES5.