---
layout: post
title: Angular 2 Text Snippet Directive
description: Learn about the new Directive API and build a text snippet directive.
keywords: Cory Rylan, Angular 2, AngularJS, TypeScript, JavaScript
tags: angular2, typescript
date: 2016-01-11
permalink: /blog/angular-2-text-snippet-directive
---

With Angular 2 the components API things in Angular have become much simpler. Components have replaced Controllers and the Directives API as we 
know it in Angular 1.x. In Angular 2 we still have Directives but you can think of them as Components without views. Directives are still used whenever
we need to modify the DOM directly. Directives are also primarily used in the form of attributes or properties to decorate Components with.

So lets explore the Directives API by building a AutoText/Snippets directive that allows users to generate text snippets quickly on the fly.
Here is an animation of what our final view would like.

<img src="/assets/images/posts/angular-2-text-snippet-directive/snippet-directive.gif" alt="A snippets directive example" class="full-width contain--4 block-center" />

So lets take a look at what our markup would look like tto use our Directive on a textarea input.

<pre class="language-markup">
<code>
&lt;textarea [uiSnippets]=&quot;mySnippets&quot;&gt;&lt;/textarea&gt;
</code>
</pre>

Our textarea will have a Directive of `uiSnippets`. We prefix our Directive to follow best practices. Our directive is passed in a list of snippets from 
our Component.

<pre class="language-typescript">
<code>
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {UISnippets} from 'src/ui-snippets.directive';

@Component({
  selector: 'demo-app',
  templateUrl: 'src/app.html',
  directives: [UISnippets]
})
export class App {
  constructor() { 
    this.mySnippets = [
      {
        name: 'lorem',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      },
      {
        name: 'bacon',
        content: 'Bacon ipsum dolor amet doner strip steak pastrami, hamburger sirloin spare ribs andouille. Salami drumstick strip steak ground round pork loin pastrami pancetta porchetta andouille pork chop short loin. Beef ground round t-bone shank leberkas flank filet mignon boudin meatball jowl short ribs.'
      },
      {
        name: 'zombie',
        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
      }
    ];
  }
}

bootstrap(App);
</code>
</pre>