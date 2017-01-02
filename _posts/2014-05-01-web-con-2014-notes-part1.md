---
layout: post
title: Web Con Notes Part 1
description: Notes on Web Con 2014 CSS Frameworks
keywords: Cory Rylan, Web, Development, CSS
tags: webcon web
date: 2014-05-01
permalink: /blog/web-con-2014-notes-part1
---

Here are my notes from University of Illinois Web Con 2014. These are from the talk
<a href="http://innovatorylife.com/2014/05/02/life-without-a-bs-foundation/" target="_blank">"Life without a BS Foundation"</a>
by <a href="https://twitter.com/kianoshp" target="_blank">Kianosh Pourian</a>

<blockquote>
"Build a framework around your design not design around your framework."
</blockquote>

Cons for using front end frameworks such as Twitter Bootstrap and Zurb Foundation:

- Not semantic
- Naming conventions not established/documented poorly 
- Performance issues (bloat) 
- Little to no file structure especially Sass project for Bootstrap 
- Difficult to update 
- Design implementation frameworks fall short 
- Does not follow the DRY principals 
- Overriding is very difficult and tons of extra code and uses little of the framework 
- Editing the framework breaks any update 
- Impossible to create a framework for everyone 
- CSS is old and part of the issue 
- Spend a lot of time learning someone else's code 
- Not ideal for enterprise or large applicaions 

<blockquote>
"When building a site or web application, one must build it for success. Success means that small projects will evolve into large projects.
</blockquote>

What to do:

- "Do the sh*t yourself" 
- Write your own CSS 
- Create Style Guides 
- Use Sass or a preprocessor 
- Follow OOCSS Principals 
- <a href="http://bradfrostweb.com/blog/post/atomic-web-design/">Atomic Design</a> 
- Organize your code in modules in folders (each folder is a atom or module) 
- The global import file should have comment of what the modules are being imported for 
- Have a unified naming convention 
- Folders helps packages modules for individual consumption 
- Learn from frameworks such as Twitter Bootstrat and Zurb Foundation 