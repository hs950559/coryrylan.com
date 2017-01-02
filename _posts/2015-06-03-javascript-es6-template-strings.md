---
layout: post
title: JavaScript ES6 Template Strings
description: A look into the new ES2015/ES6 JavaScript template string syntax.
keywords: Cory Rylan, Web, HTML5, JavaScript, Software Development, ES6, ES2015, Template Strings
tags: javascript es2015
date: 2015-06-03
permalink: /blog/javascript-es6-template-strings
---

The ES2015 or also known as ES6 version of JavaScript introduces many new syntax features to the language. One of the new features added are Template Strings.
Template Strings add new functionality and syntactic sugar to our code. Let look at a traditional way of creating and building a multi line strings in JavaScript
prior to ES6.
        
<pre class="language-javascript">
<code>
// Use +
var heading = 'All about JS';
var content = 'Stuff about JS';
var htmlTemplate =      
    '&lt;div&gt;' + 
        '&lt;h3&gt;' + heading + '&lt;/h3&gt;' +
        '&lt;p&gt;' +
            content + 
        '&lt;/p&gt;' +
    '&lt;/div&gt;';
      
// Or Use arrays
var htmlTemplate2 = [
    '&lt;div&gt;',
        '&lt;h3&gt;', heading, '&lt;/h3&gt;',
        '&lt;p&gt;',
            content,
        '&lt;/p&gt;',
    '&lt;/div&gt;'].join('');
</code>
</pre>

Prior to ES6 building templates or strings natively the `+` operator was one of the only choices. This made creating dynamic
strings ugly and not very fun to work with. Now lets look at an example that uses ES6 Template strings.

<pre class="language-javascript">
<code>
// Use Template Strings
var heading = 'All about JS';
var content = 'Stuff about JS';
var htmlTemplate =      
    `&lt;div&gt;
        &lt;h3&gt;${heading}&lt;/h3&gt;
        &lt;p&gt;
            ${content}
        &lt;/p&gt;
    &lt;/div&gt;`;
</code>
</pre>

Using Template strings we get multi line string support along with object templates. Notice the syntax differences between the ES5 and ES6 versions.
In our ES6 Template String we use a back tic <code>`</code> instead of a quote. This tells the JavaScript engine that this line is a template string instead of
a standard string. The second part it the `${}` syntax. This allows us to insert variables into our strings without the need of concatenation operations.
Together this creates a much cleaner and easier syntax to work with. The Template String is treated as an expression so we can also have operations in our `${}`
syntax.

<pre class="language-javascript">
<code>
// Use Template Strings
var htmlTemplate =      
    `&lt;div&gt;
        &lt;p&gt;
            output: ${2 + 2}
        &lt;/p&gt;
    &lt;/div&gt;`;
console.log(htmlTemplate); // output: 4
</code>
</pre>

ES6 Template strings adds a nice syntactic sugar to JavaScript improving the overall development experience. To start using ES6 today check out
the ES6 transpiler <a href="https://babeljs.io/" target="_blank">Babel.js</a>.