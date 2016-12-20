---
layout: post
title: Angular CLI - Adding Third Party Libraries
description: Learn how to add third party libraries to your Angular application using the Angular CLI.
keywords: Cory Rylan, Angular, Angular 2, CLI, Angular CLI
tags: angular
date: 2016-05-24
updated: 2016-09-15
permalink: /blog/angular-cli-adding-third-party-libraries
demo:
---

{% include ng-version.html %}

The [Angular CLI](https://cli.angular.io/) is a command line interface tool that allows us to quickly build and run our
Angular applications. The CLI can help us quickly scaffold components
and services in our app while following the best practices out of the box.

The CLI currently uses [Webpack](https://webpack.github.io/) under the hood to handle module bundling in our apps.
Webpack is a great open source tool that allows adding third part ES6 modules
easily to JavaScript applications.

As of this writing the Angular CLI is in Beta 14. So lets start with adding a popular library, 
[Lodash](https://lodash.com/). Lodash is a great JavaScript utility library that's commonly used in 
single page apps.

## Step 1: NPM
First we need to install Lodash from npm.

<pre class="language-javascript">
<code>
{% raw %}
npm install lodash --save
{% endraw %}
</code>
</pre>

Now that we have installed Lodash we need to install the TypeScript type definitions to allow 
our code to have better auto-competion and development experience. If you use a library that 
was written in TypeScript such as [RxJS]() you don't have to worry about installing the type 
definitions.

<pre class="language-javascript">
<code>
{% raw %}
npm install @types/lodash --save
{% endraw %}
</code>
</pre>

Now that lodash is installed we can import it into any file in our app.

<pre class="language-javascript">
<code>
{% raw %}
import * as _ from 'lodash';
{% endraw %}
</code>
</pre>

<h2>Global Files</h2>

Sometimes we need to load global scripts or CSS files into our projects that are not module based. 
The Angular CLI has a configuration option to load files such as these. In the `angular-cli.json` 
you can find a `styles` and `scripts` option where you can add the file paths of any files you would like
globally bundled with you application. Note these files are bundled first before the rest of our module bundle.

<pre class="language-javascript">
<code>
{% raw %}
"styles": [
  "styles.css"
],
"scripts": []
{% endraw %}
</code>
</pre>

So with these few options its relatively easy to add third party JavaScript and CSS to our Angular CLI applications.

