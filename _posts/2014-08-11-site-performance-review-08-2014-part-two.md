---
layout: post
title: Site Performance Review 8/2014 Part Two
description: Part two of my site performance review
keywords: Cory Rylan, Web, Performance, CSS, JavaScript
tags: perfmatters, web
date: 2014-08-11
permalink: /blog/site-performance-review-08-2014-part-two
---

I recently did a <a href="/blog/site-performance-review-08-2014" target="_blank">performance review of my own site</a>. In
this post I am going to cover what I did to improve my site performance and what challenges there were. Here is my site before
I started optimizing my pages.

<table>
    <caption>Old Performance Stats (Home Page 3G connection)</caption>
    <tbody>
        <tr>
            <th scope="row">Load time</th>
            <td>1.689s</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Start Render</th>
            <td>0.996s</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Speed Index (3G connection)</th>
            <td>1291</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Google Page Speed Mobile</th>
            <td>88/100</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Google Page Speed Desktop</th>
            <td>95/100</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">6 Requests</th>
            <td>84.6kb</td>
            <td></td>
        </tr>
    </tbody>
</table>

##Gzip and SVG
     
So the first major issue for slowing my site down was my SVG images not gzipping. I load a large background SVG onto the site that was
about 23kb. I looked into why my Azure server configuration was not gzipping SVGs and I came up with a solution. Unfortunately this was the most
difficult issue to resolve. I wrote a blog post on what I did to fix this here,
<a href="/blog/svg-gzip-windows-azure" target="_blank">SVG gzip Windows Azure</a>.
After resolving this I was able to compress the SVG background down to 7.6kb.

##Fonts 

The next fix to improve performance was to optimize my fonts. I use Roboto as my font site wide. Loading in a custom web font really
slows down the text render time on the page especially on mobile. So the first thing I did was go to fontsquirrel.com and subset my copy of
Roboto. Before sub setting my file size was 23.7kb total. After sub setting I reduced my file down to 17.6kb total.


Next I deferred loading of my font until after document load. This causes FOUT (flash of unstyled text) but if the web font is lost in the network or slow to load the
browser will be using the default system font until the custom web font is loaded. I used the Filament Group's awesome script
<a href="https://github.com/filamentgroup/loadCSS" target="_blank">LoadCSS</a>. Something I noticed is if you use the HTML5 prerender/prefetch
feature it can minimize FOUT on the next page. I only noticed this in Chrome.

##CSS 

Deferring your non critical CSS and inlining critical CSS in the head of the document can greatly
improve your render times. The idea is if you inline your CSS the document the CSS will arrive with the document and the browser
can start rendering your page immediately. The browser does not have to wait to load in a external stylesheet. The tricky park is
knowing what to inline and what not to inline. Only inline the minimal amount to render above the fold content. Anything else can wait.
The other issue is you need to keep this inline small. You dont want to bloat your HTML pages with inlined CSS. The ideal amount is to keep
your HTML and inlined CSS to a total of 14kb This helps ensure the file is sent altogether. This is a difficult guideline but a good
one to shoot for.


The CSS I chose to defer were selectors that dealt with animations, font loading, icon fonts, and print styles. All of this CSS was unnecessary
to get the first time render to the screen. I used the LoadCSS script to load in me non critical CSS. I wrote a small blog post on how I
<a href="/blog/asp-mvc-critical-css-performance" target="_blank">inlined critical CSS for a MVC project</a>. I used unCSS to analyze what selectors were not being used and removed
unnecessary ones as needed.


##The Aftermath

Here are my performance test scores now after all of the optimizations.
     
<table>
    <caption>New Performance Stats (Home Page 3G Connection)</caption>
    <tbody>
        <tr>
            <th scope="row">Load time</th>
            <td>1.3s</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Start Render</th>
            <td>0.7s</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Speed Index (3G connection)</th>
            <td>994</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Google Page Speed Mobile</th>
            <td>98/100</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Google Page Speed Desktop</th>
            <td>100/100</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">6 Requests</th>
            <td>68kb</td>
            <td></td>
        </tr>
    </tbody>
</table>

<blockquote class="twitter-tweet" lang="en"><p>First paint with text to screen in less than 1 second on a good 3G connection. 
<a href="https://twitter.com/hashtag/perfmatters?src=hash">#perfmatters</a> <a href="http://t.co/HqNg493Z3O">pic.twitter.com/HqNg493Z3O</a></p>&mdash; Cory Rylan (@SplinterCode) <a href="https://twitter.com/SplinterCode/statuses/495618360089268224">August 2, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
 
Overall the work was well work it. My site can now render in one second on a good 3G connection and half a second on a cable connection.
Optimizing client side performance can be difficult at times but with good tooling it can be a automated process of your builds.
