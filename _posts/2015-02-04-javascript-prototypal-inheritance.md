---
layout: post
title: JavaScript Prototypal Inheritance
description: A beginner overview on JavaScript prototypal inheritance.
keywords: Cory Rylan, Web, JavaScript, JavaScript Prototype, JavaScript Pattern
tags: javascript, programming
date: 2015-02-04
updated: 2016-01-10
permalink: /blog/javascript-prototypal-inheritance
---

The Prototype is a JavaScript object property that gives us inheritance and re-usability in our objects.
If you come from a classical Class based language such as Java or C# prototypes can be confusing at first.
In this post I am going to cover a simple example where we will create multiple objects and create a inheritance chain between them.

First lets create our first object. JavaScript does not have a formal `Class` keyword as of the current ES5 version in most browsers. This post will focus
on current techniques using ES5 syntax. The upcoming EcmaScript 6 edition will bring the `Class` keyword with some syntactic
sugar for creating and managing objects.

To create objects we use functions to create constructors for our objects. It is the convention to capitalize functions that
are object constructors. Any other functions that are not constructors should start lower case.

<pre class="language-javascript">
<code>
function Person(name) {
  this.name = name;
}
</code>
</pre>

Here is our new Person constructor. It contains on instance property called 'name'. Now lets create a couple of objects from our constructor.

<pre class="language-javascript">
<code>
function Person(name) {
  this.name = name;
}
 
var bob = new Person('Bob');
var john = new Person('John');
 
console.log(bob.name); // Outputs 'Bob'
console.log(john.name); // Outputs 'John'
</code>
</pre>

As you can see we have created two new instances of our Person object, Bob and John. Each have their own name property that
logs out their respective values. Now lets make our Person class a little more useful by adding a `walk` method.

<pre class="language-javascript">
<code>
function Person(name) {
  this.name = name;
}
         
Person.prototype.walk = function() {
  console.log(this.name + ' is walking.');
}
 
var bob = new Person('Bob');
bob.walk(); // Outputs 'Bob is walking.'
var john = new Person('John');
john.walk(); // Outputs 'John is walking.'
</code>
</pre>

Here we add a new method `walk` to the prototype of our Person object. Every object in JavaScript
contains a prototype object. Think of the prototype object as your blueprint for your objects. Anything you attach
to the object prototype new instances of that object share the prototype. This prevents the creation of a new `walk`
method from being created with every person object.

A side note it is usually bad practice to alter or extend native JavaScript object prototypes such as Object or Array.
Manipulating these object prototypes could result in conflicts with future versions or methods added to these native objects.
Exceptions to this practice would be to pollyfill newer JavaScript features for browser support such as `Array.Map`, `Array.ForEach`, ect.

##Object Inheritance

So what if we want to create a `Programmer` object that inherits our `Person` object? First lets make a
`Programmer` constructor.

<pre class="language-javascript">
<code>
function Programmer(name) {
  Person.call(this, name);
  this.programmingLanguage = '';
}
</code>
</pre>

So now we have a simple constructor with two properties a `name` and `programmingLanguage`.
The `call` statement allows us to set the name property in the context of the Person constructor. This could
be roughly equated to a super call in other object oriented languages.
So how do we inherit the Person object? We use prototypes.

<pre class="language-javascript">
<code>
function Person(name) {
  this.name = name;
}
    
Person.prototype.walk = function() {
  console.log(this.name + ' is walking.');
}
  
function Programmer(name) {
  Person.call(this, name);
  this.programmingLanguage = '';
}
         
Programmer.prototype = Object.create(Person.prototype);
Programmer.prototype.constructor = Programmer;
         
var cory = new Programmer('Cory');
cory.walk();    // Outputs 'Cory is walking.'
</code>
</pre>

Using `Object.create` will create a new object from `Person.prototype` and allows us to set `Programmer.prototype` to it. Programmer will inherit all the Person properties and methods from the Person constructor and prototype object.
The second part is setting the prototype constructor property. Every object's prototype contains a constructor property that defines what its original constructor was.
When you set a object property to inherit another object you must make sure to define your constructor property to reflect the new object you are creating. If this is not set
the `prototype.constructor` property will return the original parent object as this would be incorrect for the child object. So we would set our Programmer object to:
`Programmer.prototype.constructor = Programmer;`.

Now that we have a Programmer object that inherits our Person object lets add a `writeCode` method so our Programmer is a little more useful.

<pre class="language-javascript">
<code>
function Person(name) {
  this.name = name;
}
    
Person.prototype.walk = function() {
  console.log(this.name + ' is walking.');
}
  
function Programmer(name) {
  Person.call(this, name);
  this.programmingLanguage = '';
}
         
Programmer.prototype = Object.create(Person.prototype);
Programmer.prototype.constructor = Programmer;
Programmer.prototype.writeCode = function() {
  console.log(this.name + ' is coding in ' + this.programmingLanguage + '.');
}
           
var cory = new Programmer('Cory');
cory.programmingLanguage = 'JavaScript';
cory.walk();        // Outputs 'Cory is walking.'
cory.writeCode();   // Outputs 'Cory is coding in JavaScript.'
</code>
</pre>
     
So now we have created a Programmer object that inherits a Person object. Our Programmer object can now `walk` from inheriting the Person object
but can also `writeCode` from its own method and `programmingLanguage` property.

##Private Members in Constructors


So what if we wanted private properties on our objects that only the object itself can alter? For example we have a skill level property on our Programmer object
that we want to only be increase by one point at a time?


We would like the `skillLevel` property to incremented by a method `increaseSkillLevel` that increments the property by one point. We also
want to be able to get this value but not be able to set so we would want a `getSkillLevel` method.
     
<pre class="language-javascript">
<code>   
function Programmer(name) {
  var skillLevel = 0;
  
  Person.call(this, name);
  this.programmingLanguage = '';
  
  this.getSkillLevel = function() {
    return skillLevel;
  };
  
  this.increaseSkillLevel = function() {
    skillLevel += 1;
  }
}
         
Programmer.prototype = Object.create(Person.prototype);
Programmer.prototype.constructor = Programmer;
Programmer.prototype.writeCode = function() {
  console.log(this.name + ' is coding in ' + this.programmingLanguage + '.');
}
 
         
var cory = new Programmer('Cory');
cory.programmingLanguage = 'JavaScript';
         
console.log(cory.getSkillLevel());  // Outputs '0'
cory.skillLevel = 1000;
console.log(cory.getSkillLevel());  // Outputs '0'
cory.increaseSkillLevel();
console.log(cory.getSkillLevel());  // Outputs '1'
</code>
</pre>

As you can see I can now only edit or get the programmer's skill level through the properties exposed by the constructor. This allows private members on our objects.
Now there is a downside to this method. Every instance of Programmer will now create a `getSkillLevel()` and `increaseSkillLevel()` method. Because
these methods are defined in the constructor instead of being defined on our prototype they cannot be shared across all instances of Programmer. This results in a much less efficient
object than when the properties are defined on the prototype. This is the only technique to allow private members on your objects that are not Singleton or Module based.

So we have covered how to create custom objects and inheritance chains using prototypes. These techniques will soon be optional with the upcoming ES6 spec and `Class`
syntax. Remember even with the new `Class` syntax soon on its way, under the hood it is still prototypal inheritance at work. ES6 `Class` will add
syntactic sugar giving our code a cleaner syntax to work with.