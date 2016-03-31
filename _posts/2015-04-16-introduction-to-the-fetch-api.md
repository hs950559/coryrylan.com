---
layout: post
title: Introduction to the Fetch API
description: A intro to the Fetch API with some simple use cases.
keywords: Cory Rylan, Web, HTML5, JavaScript, Software Development, Fetch, API
tags: html5, javascript
date: 2015-04-16
permalink: /blog/introduction-to-the-fetch-api
---

XMLHttpRequest has been the browser standard for a long time for JSON and XML requests.
For most of us in web development we are quite familiar with AJAX abstractions such as jQerry's `$ajax` or Angular's `$q`
This is because for a long time browser support for XMLHttpRequest was spotty at best.

Browsers have greatly improved over the past couple of years but we continue to use abstractions
because of XMLHttpRequest's clunky and ugly API. Here is a simple example.

<pre class="language-javascript">
<code>
var xhrReq = new XMLHttpRequest();
xhrReq.open('GET', '/url/api');
xhrReq.responseType = 'json';
         
xhrReq.onload = function() {
  console.log(xhr.response);
};
         
xhrReq.onerror = function(error) {
 
};
         
xhrReq.send();
</code>
</pre>

Pretty ugly syntax. It's not using promises to handle the response which makes complex asynchronous code a real pain.

## The Fetch API

Lets look at the new Fetch API to get some JSON.

<pre class="language-javascript">
<code>
fetch('/url/api').then(function(response) {
	console.log(response.json());
}).catch(function(error) {
         
});
</code>
</pre>

In its simplest form thats it! Much cleaner syntax and uses modern ES6 JavaScript promises. We can chain on our promise to modify our response or to
handle some other work before we hand it back.

<pre class="language-javascript">
<code>
fetch('/url/api').then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(data);
}).catch(function(error) {
         
});
</code>
</pre>

Fetch by default uses GET. If you need to POST some JSON to the server you can use something like the following.

<pre class="language-javascript">
<code>
fetch('/url/api', {
    method: 'post',
	body: JSON.stringify({
		email: document.querySelector('#emailInput'),
		name: document.querySelector('#nameInput')
	})
}).then(function(response) { /* ... */ });
</code>
</pre>

If you need to set response headers for authentication like many API's require you can do something like the following.

<pre class="language-javascript">
<code>
fetch('/url/api', {
	headers: {
		'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': 'authkey'
	}
}).then(function(response) { /* ... */ });
</code>
</pre>

Fetch is in active development with features being added to it currently. You can start using it today in Chrome and use
a <a href="https://github.com/github/fetch" target="_blank">polyfill</a> for all other browsers with ie9+ support. To get a in depth understanding of the new Fetch API
I suggest looking into the <a href="http://updates.html5rocks.com/2015/03/introduction-to-fetch" target="_blank">HTML5 Rocks</a>
article. Fetch will replace the XMLHttpRequest API and can't come soon enough.