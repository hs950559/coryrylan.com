---
layout: post
title: SVG gzip in Windows Azure
description: SVG gzip in Windows Azure
keywords: Cory Rylan, SVG, Windows, Azure
tags: angular2, typescript
date: 2014-08-04
updated: 2014-08-05
permalink: /blog/svg-gzip-windows-azure
---

When running a Windows Azure website you may run into a problem I came across with gzipping content.
By default Azure websites are very easy to set up and have little maintenance cost. Most of the performance
features are turned on by default with one exception. SVG images seem to not gzip on website instances.
<span class="strike">Azure Websites seem to also ignore the web config overrides for this as well.</span>

<p class="strike">
    Unfortunately the way to turn this on is to use Web Roles. I did not want to deal with that hassle so I created a controller to
    handle incoming SVG requests as recommended from these two posts,
    <a href="http://stackoverflow.com/questions/17029543/enable-gzip-compression-for-svg-in-azure-web-sites" target="_blank">Stack Overflow</a> and
    <a href="http://weblogs.asp.net/jongalloway//asp-net-mvc-routing-intercepting-file-requests-like-index-html-and-what-it-teaches-about-how-routing-works" target="_blank">Asp Weblogs</a>.
</p>


Thanks to David Ebbo (<a href="https://twitter.com/davidebbo" target="_blank">@davidebbo</a>) he pointed me in the right direction in making a better solution. it turns out you can get gzip to turn
on for SVG with the web config. The solution is below, as well as the comments.

<pre class="language-markup">
<code>
&lt;configuration&gt;
   &lt;system.webServer&gt;
      &lt;staticContent&gt;
         &lt;mimeMap fileExtension=&quot;.svg&quot; mimeType=&quot;image/svg+xml&quot;/&gt;
      &lt;/staticContent&gt;
      &lt;httpCompression&gt;
         &lt;staticTypes&gt;
           &lt;remove mimeType=&quot;*/*&quot;/&gt;
           &lt;add mimeType=&quot;image/svg+xml&quot; enabled=&quot;true&quot;/&gt;
           &lt;add mimeType=&quot;*/*&quot; enabled=&quot;false&quot;/&gt;
         &lt;/staticTypes&gt;
      &lt;/httpCompression&gt;
   &lt;/system.webServer&gt;
&lt;/configuration&gt;
</code>
</pre>

The key part I was previously missing was the `<remove mimetype="*/*" />`.
If you read the comments by David it seems that this will be fixed and turned on by default on the next Azure update.
