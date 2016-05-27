---
layout: post
title: Angular 2 CLI - Adding Third Party Libraries
description: Learn how to add third party libraries to your Angular 2 application using the Angular CLI
keywords: Cory Rylan, Angular 2, CLI, Angular CLI
tags: Angular2, Angularjs
date: 2016-05-24
permalink: /blog/angular-2-cli-adding-third-party-libraries
demo:
---

The [Angular CLI](https://cli.angular.io/) is a command line interface tool that allows us to quickly build and run our
Angular 2 applications. The CLI can help us quickly scaffold components
and services in our app while following the best practices out of the box.

The CLI currently uses [SystemJS](https://github.com/systemjs/systemjs) to handle module loading in the browser. SystemJS 
has been the default module loader for the Angular CLI and the Angular documentation. SystemJS is lightweight
and mimics a proposed module loader spec for browsers. The down side to SystemJS is it does require more configuration than other options 
which makes adding third party libraries in a Angular CLI project a bit tricky. 

As of this writing the Angular CLI is in Beta (beta 5). So lets start with adding a popular library, [ChartJS](http://www.chartjs.org/).
ChartJS is a small library that offers canvas based charts and graphs.

## Step 1: NPM
First we need to install ChartJS from npm.

<pre class="language-javascript">
<code>
{% raw %}
npm install chart.js --save
{% endraw %}
</code>
</pre>

Now that we have installed ChartJS we need to tell the CLI in the `angular-cli-build.js` file where the new JavaScript file is located 
so it can be bundled.

<pre class="language-javascript">
<code>
{% raw %}
// angular-cli-build.js

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/**/*.+(js|js.map)',
      'es6-shim/es6-shim.js',
      'reflect-metadata/**/*.+(js|js.map)',
      'rxjs/**/*.+(js|js.map)',
      '@angular/**/*.+(js|js.map)',
      'chart.js/Chart.min.js',
    ]
  });
};
{% endraw %}
</code>
</pre>

## Step 2: SystemJS Configuration
The second step is now to tell SystemJS how to load the Chart module if it is requested from the browser.
We add the following to `system-config.ts`:

<pre class="language-javascript">
<code>
{% raw %}
/** Map relative paths to URLs. */
const map: any = {
  'chartjs': 'vendor/chart.js/'
};

/** User packages configuration. */
const packages: any = {
  chartjs: { defaultExtension: 'js', main: 'Chart.min.js' }
};
{% endraw %}
</code>
</pre>

## Step 3: Module import
The third step is to import the module into our component. This is a important step because if the import 
is missing then when the CLI uses "tree shaking" to remove any dead unused code it will not realize 
that a component has a dependency on ChartJS. 

<pre class="language-javascript">
<code>
{% raw %}
import 'chartjs';
declare let Chart;
{% endraw %}
</code>
</pre>

In this example we declare a global Chart for TypeScript. If the library was written in TypeScript 
typings are already included in the installed node_modules folder. If this library had type definitions we could 
install the type definitions similar to what we could do if we were using [MomentJS](http://momentjs.com/).

<pre class="language-javascript">
<code>
{% raw %}
typings install moment moment-node --ambient --save
{% endraw %}
</code>
</pre>

So in three-ish steps we added a third party library to our Angular 2 CLI project. While the CLI is fantastic it 
is still a bit early on so there are still a few rough spots.