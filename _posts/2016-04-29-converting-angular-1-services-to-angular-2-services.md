---
layout: post
title: Converting Angular 1 Services to Angular 2 Services
description: Learn how to convert Angular 1 service factories the most common Angular 1 service pattern to Angular 2 services.
keywords: Cory Rylan, Angular2, AngularJS, TypeScript
tags: angular2, angularjs, typescript
date: 2016-04-29
permalink: /blog/converting-angular-1-services-to-angular-2-services
demo:
---

With Angular 1 the Factory Service was one of the most popular ways to organize logic in your Angular 1 app. 
With Angular 2 we migrate to using ES6/ES2015 classes over the factory/module pattern. In this post
we will look at a simple Angular 1 factory service and convert it to an Angular 2 service using ES2015 and TypeScript.
We will also dig into how you can write your Angular 1 services in a way that will make your code easier to migrate to 
Angular 2 in the future. 

## Factories

Factories are one of the most popular choices when it comes to structuring your Angular 1 services. We will convert our 
factory to use a Angular 1 `.service` which maps better to Angular 2. The Angular 1 `.service` service takes a constructor 
function instead of an object like the `.factory`. Angular 1 will call the `new` keyword on our constructor
function which will create a new instance of our service. Using ES2016 classes we will have a nice syntax to create our 
constructor function. So lets take a look at a simple data service that has some data shared between components and a couple
of methods.

<pre class="language-javascript">
<code>
{% raw %}
(function() {
    'use strict';

    angular.module('app').factory('dataService', dataService);

    function dataService() {
        var service = {
            data: data
            loadData: loadData
        };
        
        var data = {
            items: []
        };

        return service;

        function loadData() {
            // Commonly where Http calls are made
            data.items = ['one', 'two', 'three'];
        }
    }
}());
{% endraw %}
</code>
</pre>

So here we have an Angular 1.x factory. We can share data between components and controllers via our public data property. 
We also have a simple load function to load data. Now this is an overly simple service but want to focus on how 
this is converted to Angular 2.

## Angular 1.x Services

So now that we have our Angular 1.x Factory lets convert this to a Service and use an ES6/ES2015 JavaScript Class. 

<pre class="language-javascript">
<code>
{% raw %}
(function() {
    'use strict';

    class DataService {
        constructor() {
            this.data = {
            items: []
            };
        }

        loadData() {
            this.data.items = ['one', 'two', 'three'];
        }
    }

    angular.module('app').service('DataService', DataService);
}());
{% endraw %}
</code>
</pre>

Now in this example you can see it's quite a bit different but functionally would work the same in your Angular 1 app. 
Notice instead of using `.factory` we call `.service` on our Angular module. This is slightly different because Angular 
will call the `new` keyword on our service and keep a single instance to use in the lifetime of our app. We could introduce 
ES6/ES2015 modules here but for simplicity sake we will see how those are used in Angular 2 first.

## Angular 2.x Services

So now that we see the difference between `.service` and `.factory` in Angular 1 lets take a look at how Angular 2 services
work. Angular 2 is written in TypeScript and looks to be the dominant language used for Angular 2 apps. There are a lot
of great benefits to TypeScript. TypeScript adds static typing to our ES6/ES2015 code. This is really great for large apps or 
teams.

So lets take a look at our Angular 2 version of this same service.

<pre class="language-javascript">
<code>
{% raw %}
export class DataService {
	data: { items: string[] };
	
    constructor() {
        this.data = {
            items: []
        };
    }

    loadData() {
        this.data.items = ['one', 'two', 'three'];
    }
}

// data.service.ts file
{% endraw %}
</code>
</pre>

Looking at this code we see there are no references to Angular at all. This is because we are using ES2015 modules 
to export this class to be consumed by another. Notice the `export` keyword in front of our class. We will import
this class in another file to [register](https://angular.io/docs/ts/latest/api/platform/browser/bootstrap-function.html) 
it to Angular 2. The syntax would look something like this: `import {DataService} from 'data.service';` The rest of our code looks very similar to our Angular 1 Service. 

Notice the second line: `data: { items: any[] };`; This line is TypeScript specific code. This is a type annotation 
for the TypeScript compiler. This tells TypeScript this property here will be an object with a items 
property that has an array of strings. This allows the IDE to have a better understanding of how the code works. We get better auto completion
and the compiler can tell us if someone accidentally assigns the wrong data type to our list. 

The great part about Angular 2 services is that they are simple classes. No strange Angularisims to have to learn. 
I kept this post extremely simple to just focus on the constructs that are changing between Angular 1 and Angular2.
To learn more about TypeScript take a look at Brice Wilson's great [TypeScript In-depth](https://www.pluralsight.com/courses/typescript-in-depth) 
course on PluralSight. To get a quick start to Angular 2 check out John Pappa's fantastic intro course [Angular 2: First Look](https://www.pluralsight.com/courses/angular-2-first-look)
and the [angular.io quick start](https://angular.io/docs/ts/latest/quickstart.html).
