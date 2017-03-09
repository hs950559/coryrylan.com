---
layout: post
title: Analyzing bundle size with the Angular CLI and Webpack
description: Learn how to use special Webpack tools to analyze our Angular project bundles and dependencies.
keywords: Cory Rylan, Angular 2, Angular, Webpack, Performance
tags: angular AngularCLI
date: 2017-03-01
permalink: /blog/analyzing-bundle-size-with-the-angular-cli-and-webpack
demo: https://github.com/coryrylan/ng-pokedex
---

{% include ng-version.html %}

Having a high preforming web app is always a top priority. With 
Angular there is no exception. But with our web apps becoming ever so increasingly 
complex how can we know what really gets bundled into our apps? How do we track the size
of the bundles? We want to make sure we don't send to much JavaScript all at once and 
slow down our apps.

Large JavaScript bundles are a surefire way to lose user engagement. Not only are they slower to download
but also slower to evaluate and execute by the browser. For our apps to stay fast we need
to make sure they stay small (250kb or less is a good goal) and loaded at the appropriate times.

In this post we will use the <a href="https://cli.angular.io/">Angular CLI</a> 
and a few simple commands to get a detailed report about our Angular application bundles
we ship to production with.

## Angular CLI

First we need an app to inspect. For this demo we will use the <a href="https://ng-pokedex.firebaseapp.com/pokemon">NG-Pokedex</a>.
app. This is a small progressive web app built with the Angular CLI. We need to build our application
for production. To do this we can use the CLI and run `ng build --prod --stats-json`. This command
will build and bundle/compress our application to be ready to deliver to a production server.
We should see a output similar to the image below.

<img src="/assets/images/posts/2017-03-01-analyzing-bundle-size-with-the-angular-cli-and-webpack/angular-cli-production-bundle.png" alt="Angular Production Bundles" bp-layout="full-width 8--max float-center" class="img-border" />

With these bundled and packaged files we can deploy/host our Angular app on any server with
relative ease. The `--prod` flag told the CLI to build our app for production but what did 
the `--stats-json` flag do? The CLI will generate a `stats.json` file in the dist with our bundles.
This stats file has all kinds of useful data about our application bundles. If you look
at the file its quite a bit of data so we really need a tool to help digest and understand 
this data.

## Webpack
The `stats.json` file specifically is a feature of <a href="https://webpack.js.org/">Webpack</a>. Webpack is the JavaScript
package/bundling tool the CLI uses under the hood. With this special file Webpack generated for 
us we can use a few different tools to understand our app. 

The tool we will use is the <a href="https://github.com/th0r/webpack-bundle-analyzer">Webpack bundle analyzer</a>. This is a npm package
you can use in a Webpack config or just as a command line tool. For our use case we will 
simply use the command line tool. 

To use this tool use the following steps:

1. Install via npm to your CLI project: `npm install --save-dev webpack-bundle-analyzer`
2. Once installed add the following entry to the npm scripts in the `package.json`:
`"bundle-report": "webpack-bundle-analyzer dist/stats.json"`
3. Once added run the following command: `npm run bundle-report`

If followed correctly the Webpack bundle analyzer will open a report in your browser window 
that will look something like this:

<img src="/assets/images/posts/2017-03-01-analyzing-bundle-size-with-the-angular-cli-and-webpack/angular-cli-webpack-bundle-analyzer.png" alt="Angular Production Bundles" bp-layout="full-width 8--max float-center" class="img-border" />

What does this chart tell us? Each color represents a individual bundle. In our 
application we have three bundles. The vendor that containing all the library code, the
polyfill bundle and the main application code bundle. We can further inspect each bundle
and see the uncompressed and compressed sizes. This allows us to easily determine what parts 
of our code are the largest and we can further determine if we need to break our app up 
further using <a href="https://angular.io/docs/ts/latest/guide/ngmodule.html#!#lazy-load">Lazy Loading</a>.

For the NG-Pokédex we can see the majority of the application is framework code. Since the 
app is small it has only a few components bundled in the main code bundle. Using this tool 
I was able identify that the Http Module from Angular was being bundled into the 
NG-Pokédex app even though it wasn't being used. I removed the unused imports and now the 
app is smaller and faster than before.

As our apps grow we can simply run `npm run bundle-report` to closely monitor our dependencies and 
how they affect the bundle sizes keeping our apps lightweight and fast!

Feel free to check out the NG-Pokédex app at the link below!
