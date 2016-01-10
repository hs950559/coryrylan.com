---
layout: post
title: Why Enforcing Code Style is Important
description: Why code automated code style checks are important and how to handle introducing them.
keywords: Cory Rylan, Web, HTML5, JavaScript, Development, Code Styles, Code Linting
tags: cleancode, programming
date: 2015-08-30
permalink: /blog/why-enforcing-code-style-is-important
---

So what is code style and why does it matter? Code style can be boiled down to anything that is a stylistic choice in the code that
has no affect on the behavior of the code. So a infamous example is using tabs versus spaces.
Another example is primitive types with invoked functions are lower case versus upper case, `string.Format("Hello {0}!", value);`. These
differences have no effect on our codes behavior but can cause slight inconsistency in our code bases.

<img src="/assets/images/posts/why-enforcing-code-style-is-important/tabs-vs-spaces.jpg" alt="tabs vs spaces" class="margin-bottom-small" /><br />
<small>Image credit unknown</small>

##Why code styles?

Why should we care about code styles? Isn't it enough that our code works? Well there are a couple of reasons to care about
our code styles. The first is consistency. Any large code base with multiple team members should looks as if only one programmer wrote it.
If a team agrees on a given style it can help keep the code consistent. If everyone follows the same styles this helps keep source control changes
to a minimum. For example programmer A likes double quotes in his JavaScript code but programmer B likes single quotes. This can cause a headache for
code check ins and reviews. Once a code style is decided with a team everyone should follow it. This is not about preference
but about writing clean and consistent code which is what professional software developers should do.

When deciding a code style for your projects its best to start with language conventions. Some languages enforce certain styles while
others are community driven. An example JavaScript it is common to use single quotes vs double. There is practicality to this style choice
as it makes escaping quotes in HTML templating easier. In C# interfaces are commonly prefixed with and `I`. Now this
some say is not needed as our IDE's know its an interface and prefixing them is following
<a href="https://en.wikipedia.org/wiki/Hungarian_notation">Hungarian Notation</a> which is no longer
needed in modern IDE environments. Even though prefixing object types is not common anymore this is the convention with C# so it is widely followed
in the community.

##Getting Started

When team or company decides code style decisions are made they should be well documented and easily accessible. At <a href="https://github.com/vintage-software">Vintage Software</a>
we use github markdown to make it simple and easy to document our code style guide. People can link to certain rules in the style guide. People can also
leave bug issues and have discussions on any changes to the guide.

##Enforcing Styles and Tools

Code styles are great to have but when developers have a million other things to worry about like deadlines and bug fixes we tend to
get sloppy with code style. Using tools called code linters or code style checkers can help. There are a wide range of tools but all work in
a similar fashion. The linter checks for the source code for either potential bugs or code style violations. These tools usually come
with a rule configuration file. A team can modify this file to the rules they desire then source control it so all projects can benefit from it.

A common and popular tool in the JavaScript community is <a href="http://jscs.info/">JavaScript Code Styles (JSCS)</a>. This tool will run and give any warnings
of code style violations in our JavaScript. There are many other tools for all kinds of languages such as <a href="https://github.com/brigade/scss-lint">Sass</a>,

Make sure the style configs for your style checkers and linters are easy to access. At Vintage Software we have the linter config files source controlled directly with
our code style guide repo.

##Integration

Integrating these tools is usually pretty straight forward whether you use an IDE extension or use a
build task runner like <a href="http://gulpjs.com/">GulpJS</a>. If you are adding these tools to a large or legacy code base it may be best to turn the tool on
per file basis. Turning it on to check all files when first starting out may result in thousands of warnings or errors. Once the project
has been running with style checkers for a while then it will be more reasonable to turn on the tool for the entire project.

If you need some ideas on how to get started take a look at our <a href="https://github.com/vintage-software/javascript">JavaScript</a>
and <a href="https://github.com/vintage-software/html-css">HTML/CSS</a> style guides on Github!