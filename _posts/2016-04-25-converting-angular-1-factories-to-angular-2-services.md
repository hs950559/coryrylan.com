---
layout: post
title: Converting Angular 1 Factories to Angular 2 services
description: Learn how to convert Angular 1 factories the most common Angular 1 service pattern to Angular 2 services
keywords: Cory Rylan, Angular2, AngularJS, Services, TypeScript
tags: angular2, angularjs, typescript
date: 2016-04-25
permalink: /blog/converting-angular-1-factories-to-angular-2-services
demo:
---

With Angular 1 the Factory Service was one of the most popular ways to organize logic in your Angular 1 app. 
With Angular 2 we migrate to using ES6/ES2015 classes over the facotry/module pattern. In this post
we will look at a simple Angular 1 fatory service and convert it to a Angular 2 service using ES2015 and TypeScript.
We will also dig into how you can write your Angular 1 services in a way that will make your code easier to migrate to 
Angular 2 in the future. 

## Factories

Factories are one of the most popular choices when it comes to structuring your Angular 1 services. We will convert our 
factory to use a Angular 1 `.service` which maps better to Angular 2. The Angular 1 `.service` service takes a constructor 
function instead of a object like the `.factory`. Angular 1 will call the `new` keyword on our constructor
function which will create a new instance of our service. Using ES2016 classes we will have a nice syntax to create our 
constructor function.