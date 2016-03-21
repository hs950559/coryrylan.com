---
layout: post
title: Angular 2 Development with Visual Studio and Windows
description: A top down intro to developing Angular 2 applications with Visual Studio and Windows. This will cover from downloading Visual Studio to setting up a task runner.
keywords: Cory Rylan, Angular2, CSS
tags: CSS, angular2
date: 2016-03-20
permalink: /blog/angular-2-development-with-visual-studio-and-windows
demo: 
---

Angular 2 is quickly gaining popularity in the Microsoft and .NET world. With the cooperation of the Angular Team from Google and the TypeScript team from Microsoft
a lot of developers have given both sides a second look at the new technology stacks. 

With the proliferation of so many new tools around the JavaScript community 
it can be overwhelming coming from a monolithic solution stack such as .NET and Visual Studio. Microsoft has been hard at work creating support for the new advanced tooling 
in Visual Studio making it a very powerful IDE for front end web development. 

So in this blog post we are going to cover a few key steps in getting up and running with Angular 2 and Visual Studio.

1. The Visual Studio version that's right for you
1. NodeJS integration with Visual Studio and Windows
1. Task Runner integration such as <a href="http://gulpjs.com/" target="_blank">Gulp</a>, <a href="http://gruntjs.com/" target="_blank">Grunt</a> and NPM scripts
1. TypeScript compilation and intellisense support
1. Project organization with <a href="https://dotnet.github.io/" target="_blank">.NET Core</a> and traditional folder based structures


## Visual Studio

Visual Studio has had a long history of versions and editions. For modern web development it is highly recommended to use the 2015 edition. 
Within the 2015 edition there are varying levels of cost based on Enterprise features and team size. The most popular edition is Visual Studio
Community. This version is a full fledge IDE that is free to use for Education purposes and small development teams. For this post this is the 
version we will use but the rest of the post could be applied for the paid editions as well. 

So our first step would be to download Visual Studio Community here. Before installing **STOP** and read this next section. Visual Studio has many 
different features and support for a variety of platforms. When installing there are two things we will want to check first during the install.
First we need to check the Visual C++ option. This will help us later when using NodeJS on windows. We will come back to why this is important.
Second we will select the Microsoft Web Developer tools. Both of these will give us the basics needed in Visual Studio for Angular 2 development.

Installing Visual Studio should not mess with any previously installed NodeJS instances.

<img src="/assets/images/posts/2016-03-21-angular-2-development-with-visual-studio-and-windows/visual-studio-nodejs.png" alt="Visual Studio install with NodeJS" class="full-width col-6--max float-center display-block" />

Ok now you can go download the latest Visual Studio here. Make sure to also have Update 1 installed before continuing.

<a href="https://www.visualstudio.com/products/visual-studio-community-vs" target="_blank" class="btn float-center display-block col-4--max">Visual Studio Community Download</a>


## NodeJS and Windows

Modern web development and <a href="https://nodejs.org/en/" target="_blank">NodeJS</a> go hand in hand. Almost all modern web development tooling is built on top of NodeJS. 
If you are not familiar with NodeJS it is a JavaScript runtime that we can use to create JavaScript development tools and servers. 

Visual Studio comes with a pre-installed version of Node. This is for convenience but is likely to get in your way. We will want the latest version of 
on our machine. This fine grain control is important because this allows our projects to rely on a set version of Node we can control that is not
tied to Visual Studio. This is really important on large teams with build servers and multiple development environments. 

There are two major versions of NodeJS. If you work on a large enterprise team where upgrading is a slow process then choose 4.x If you are a small to medium team 
that has control over upgrading dependencies easily go with the latest 5.x branch.

<a href="https://nodejs.org/en/" target="_blank" class="btn float-center display-block col-3--max">NodeJS Download</a>

Ok now that we have Node installed we need to adjust Visual Studio to use the local Node version that we just installed to our machine. 
In the top right corner type in the quick launch "External Web Tools". You should get a dialog like this.

<img src="/assets/images/posts/2016-03-21-angular-2-development-with-visual-studio-and-windows/visual-studio-set-nodejs-version.png" alt="Visual Studio NodeJS version" class="full-width col-8--max float-center display-block" />

Make sure the top two entries are like the entries depicted above. This will force Visual Studio to point to the NodeJS we installed on to our machine. Now when we update Node
on our machine Visual Studio will use that version and not the one tied to the Visual Studio version.


## NodeJS and Windows Gotchas

Now if you remember earlier we installed a C++ option with our Visual Studio version. These are for certain NodeJS packages that rely on native C++ compilers.
Until recently on Windows the only way to get those C++ compilers was to install Visual Studio. Now there is a separate
 <a href="https://www.microsoft.com/en-us/download/details.aspx?id=49983" target="_blank">C++ compiler</a> that is in technical preview. You can find our more
 information and debugging tips on <a href="https://github.com/nodejs/node-gyp/issues/629" target="_blank">GitHub</a>.
 
 Another gotcha is running older versions of Node and NPM. Older versions of Node and NPM (Node package manager) organized package dependencies in a deeply nested tree
 like structure. On Windows this causes issues since there is a limit of how many nested folders you can have. This causes issues with moving and deleting our installed
 Node modules. The new versions of NPM now use a flat folder structure to get around Windows shortcomings. So just make sure you run updated version of Node(v4 or v5) and NPM (v3). 
 You can read more about this issue <a href="https://github.com/nodejs/node-v0.x-archive/issues/6960" target="">here</a>.
 
 
## Task Runners 

Task runners such as Gulp, Grunt, and NPM scripts allow us to define a set of commands that we can run to manage our projects tasks. These tasks can range from compiling Sass or Less to 
CSS or compiling our TypeScript to JavaScript. These tools all have their own pros and cons but I won't get into what task runner you should use. That is something to research
and determine what is best for your project and team. I will cover how these command line based tools easily integrate into Visual Studio.
