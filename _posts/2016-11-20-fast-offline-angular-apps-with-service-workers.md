---
layout: post
title: Fast Offline Angular Apps with Service Workers
description: Learn how to build a offline Angular app with service workers & sw-precache.
keywords: Cory Rylan, Angular 2, Angular, Service Workers, Offline, Progressive Web App
tags: angular pwa
date: 2016-11-20
updated: 2016-12-19
permalink: /blog/fast-offline-angular-apps-with-service-workers
demo: https://ng-pokedex.firebaseapp.com/
---

{% include ng-version.html %}

With the release of the latest Angular 2.x+ and the recent rise of "Progressive Web Apps" there is a lot to be 
excited about when it comes to building on the web today. In this post we will cover how to make
a simple Hello World Angular app and leverage Service Workers to make our app lightning fast and offline capable.
Then we will look at a small more useful app and how Service Workers improved it's performance. 

## Service Workers
So first what is a Service Worker? Well you can kind of think about it as a standalone JavaScript program that you
can run in your browser. This Service Worker can handle background/network tasks for your website/app. 
Why would this be useful? Well with Service Workers we can have fine grain control of our outgoing and 
incoming network requests as well as our browser cache.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/service-worker.svg" alt="Service Worker" bp-layout="full-width 7--max float-center" />

We can think of our Service Worker as a middle man between our app and the network. With this control we can 
programmatically control how our app should respond in certain network situations. What should we do if the 
app is offline? Use cache? If we do have a connection we can tell the app to always use cache on certain static assets.
We can even create scenarios such as using the network first and if that fails fall back to cache. We get a lot of flexibility in controlling
our apps behavior with the network. Service Workers allow us to explicitly tell the browser 
what to do in situations of low to no connectivity instead of seeing this:

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/offline.png" alt="Offline Dino" bp-layout="full-width 3--max float-center" />

I won't go into all the specifics of the Service Worker API and all the offline patterns but I highly recommend reading Jake Archibald's
fantastic [Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/). We will cover more of the ideas of the Service Worker
as we go along.

So with Single Page Apps, specifically Angular apps, we can change the way we think
about how our app is structured. A common pattern many SPA's follow is the app shell pattern. It's likely 
you have been using this pattern and not know it's name. It simply is that we have a outer "shell" for
the app including the header, footer and navigation. We load the content dynamically typically through calling
an API of some kind. 

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/app-shell.png" alt="Offline Dino" bp-layout="full-width 3--max float-center" />

Most of this part of our app is unchanging. The content in the middle is dynamic and is swapped around
via templates or API requests. So ideally we would like to tell the browser to hold onto that unchanging content
of our app to prevent extra requests and to speed up rendering. This is where Service Workers come in. Using 
Service Workers we can explicitly tell the browser: 
"Hey these assets (JavaScript, CSS & HTML), you should hold onto them and use them until I tell you otherwise".
This allows the browser to use our application shell by default. Instead of requesting the resources from the network,
we use the cache every time even when there is no network connection.
This in turn speeds up our app startup and allows our app to work better offline.

So now that we have a rough idea of what we are wanting to accomplish, let's create a simple Angular app to get started.

## Angular CLI

To create, scaffold, and build my Angular app I'm going to use the [Angular CLI](https://cli.angular.io).
The Angular CLI (Command Line Interface) is a great tool that allows us to quickly create and build Angular apps
without having to get deep into tooling and build processes. 

So first you will want to have the CLI installed via NPM/NodeJS. To install run the following `npm install -g angular-cli@latest`.
Once installed you can run `ng new my-app`. This will create a new Angular project and install all the related tooling
needed to get up and running. 

Once everything is installed (it may take a little bit) you can cd into your 
root folder that the CLI created and run `ng serve`. This will spin up a local development server and watch our source
code files for changes to compile. Once running, browse to `localhost:4200` and you should see something like this in your browser:

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/app-start.png" alt="App Start" bp-layout="full-width 4--max float-center" style="border: 1px solid #ccc;" />

So now we have a working Angular app. I won't get too deep into the details of the CLI, but it does create a lot of files for
us to use and test our project with. Next we are going to add a simple Service Worker to our app. First in your 
app directory we are going to add the following code to our `index.html`:

<pre class="language-html">
<code>
{% raw %}
&lt;script&gt;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered');
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }
&lt;/script&gt;
{% endraw %}
</code>
</pre>

This code is at the bottom of our `index.html` file right before the closing body tag. Service Workers
and offline capabilities are a progressive enhancement to our app. We need to check if the browser supports
Service Workers and if so we will install the `service-worker.js` file. In our CLI project add a `service-worker.js` in the 
source directory. Then in your `angular-cli.json` add the following to the assets entry:

<pre class="language-javascript">
<code>
{% raw %}
"assets": [
  "assets",
  "favicon.ico",
  "service-worker.js"
],
{% endraw %}
</code>
</pre>

This tells the CLI to copy over the `service-worker.js` file over to the root dist of the project when it builds.
Now if we restart our `ng serve` command we should see the same "app works!" message. Let's look in the Chrome Dev tools.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/registered-service-worker.png" alt="Registered Service Worker" bp-layout="full-width 6--max float-center" />

If we look at the application tab in the Chrome dev tools we can see our Service Worker was successfully installed. Once
installed the browser will always use this copy of the Service Worker. The browser will check on the server for 
any updates to the Service Worker. If there is even one byte difference to the one on the server the browser will reinstall
the latest version for us.

So now that we have successfully created a Service Worker, what does it do for us? Well right now not too much. 
In our Service Worker we could write out all the logic for caching our static assets but that actually is 
quite complex and has a lot of edge cases to handle. The Service Worker is some what of a low level API and does
not prescribe how your app should behave offline. Engineers at Google have created a couple of small libraries on 
top of Service Workers to create some useful offline patterns.

## SW Precache

The [SW Precache](https://github.com/GoogleChrome/sw-precache) library is maintained by Google and provides 
some great patterns for how to handle certain offline situations with web applications. This tool in particular
helps us precache static assets for our app. SW Precache is a build time tool that looks at our generated static 
(JS, CSS and HTML) and generates a Service Worker file for us. This generated Service Worker contains a hash specifically
for each file in that build for the browser to cache and use even when offline. 
In subsequent builds the hash changes which causes the browser to request the updated files.

So for our Angular CLI project we need to build our project to generate our static files to host and have the SW Precache 
analyze. In our CLI project we will run the following: `ng build --prod`. This will cause the CLI
to build a production bundle of our app. After it runs we should see something similar to this:

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/prod-build.png" alt="Production output" bp-layout="full-width 6--max float-center" />

This dist folder contains all the generated compiled code we need to deploy and serve our Angular app. 
We build the project so the files are written to disk so the SW Precache library can analyze our apps assets.
We do this in part that the CLI in dev mode serves everything in memory which the SW Precache cannot run in.
If you are using Webpack there is a SW Precache Webpack plugin available. Eventually the Angular CLI will 
 support the ability to use plugins like this in development mode. 

 So now that we have our build we need to install SW Precache by running `npm install --save-dev sw-precache`.
 Once installed we are going to create a couple of npm scripts in our project. In our `package.json` we are
 going to add the following command:

<pre class="language-javascript">
<code>
{% raw %}
  "scripts": {
    "start": "ng serve",
    "lint": "tslint \"src/**/*.ts\"",
    "test": "ng test",
    "pree2e": "webdriver-manager update",
    "e2e": "protractor",
    "sw": "sw-precache --root=dist --config=sw-precache-config.js"
  }
{% endraw %}
</code>
</pre>

The command we added tells `sw-precache` to generate the Service Worker in our dist folder and to use the 
`sw-precache-config.js` for configuration information. Now create the `sw-precache-config.js`
in the root of our project and add the following:

<pre class="language-javascript">
<code>
{% raw %}
module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css'
  ]
};
{% endraw %}
</code>
</pre>

This configuration file tells the `sw-precache` CLI how to generate our Service Worker. The first line
`navigateFallback: '/index.html',` tells the browser if the user requests a url that cannot be found to fall back to the 
cached `index.html` file and let the client side routing handle the page. This is a similar pattern most Angular devs
are familiar with when using client side routing. Next `stripPrefix: 'dist'` tells `sw-precache` that the dist
folder is the root of our web app and should not add `dist` to file paths. Next `root: 'dist/'` tells `sw-precache`
that `dist` is where the Service Worker should be created. The last part `staticFileGlobs` tells `sw-precache` which
static files we would like the browser to cache and use. 

Now lets run our npm command `npm run sw`. We should get the following output:

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/sw-precache-output.png" alt="sw precache output" bp-layout="full-width 6--max float-center" />

If we look in our generated Service Worker in our dist directory we should see some generated code. If we look through 
it we can get a idea of how the code is handling all the cache logic for our application.

The next step is the tricky part. Since the CLI does not allow us to add Webpack plugins yet for dev time serving of our 
application, we need to host our static files in the dist folder. To do this, run `npm install -g live-server`.
We will use a small light weight server called `live-server` to host our static generated code. Once installed we
will add a new command to our NPM scripts:

<pre class="language-javascript">
<code>
{% raw %}
  "scripts": {
    "start": "ng serve",
    "lint": "tslint \"src/**/*.ts\"",
    "test": "ng test",
    "pree2e": "webdriver-manager update",
    "e2e": "protractor",
    "sw": "sw-precache --root=dist --config=sw-precache-config.js",
    "static-serve": "cd dist && live-server --port=4200 --host=localhost --entry-file=/index.html"
  }
{% endraw %}
</code>
</pre>

This command `static-serve` will start up a small host for our static files in the dist folder.
Now run `npm run static-serve`. Browse to `localhost:4200` and we should see the "App Works!" message like before.
If we go back to the application tab we can see our Service Worker is now installed and running. 
Let's go to the network tab and click the offline check mark and reload the page.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/offline-angular-app.png" alt="Offline Angular App" bp-layout="full-width 9--max float-center" />
 
We can see our app still works! Congrats you have created your first offline capable Angular application!
We can see in the network response times they are very fast since we immediately serve the content from memory 
instead of trying to go to the network. This makes our Angular app more resilient to bad network connections.
So next let's look at a slightly larger app that has some Angular performance knobs turned on.

## Service Workers, AOT Compilation, Change Detection and Pokémon

Now that we have some basics down of how to make our app offline capable, let's look at a demo application I created.
For this post I created [NG-Pokédex](https://ng-pokedex.firebaseapp.com). This is a small app that lists Pokémon and
details about each kind. This app has basic routing, components and works completely offline using the same techniques we
learned above. This app has a couple of special features turned on to make this app really fast.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/ng-pokedex.png" alt="NG-Pokédex" bp-layout="full-width 3--max float-center" />

First, the app uses the Angular ahead of time compilation (AOT). AOT allows us to take the template compilation feature 
of Angular and makes it a build step. This allows our bundle to be smaller. Also because the templates are pre-compiled
to JavaScript at build time the start up time of our app is very, very fast. To enable this in the CLI, we run the 
following command `ng build --aot --prod`. This gives us some great performance improvements. By 
using the `--prod` flag the CLI will "tree shake" or remove unused code in our app as well as
bundle and minify our code.

Second, we turn off Angular's change detection. Since we are using Observables to determine data changes
we can tell Angular that there is no need to run the expensive change detection in our application.
We do this by adding `changeDetection: ChangeDetectionStrategy.OnPush` to our top level component.
You can read more about OnPush in the Angular documentation.

Third, if our app grew in size we could enable Angular's built in lazy loading and code splitting feature.
This is already supported in the Angular CLI. Check out the [docs](https://angular.io/docs/ts/latest/guide/ngmodule.html#!#lazy-load) to read more about how it works. A small
side note, we also get some first time load benefits from our app being hosted on [Firebase](https://firebase.google.com).
Firebase hosting is a lightning fast CDN that leverages HTTP2.

## Results

So with these performance features built into Angular and Service Workers, what does this mean for our Pokedéx application? Let's
take a look at the Chrome Dev tools.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/ng-pokedex-test-1.png" alt="NG-Pokédex test results" bp-layout="full-width 8--max float-center" style="border: 1px solid #ccc;" />

With the first test, we can see after the Service Worker is installed subsequent reloads are very fast to render. 
This test is on a Macbook Pro, clearly it's going to be fast. But let's set the network to offline and in the 
timeline tab set the CPU throttle down to 5x slower to emulated low end mobile devices.

<img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/ng-pokedex-test-2.png" alt="NG-Pokédex test results high performance" bp-layout="full-width 8--max float-center" style="border: 1px solid #ccc;" />
 
As we can see here in an offline situation on an emulated low end device, we can get a render 
page in less than 3 seconds. We get time to interactive in just over 3 seconds. This is quite impressive for an app built 
on a framework. One thing to point out that to keep this speed it's important we keep the main 
bundle small. We can achieve this using Angular's code splitting and lazy load feature as our app scales up.

To test this even further we are going to use [https://www.webpagetest.org](https://www.webpagetest.org) to 
test on real devices. On a Nexus 5 with 3G we can get first time render to interactive in about 5.5 seconds.
Using Angular Server Side rendering we could get this even faster on
first time renders. Subsequent views render in just a second or two thanks to our Service Worker.

<a href="https://www.webpagetest.org/result/161121_0G_5JD/">
  <img src="/assets/images/posts/2016-11-20-fast-offline-angular-apps-with-service-workers/web-page-test.png" alt="NG-Pokédex test results web page test" bp-layout="full-width 8--max float-center" style="border: 1px solid #ccc;" />
</a>

## Conclusion
One piece missing from this demo that I would like to add sometime down the road is the 
[Angular Universal](https://universal.angular.io) server rendering to improve first time render and SEO quality.

We can see with Service Workers and Angular we can create fast offline progressive web app experiences.
What is great about these results is that the Angular Framework is still evolving and improving it's performance.
We can likely see these performance metrics improving even more. We were also able to get fantastic performance 
features with the Angular CLI with little configuration work minus our SW Precache.

Please feel free to check out the demo app on [Github](https://github.com/splintercode/ng-pokedex). 
The live demo is located here [NG-Pokédex](https://ng-pokedex.firebaseapp.com/).

Below are some great resources for learning more about Service Workers and Progressive Web Apps:

- [The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)
- [Progressive Performance (Chrome Dev Summit 2016)](https://www.youtube.com/watch?v=4bZvq3nodf4&list=PLNYkxOF6rcIBTs2KPy1E6tIYaWoFcG3uj&index=17)
- [Planning for Performance: PRPL (Chrome Dev Summit 2016)](https://www.youtube.com/watch?v=RWLzUnESylc&t=204s&list=PLNYkxOF6rcIBTs2KPy1E6tIYaWoFcG3uj&index=25)
- [Production PWAs with frameworks (Chrome Dev Summit 2016)](https://www.youtube.com/watch?v=e8XejNt5SZo&list=PLNYkxOF6rcIBTs2KPy1E6tIYaWoFcG3uj&index=32)
- [SW Precache](https://github.com/GoogleChrome/sw-precache)
- [Universal Angular](https://universal.angular.io)
- [Angular CLI](https://cli.angular.io)