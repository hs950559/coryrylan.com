---
layout: post
title:  AngularJS Application Organization
description: A overview on how to organize your AngularJS applications.
keywords: Cory Rylan, Web, AngularJS, JavaScript, MVC
tags: angularjs, cleancode
date:   2014-10-06
permalink: /blog/angularjs-application-organization
---

There are many ways to organize a Angular project. I am going to cover the ways you can structure and name your project files
and the pros and cons to each. Lets first start simple. A brand new project usually starts with a `app.js` file.
This is usually where you have your app declaration, app dependencies and route definitions. When first starting out in a new Angular project this is
actually a very good idea. Just starting with one file will keep things simple while you learn.

<img src="/assets/images/posts/angularjs-application-organization/pic1.JPG" alt="Simple AngularJS example with one file." />

Lets take our application one step further. We have been adding more to our app and now have multiple Controllers,
Directives, Filters and Services. So the next organizational method we can choose is to break our single file into
multiple Angular module types. We can have one JavaScript file for each of our file types. Each for Controllers,
Services, Directives and Filters along with our `app.js` file. All of these can live in our application
folder. Now when we are looking for say a Directive we can go look into the `directives.js` file. This
is good for small applications and still keeps things relatively simple and easy to learn.

<img src="/assets/images/posts/angularjs-application-organization/pic2.JPG" alt="Simple AngularJS example with multiple file types." />

So looking back at organizing our modules by type what happens when we start getting multiple features? We don't want
to be working on a single feature and have to sift through multiple Controllers in the Controllers file when we really
are only focused on one thing. This leads into our next pattern, organizing by feature.

<img src="/assets/images/posts/angularjs-application-organization/pic3.JPG" alt="Simple AngularJS example with multiple features." />

By organizing our code by feature
we can focus on the specific task at hand without having to search through code that is not relative to the feature we are
working on. We can add all the modules related to that feature in a single JavaScript file that has a descriptive name.
This means we can easily browse our application and find where exactly the code is for that feature. This is great for
small to medium applications.

This last pattern for organizing our Angular project is for medium to large scale applications. If our features grow to
be large or complex in nature it is not wise to have a single large file for each feature. This will make it more difficult
to maintain that given feature. So taking the previous method one step further we will break our features up for our Angular
module types (Controllers, Directives, Services, Filters). Each Angular module gets its own file with a descriptive name inside
a folder that has a well thought name for that feature.

<img src="/assets/images/posts/angularjs-application-organization/pic4.JPG" alt="AngularJS example with multiple features organized by feature." />

This gives us the most flexibility to grow in our application. By each
feature organized by folder we can quickly drill down to the feature we are looking for. In each folder we have multiple files
each containing a single module. This makes the code maintainable and lowers the cognitive overload of large code files. This
is my preferred way to organize angular applications and offers the most room to grow your application.

Other pros and cons to the feature based module organization exist as well. A con to this style is it complicates our
build process. You would not want to include all these files individually in our application. This would cause heavy network
latency to download all them separately. Instead you will want a build step to concatenate and minify all your source files
and any dependencies together into a single file. This will keep your application fast and quick to download. You can use tools
such a <a href="http://gruntjs.com/" target="_blank">GruntJS</a> or <a href="http://gulpjs.com/" target="_blank">GulpJS</a> to automate this process. these tools are build />task runners your can run in NodeJS.

Another advantage to the feature based and individual module files is testing our JavaScript. By organizing our files in this
style we can organize our tests to match the exact same pattern. The tests can all exist in a separate folder
form the source code. Each module file has a single corresponding test file all the test are in a single folder named by that feature.

<img src="/assets/images/posts/angularjs-application-organization/pic5.JPG" alt="AngularJS example with multiple feature folders organized by feature." />

##IIFE and module closures
Closures can be very important when in comes to isolating modules and
bugs in any JavaScript application. As we follow the pattern of each Angular module receiving its own file I'll show you my preferred
method of structuring that module. Using the Immediately Invoked Function Expression Pattern (IIFE) we can close off our module from
leaking outside of its scope. Example:

<pre class="language-javascript">
<code>
// Module 1
(function() {
    'use strict';
    app.controller('HelloWorldCtrl', function() {
        
    });
}())
 
// Module 2
(function() {
    'use strict';
    
    app.factory('helloWorldService', function() {
        
    });
}())
</code>
</pre>

This pattern creates a anonymous function that is created and executed at runtime. This isolates our modules code. This can be important
from preventing name collisions when we concatenate our files together. If you notice we also have the statement `"use strict"`
in our IIFE. The `"use strict"` is a ES5 optional property that gives us some protection against some poor design patterns.
If a object or variable is used without a definition that normally would be created on the global object `"use strict"` with
cause a runtime exception protecting us from accidentally polluting the global scope.

##File Naming

The last thing I want to cover is file naming. There are some unofficial Angular naming conventions you can follow. You do not have to
follow these but just make sure your project is consistent in the naming and any team members understand this as well. First we can start
with naming Controllers. A common naming pattern for Controller names and the file name is the following:
`HelloWorldCtrl` and `helloWorldCtrl.js`. Controllers tend not follow the traditional camel case pattern you often
see because a Controller is treated somewhat as a constructor. You are "newing up" a instance of that Controller at runtime. File names
tend to follow camel case and the same name as the Controller. Next are services.

Services follow a similar naming convention. `helloWorldService` and `helloWorldService.js`. Services usually end in
the word Service. The file and module name follow the camel case pattern. Filters use camel case on the module name and file name. Filters
are not suffixed with filter like Services and Controllers. Example
`customCurrency` and `customCurrency.js`.

The last naming convention to cover is Directives. Directives when registered in the Angular application are camel case,
`phoneValidate`. This Directive when used in the HTML follows snake case, `&lt;input phone-validate /&gt;`
(Angular handles the conversion and expects this format). The filter source file follows the Snake Case format,
`phone-validate.js`.

So we have covered naming our angular modules and defining our file structure based on our application size. There are many ways
to set up a Angular JS application just remember stay consistent and try to follow the community conventions whenever possible.

###TL;DR

- all one file in app.js
- all in one folder, multiple files ordered by type
- all in one folder, multiple files ordered by feature
- multiple files and folders organized by feature and type
- follow some sort of naming convention early on
- each file should be singe module/feature in IIFE with strict mode