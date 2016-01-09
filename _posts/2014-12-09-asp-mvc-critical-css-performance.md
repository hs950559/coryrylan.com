---
layout: post
title:  ASP MVC Critical CSS Performance
description: ASP MVC Critical CSS Performance, how to improve CSS and HTML render time in the browser.
keywords: Cory Rylan, Web, Development, CSS, HTML, Web Performance
tags: mvc, CSS, perfmatters
date: 2014-08-06
permalink: /blog/asp-mvc-critical-css-performance
---

I recently did a <a href="/blog/site-performance-review-08-2014" target="_blank">performance review of my own site</a> and have
added multiple improvements. One of best improvements was optimizing the loading of my critical CSS.
By including the critical CSS inlined in the head of the HTML we can send in a single response everything the browser needs to start rendering our view.
The browser now does not have to wait on a request to a external stylesheet. Try to keep the total size of the HTML
and inlined CSS to around 14kb. This will allow the browser to more likely receive the HTML file altogether and not receive
it in multiple portions across the network. This reduces latency and improves the render speed. This is difficult to achieve but is a good goal to shoot for.

The hard part is determining what is critical to your view as this can change on a page to page basis. My site is fairly simple so
I deferred CSS such as animations, web font definitions and print styles as they are not necessary to get the view painted to the screen. There are
many tools to help identify your critical CSS. <a href="https://github.com/giakki/uncss" target="_blank">UnCSS</a> and
<a href="https://github.com/addyosmani/grunt-uncss" target="_blank">Grunt UnCSS</a> on GitHub are great tools to help automate this process.
I am not going to cover these tools in this post, I'll be focusing on how I was able to get my CSS inlined into my ASP MVC views.

The first set up I have is I leverage Sass to precompile and organize my CSS in a modular style. I group all my non critical CSS in one
CSS generated file. This file I load asynchronously using the Filament Group's
<a href="https://github.com/filamentgroup/loadCSS" target="_blank">LoadCSS</a>. Using this I can defer my CSS until after page load.
This example uses the MVC bundling feature with a no js fallback.

<pre class="language-javascript">
<code>
&lt;head&gt;
    &lt;script&gt;
        // loadCSS 
        function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
        loadCSS("@@Styles.Url("~/bundles/deferred/css")");
    &lt;/script&gt;
    &lt;noscript&gt;
        @@Styles.Render("~/bundles/deferred/css")
    &lt;/noscript&gt;
&lt;/head&gt;
</code>
</pre>

So now that we are deferring our non critical CSS we inline the CSS needed to render what is visible
when the HTML loads. I bundle and minify my CSS with Sass for this bundle as well but you could use the MVC bundling tool. Even better use
a Grunt/Gulp task to identify exactly what critical CSS the page needs. A side note, any JavaScript in the head should
be async so it does not prevent the browser from the critical render path.

To inline your CSS you can use the following line in your views.

<pre class="language-clike">
<code>
&lt;style&gt;
    @@Html.Raw(File.ReadAllText(Server.MapPath("~/Content/Sass/all.min.css")))
&lt;/style&gt;
</code>
</pre>

This is a really easy simple way to improve performance on your site if it has a small amount of CSS. If you have a large
site with large CSS files I would recommend leveraging a Gulp/Grunt task to identify what CSS should be deferred.
