---
layout: post
title: Adding the Internationalization Polyfill to a Angular CLI Project
description: Learn how to add Intl support to your Angular applications
keywords: Cory Rylan, Angular 2, Angular, Intl
tags: angular intl
date: 2016-09-22
updated: 2016-12-19
permalink: /blog/adding-the-internationalization-polyfill-to-a-angular-cli-project
---

{% include ng-version.html %}

Angular has great features out of the box that make developing web applications much easier. 
One of the great abilities of Angular is Internationalization (Intl) support. Many of Angular features such 
as the built in currency and date pipes use Internationalization to automatically display the appropriate 
currency format to users in different geo locations/regions.

If you have played with Angular latest 2.x+ at all you may of run into a strange error about `Intl` being undefined in certain browsers.
This is because under the hood Angular uses the new [Internationalization](https://github.com/andyearnshaw/Intl.js) 
standard built into JavaScript and the browser. The benefits
of this is that Angular doesn't have to bloat itself with Intl specific code and can use the Intl API provided by
the browser. The downside to this is not every browser supports `Intl` just yet. So to fix this there are a couple
of things we need to do to support those browsers.

## Polyfill, Polyfill, Polyfill

Polyfilling is all the rage in JavaScript! What is Polyfilling? Its core concept is to load additional code in the browser
to "fill in" any missing features that might not yet be supported. There are many variations of this idea but the
main benefit is browsers that support the feature download less code and are faster while older browsers
still get all the functionality they need. 

So how do we add `Intl` support to our Angular app? Well specifically we will focus on using a [Angular CLI](https://cli.angular.io)
project. The techniques we will cover can apply to Webpack and other build systems as well. 

The first option which is also the easiest is simply adding a script tag to your `index.html`. No really that's all it takes!

<pre>
<code class="language-html">
&lt;script src=&quot;https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en&quot;&gt;&lt;/script&gt
</code>
</pre>

Now you have `Intl` support in all your browsers. 
[polyfill.io](https://polyfill.io) is a nifty service that will only load the polyfill if the requested browser actually needs it. 
This is a pretty good solution but what if you want your polyfill to be bundled with your scripts? You potentially get better performance
and your application doesn't rely on a third party CDN that if it goes down it takes your app down with it. So whats the 
next option?

Well with the Angular CLI its actually quite easy. First we will use `npm` to install the `Intl` polyfill directly 
into our Angular app. To do this run `npm install intl --save`. Once installed in your Angular CLI project 
go to the `/src/polyfills.ts` file. In here you can add the following lines.

<pre>
<code class="language-javascript">
import 'intl';
import 'intl/locale-data/jsonp/en.js';
</code>
</pre>

That's it! Now when your project builds it will add the `Intl` polyfill and the English language service. You can 
add more language support by importing more language files. Now the downside to this is even if the browser 
supports `Intl` it still has to download the code. You could potentially mitigate this using feature detection
and dynamic loading. The great part about polyfilling is as browser support for `Intl` gets better we will be able
to drop the dependency all together!