---
layout: post
title: Site Performance Review 8/2014
description: Site Performance Review 08/2014, covering web performance issues with my own site.
keywords: Cory Rylan, Web, Development, Responsive, Performance
tags: performance web
date: 2014-08-01
permalink: /blog/site-performance-review-08-2014
---

So I decided to take a performance review of my own personal site after some optimization
work and write about some of my findings. I did a average content breakdown on my home page and will
cover a few other pages that load different resources.

I calculated all the resources for first time view on my home page with gzip. I do not include third party resources such as
Google Analytics and Disqus because they are usually async and are outside of the developers control.

<table>
    <caption>Content Breakdown for coryrylan.com (home page gzipped)</caption>
    <tbody>
        <tr>
            <th scope="col">Resource</th>
            <th scope="col">Size</th>
            <th scope="col">Percentage</th>
        </tr>
        <tr>
            <th scope="row">HTML</th>
            <td>2.5kb</td>
            <td>2.9%</td>
        </tr>
        <tr>
            <th scope="row">CSS</th>
            <td>7.5kb</td>
            <td>9.0%</td>
        </tr>
        <tr>
            <th scope="row">JavaScript</th>
            <td>0kb</td>
            <td>0%</td>
        </tr>
        <tr>
            <th scope="row">Images</th>
            <td>17.8kb</td>
            <td>20.9%</td>
        </tr>
        <tr>
            <th scope="row">SVG</th>
            <td>23.2kb</td>
            <td>27.4%</td>
        </tr>
        <tr>
            <th scope="row">Fonts</th>
            <td>33.6kb</td>
            <td>39.8%</td>
        </tr>
        <tr>
            <th scope="col">Total</th>
            <th scope="col">84.6kb</th>
            <th scope="col"></th>
        </tr>
    </tbody>
</table>

## JavaScript

If you closely you will notice I have 0kb of JavaScript. Excluding Google Analytics this is correct. I have other JavaScript dependencies
on my site I load only when needed. I use Disqus for blog comments. I also use Prism.js for code examples on my blog as well. On my
Contact page I use JQuery & JQuery Unobtrusive Validation library for my contact form validation. Listed below is the content breakdown of all JavaScript resources on my site.

<table>
    <caption>JavaScript Breakdown (gzipped)</caption>
    <tbody>
        <tr>
            <th scope="col">Resource</th>
            <th scope="col">Size</th>
            <th scope="col">Percentage</th>
        </tr>
        <tr>
            <th scope="row">JQuery &amp; Validation (Contact)</th>
            <td>46.6kb</td>
            <td>90.1%</td>
        </tr>
        <tr>
            <th scope="row">Prism.js (Blog)</th>
            <td>5.1kb</td>
            <td>9.9%</td>
        </tr>
        <tr>
            <th scope="col">Total</th>
            <th scope="col">51.7kb</th>
            <th scope="col"></th>
        </tr>
    </tbody>
</table>

## CSS

I only have one CSS file that is minified. I use Sass as a preprocessor for my CSS. I generate a seperate CSS file for ie8 non media query support.

<table>
    <caption>CSS Breakdown (9.0% gzipped)</caption>
    <tbody>
        <tr>
            <th scope="row">Selectors</th>
            <td>695</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Rules</th>
            <td>382</td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Total</th>
            <td>7.5kb</td>
            <td></td>
        </tr>
    </tbody>
</table>

Performance side note, because my CSS is so small I can inline this in the head of the document to get a faster paint time. This is
because the server will not need to go get a CSS file to start rendering the screen. I have tried this and it does improve speed but I
have not yet found a build process that I am happy with to automate this.

## HTML

I have one HTML page requested from a prerendered view on the server. I do not
pull any dynamic content except on blog post comments.

<table>
    <caption>HTML Breakdown (2.9% gzipped)</caption>
    <tbody>
        <tr>
            <th scope="col">Resource</th>
            <th scope="col">Size</th>
            <th scope="col">Percentage</th>
        </tr>
        <tr>
            <th scope="row">Home Page</th>
            <td>2.5kb</td>
            <td>100%</td>
        </tr>
    </tbody>
</table>

## Images

I have two images on my home page currently. I have one JPG and one SVG background. I do have images
on other pages of my site such as blog posts. All my images are compressed and gzipped.

<table>
    <caption>Images Breakdown (48.3% gzipped)</caption>
    <tbody>
        <tr>
            <th scope="col">Resource</th>
            <th scope="col">Size</th>
            <th scope="col">Percentage</th>
        </tr>
        <tr>
            <th scope="row">Image of myself</th>
            <td>17.8kb</td>
            <td>43.5%</td>
        </tr>
        <tr>
            <th scope="row">Background SVG (gzip fails)</th>
            <td>23.1kb</td>
            <td>56.5%</td>
        </tr>
        <tr>
            <th scope="col">Total</th>
            <th scope="col">40.9kb</th>
            <th scope="col"></th>
        </tr>
    </tbody>
</table>

## SVG

Performance side note, currently SVG images are not gzipping on my Azure host and I am working on a solution. This causes
a extra ~15kb to be downloaded. If anyone knows of a solution please feel free to comment.

I load in two font sets for my site. The first is Roboto Regular for my base font. The second is a custom built icon set
from Fontello.

<table>
    <caption>Font Breakdown (39.8% gzipped)</caption>
    <tbody>
        <tr>
            <th scope="col">Stat</th>
            <th scope="col"></th>
            <th scope="col"></th>
        </tr>
        <tr>
            <th scope="row">Fontello</th>
            <td>6.5kb</td>
            <td>19.2%</td>
        </tr>
        <tr>
            <th scope="row">Roboto Regular</th>
            <td>27.3kb</td>
            <td>80.8%</td>
        </tr>
        <tr>
            <th scope="row">Size</th>
            <td>33.8kb</td>
            <td></td>
        </tr>
    </tbody>
</table>

Performance tests can be skewed because if you
request the browser to prefetch/prerender other pages in the background to make them load faster. I turned this off while running
the tests. Prerendering doubled my load time because of loading resources for other pages even if the requested page was completely rendered.
This skewed my page speed index score. This applied to <a href="http://www.webpagetest.org/" target="_blank">webpagetest.org</a> and not to <a href="http://developers.google.com/speed/pagespeed/insights/" target="_blank">Google Page Speed</a>

<table>
    <caption>Performance Stats</caption>
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

Overall my site has pretty good performance. My Page Speed Index is around 1291 on a 3g connection.
My Google page speed mobile ranks a 88 out of 100 and desktop a 95/100. Good scores but definitely can be improved.
My major performance issue currently is my SVG images not gzipping. I am guessing some type of config issue. My other major
performance issue is CSS loading. I can optimize my CSS by inining in the head or defering the unnecessary parts. I also could defer
loading of my web fonts to improve render time and make the site useable sooner. I'll be post a update after working on some
improvements and see how much faster I can push my site.
