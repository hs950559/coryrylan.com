---
layout: post
title: Web Font Performance A Case Study
description: Web font performance a case study on EstateSales.NET
keywords: Cory Rylan, Web, Development, EstateSales.NET, Performance, Font
tags: perfmatters, web
date: 2015-01-02
permalink: /blog/web-font-performance-a-case-study
---

Web fonts can really improve a website's readability and ease of use but can be detrimental to performance if not used carefully.
Web fonts are a blocking resource like CSS and will prevent the text from being rendered on the page until it loads.
In web-kit based browsers such as Chrome web fonts will halt text rendering for three seconds before falling back to a system font. Some browsers
such as Safari have no timeout and only a network timeout of 60 seconds!
IE11 will use a system font almost immediately if the custom font does not load then switch to the custom font when loaded.
This can cause FOUT (flash of unstyled text). Many agree and disagree over whether FOUT is a feature or a bug.

If we are trying to get our website to load and be usable within one second waiting for a font to load will likely prevent this. Waiting on a font to load
happens more than we would like to think. Spotty 3G mobile connections or going into a tunnel can easily prevent our sites from being usable.
Loading our font can easily add several seconds for the page to be readable on a mobile connection. Below you can see a single custom font has added 1.5 seconds
to our render time on a 3g mobile connection.

<img src="/assets/images/posts/web-font-performance-a-case-study/font-load-time.jpg" class="full-width col-8-contain" alt="Network slide breakdown of non async loading of font" />

I work on a site called <a href="http://www.estatesales.net" target="_blank">EstateSales.NET</a> where people can search and find local estate sales near them.
Our site is commonly used on mobile as people are out searching for sales. Much of the time these sales can take place in rural areas where you are lucky to
have a spotty 3g connection. It can be frustrating to have to wait for custom font to load to be able to read what you are searching for.
We should show the user what they want to see and progressively enhance our application with a custom font.

There are many ways to progressively enhance your site with web fonts such as Typekit's <a href="https://github.com/typekit/webfontloader" target="_blank">Web Font Loader</a> or
The Guardian using localStorage <a href="https://github.com/ahume/webfontjson" target="_blank">Web-Font-Json</a>. I am going to talk about how we implement our font loading for
EstateSales.NET using <a href="https://github.com/filamentgroup/loadCSS" target="_blank">loadCSS</a> and the pros and cons.

The first step is to optimize your font set. Don't include weights or glyphs that are not used. You can use a service like <a href="http://www.fontsquirrel.com/" target="_blank">fontsquirrel.com</a>
to subset your font selecting only the characters you need. Many sets come with hundreds of characters that are often unused.

Once you optimize your font it is ideal to only serve the WOFF and the upcoming WOFF2 format for your font set. WOFF is a highly optimized font set that compresses really well. Other font sets
such as EOT for legacy browsers are not as efficient and can really slow down older browsers. Luckily all modern browsers support WOFF. The only browsers that wont
support WOFF are older IE and Android 2.x versions. Don't serve custom fonts to these browsers if you don't have to, they can safely fall back to system fonts.
Your users will appreciate not having to load in another resource on a already slow browser. We then base64 encode our WOFF font into our deferred CSS to prevent another request. This also prevents a flash of missing
text while the browser waits to download the font file.

You can get a copy of your font in a base64 converted CSS file at <a href="http://www.fontsquirrel.com/tools/webfont-generator" target="_blank">http://www.fontsquirrel.com/tools/webfont-generator</a> under
expert settings.

On EstateSales.NET we use a small JavaScript snippet called <a href="https://github.com/filamentgroup/loadCSS" target="_blank">loadCSS</a> from the
Filament Group to load our non critical CSS. This CSS contains plug-in CSS and some below the fold CSS. This asynchronously loads the CSS
that is not critical for the initial rendering. Using this technique we can asynchronously load our font as well.
In our base CSS file we declare our base fonts that we want the browser to initially use while the custom font is downloaded.

<pre class="language-css">
<code>
body {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 300;
    font-size: 16px;
    color: #2d2d2d;
}
</code>
</pre>

This is the script that asynchronously loads our deferred CSS file. This script should be placed in the head of your html file.

<pre class="language-javascript">
<code>
function loadCSS(e,t,n){"use strict";function o(){var t;for(var i=0;i&lt;s.length;i++){if(s[i].href&&s[i].href.indexOf(e)&gt;-1){t=true}}if(t){r.media=n||"all"}else{setTimeout(o)}}var r=window.document.createElement("link");var i=t||window.document.getElementsByTagName("script")[0];var s=window.document.styleSheets;r.rel="stylesheet";r.href=e;r.media="only x";i.parentNode.insertBefore(r,i);o();return r}
loadCSS('/deferred.css');
</code>
</pre>

In our `deferred.css` we have the following lines:

<pre class="language-css">
<code>
@@font-face {
    font-family: 'robotoregular';
    url(data:application/x-font-woff;charset=utf-8;base64,d09GRg...
    font-weight: normal;
    font-style: normal;
}
body {
    font-family: "robotoregular", Helvetica, Arial, "Lucida Grande", sans-serif;
}
</code>
</pre>

The loadCSS script will asynchronously load our deferred CSS file and append the reference to the head of the document causing the CSS to be applied. The new rule with the
`robotoregular` declaration with be triggered causing the browser to apply it to our page.
The benefit here is while the file downloads the browser will display the text with one of the initial system fonts.

The first image you can see our font loads before render so the browser must wait until it loads before displaying text.

<img src="/assets/images/posts/web-font-performance-a-case-study/non-deferred-font.jpg" class="full-width" alt="Network breakdown of async loading of font" />

In the second image is our font deferred using loadCSS. The browser can render the page with a system font until the custom font in our deferred CSS is loaded.

<img src="/assets/images/posts/web-font-performance-a-case-study/deferred-font.jpg" class="full-width" alt="Network breakdown of non async loading of font" />

Async loading our font has really improved our first time rendering speed. There are some pros and cons to this technique. The pros are it speeds up render and is a fairly simple
technique to implement. The browser will keep our CSS embedded font in cache until we trigger an update. The downsides are FOUT will occur on the first page landing.
Other downsides are browser cache can be unreliable causing the font and css be re-requested causing FOUT to occur again.

FOUT is a compromise we were willing take for a faster browsing experience especially on mobile. Also our body copy font is Roboto which is not a drastic change from our fall backs
such as Helvetica. This helps FOUT not be as jarring to users. If you were to use a very stylistic font it would cause FOUT to be much more noticeable.

Web fonts can be complicated at times but run tests and find the technique that works best for your use case. New proposals for a font loading API
are underway that will allow you to control the font loading/rendering behavior in the browser natively using CSS. You can view the proposal here
<a href="https://github.com/KenjiBaheux/css-font-rendering/" target="_blank">github.com/KenjiBaheux/css-font-rendering/</a>.