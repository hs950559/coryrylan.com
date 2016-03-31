---
layout: post
title:  AngularJS Controller As Syntax
description: A brief overview on the benefits of the Controller As Syntax in AngularJS
keywords: Cory Rylan, Web, AngularJS, JavaScript, MVC
tags: angularjs, cleancode
date: 2014-09-12
permalink: /blog/angularjs-controller-as-syntax
---

Angular JS has some great MVC, MVVM or MVW (Model View Whatever) patterns. In Angular there are a few different
ways to declare and use a controller. Lets look at the most common way using the `$scope` object.

<pre class="language-markup">
<code>
{% raw %}
&lt;section ng-app=&quot;app&quot;&gt;
  &lt;div ng-controller=&quot;ScopeExampleCtrl&quot;&gt;
    {{message}}
  &lt;/div&gt;
&lt;/section&gt;
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
         
app.controller('ScopeExampleCtrl', function($scope){
  $scope.message = 'This is a model value from the $scope syntax.';
});
</code>
</pre>

So this works great no issues but lets look at the `Controller As` syntax that was introduced in Angular 1.2
    
<pre class="language-markup">
<code>
{% raw %}
&lt;section ng-app=&quot;app&quot;&gt;
  &lt;div ng-controller=&quot;ControllerAsExampleCtrl as example&quot;&gt;
    {{example.message}}
  &lt;/div&gt;
&lt;/section&gt;
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
            
app.controller('ControllerAsExampleCtrl', function(){
    this.message = 'Value from the "Controller As" syntax.';
});
</code>
</pre>

This syntax does a few things for us. The first benefit is we don't need to bring in $scope as a dependency. This cleans up our controller a bit.
We can directly add any properties we want on our view by using <code>this</code> on the controller. You can still bring <code>$scope</code> in as a dependency
if you need to use other things such as `$watch` or `$on`.
This allows you to easily be able to see controllers that may have special exceptions than your average controller.

## Nesting Controllers

In the view the `ControllerAsExampleCtrl as example` the `example` creates a instance of
the `ControllerAsExampleCtrl` for that controller's view. So lets look at why this is important.

In the next example we have a simple controller that assigns a string to the scope
value of message. We inject the $scope object as a dependency of the controller. So what happens if we nest two controllers
that happen to have the same property of message?

<pre class="language-markup">
<code>
{% raw %}
&lt;section ng-app=&quot;app&quot;&gt;
  &lt;div ng-controller=&quot;ScopeExampleCtrl1&quot;&gt;
    {{message}}
    &lt;div ng-controller=&quot;ScopeExampleCtrl2&quot;&gt;
        {{message}}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
     
app.controller('ScopeExampleCtrl1', function($scope){
  $scope.message = '$scope value from Controller 1';
});
     
app.controller('ScopeExampleCtrl2', function($scope){
  $scope.message = '$scope value from Controller 2';
});
</code>
</pre>

If you look at the HTML it can quickly become confusing to understand which property belongs to which controller.
This is even worse when we have base controllers or large sections of HTML that divide up the controller declarations.
Take a look at the same controllers but using `Controller As` to bind their values.

<pre class="language-markup">
<code>
{% raw %}
&lt;section ng-app=&quot;app&quot;&gt;
  &lt;div ng-controller=&quot;ControllerAsVmExampleCtrl1 as example1&quot;&gt;
    {{example1.message}}
    &lt;div ng-controller=&quot;ControllerAsVmExampleCtrl2 as example2&quot;&gt;
        {{example2.message}}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
     
app.controller('ControllerAsVmExampleCtrl1', function(){
  this.message = 'Controller As value from Controller 1';
});
     
app.controller('ControllerAsVmExampleCtrl2', function(){
  this.message = 'Controller As value from Controller 2';
});
</code>
</pre>

If we use the `Controller As` syntax we can avoid this issue. It simplifies the code and makes it clear
which property belongs to each controller. This also helps us from not having to use the `$parent` property.
When you declare with `Controller As` we get a single instance of that controller with the name that you define. So we have a instance of
`ControllerAsVmExampleCtrl1` named "example1" and a instance of `ControllerAsVmExampleCtrl2` named "example2". This prevents the `name`
properties from possibly colliding with each other.

## Controller as VM

Attaching  our models using `this` on our controllers leads to a clean syntax but what happens when the context of `this`
changes?

<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
     
app.controller('ControllerAsVmExampleCtrl1', function($scope){
  this.message = 'Hello World';
    
  $scope.$watch(function () {
    return this.message;
  }, function (newVal) {
    console.log(newVal);  // 'undefined'
  });
});
</code>
</pre>

The issue here is `this.message` in our `$watch` method now references to the function execution context instead of the
`this.message` on the controller. To fix this we could use `.bind()`
This would fix the issue of `this` referencing the function instead of the controller but there is a better way.
We can assign `this` to a variable called `vm` (view model).
 
<pre class="language-javascript">
<code>
'use strict';
var app = angular.module('app', []);
     
app.controller('ControllerAsVmExampleCtrl1', function($scope){
  var vm = this;
  vm.message = 'Hello World';
    
  $scope.$watch(function () {
    return vm.message;
  }, function (newVal) {
    console.log(newVal);  // 'Hello World'
  });
}); 
</code>
</pre>

By assigning `this` to `vm` we solve the issue of the `this` context. We also gain a clean looking view model
for our controller. This follows more of a MVVM style pattern. We can easily see anything attached to our view model can be accessed in our view.
This has become my preferred way to write my controllers on all my Angular projects.

Using the new `Controller As` syntax brings some great benefits to our code including scalability and readability of our controllers and views. I have been using
this on a large scale Angular project and using this syntax has created great benefits to the code. To read more about the `Controller As` syntax check out the docs at
<a href="https://docs.angularjs.org/api/ng/directive/ngController" target="_blank">docs.angularjs.org</a>.