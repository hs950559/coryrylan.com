---
layout: post
title: Angular Local Development Setup
description: A quick overview of my personal local development setup when building Angular applications
keywords: Cory Rylan, Angular 2, Angular, Development, Editor
tags: angular visual-studio
date: 2016-11-03
updated: 2016-12-19
permalink: /blog/angular-local-development-setup
---

{% include ng-version.html %}

Angular has moved from a framework to now a platform to develop rich UIs across mobile
and desktop. There are many ways to set up a development environment and build process for 
Angular apps. In this short post I'll go over my personal setup that I use on both my Linux/MacOS and Windows
machines.

## Build / Project 

First I'll start with how I build and deploy my Angular applications. All of my projects
currently use the <a href="https://cli.angular.io">Angular CLI</a>. The Angular Command Line Interface
allows developers to quickly create, scaffold and build Angular applications. The CLI is still 
in beta but is quickly gaining traction and a lot of support/improvements from the Angular team.

<img src="/assets/images/posts/2016-11-03-angular-local-development-setup/angular-cli.svg" bp-layout="full-width 4--max float-center" alt="Angular CLI" />

## Editor

There are many great editors for Angular Applications but a couple in particular stand out. 
First is <a href="https://www.jetbrains.com/webstorm/">Webstorm</a>. Webstorm is a full fledged
IDE for JavaScript development and has all the bells and whistles. Webstorm does have a paid licence 
but is well worth it. 

<img src="/assets/images/posts/2016-11-03-angular-local-development-setup/visual-studio-code.png" bp-layout="full-width 3--max float-center" alt="Angular CLI" />

Next is my favorite editor that I use all the time, 
<a href="https://code.visualstudio.com/">Visual Studio Code</a>. Visual Studio Code is a free cross platform editor 
with great TypeScript support which is critical for a good Angular development experience. Visual Studio Code is very fast and
light weight. It has a great plugin system as well. Here is a screenshot of some of the plugins I use that give a really 
good editor experience for Angular apps.

<img src="/assets/images/posts/2016-11-03-angular-local-development-setup/visual-studio-code-plugins-angular.png" bp-layout="full-width 4--max float-center" alt="Angular CLI" />

## Deployment

Angular is not very opinionated on how its deployed and what backend stack its hosted on.
I deploy Angular apps a couple different ways. Some on .NET stacks and others on NodeJS. 
My favorite is <a href="https://firebase.google.io">Firebase</a>. Firebase has a hosting feature 
that is great for single page apps and has HTTP2 support for great performance. Learn more
about <a href="/blog/deploy-angular-cli-apps-to-firebase">Deploying Angular apps to Firebase</a> here.

One last note I am looking forward to a update in the works to the Angular CLI that 
adds <a href="https://universal.angular.io">Universal Angular</a> support. Universal allows
Angular apps to run on the server so we can get great SEO support and fast first time renders.

## Summary

In summary there are hundreds of tools that are available that work great with Angular projects. These are
just the subset that I use. If you have your own set up you enjoy please feel free to share in the comments.
