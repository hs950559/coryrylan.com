---
layout: post
title: ES2015 Class in AngularJS Controllers and Services
description: Learn how to use ES2015 Classes in you Angular 1.x Controllers and Services.
keywords: Cory Rylan, AngularJS, AngularJS, JavaScript
tags: angularjs, es2015
date: 2016-02-02
permalink: /blog/es2015-class-in-angularjs-controllers-and-services
demo: http://plnkr.co/edit/D9MEJZe4pF6oztf7DP31?p=preview
---

Angular 1.x still has a long life ahead of it even with the beta launch of Angular 2. If you have a large existing Angular 1 application you 
will want to slowly convert you application over time to use ES6/ES2015 or TypeScript. This will help make some of the transition to Angular 2 even 
easier and give you benefits of using ES2015 syntax.

To start using ES2015 you can use a transpiler which helps convert ES2015 code to ES5 code that can run in all the browsers. There are many 
transpilers but <a href="https://babeljs.io/" target="_blank">Babel</a> and <a href="http://www.typescriptlang.org/" target="_blank">TypeScript</a> are by far the most popular. So this post we will cover a few simple examples of converting our Angular app to use ES2015 Classes.

The first example we will try is converting a Factory Service to a Service using a class. Our `BaseService` has a data store property and one method `loadData`. 

<pre class="language-javascript">
<code>
{% raw %}
(function() {
  'use strict';
  
  angular.module('app').factory('baseService', baseService);
  
  function baseService() {
    var data = {
      items: []
    };
    
    var service = {
      data: data
      loadData: loadData
    }

    return service;
    
    function loadData() {
      data.items = ['one', 'two', 'three'];
    }
  }
}());
{% endraw %}
</code>
</pre>

Now take a look at the ES2015 Class example. 

<pre class="language-javascript">
<code>
{% raw %}
(function() {
  'use strict';
  
  class BaseService {
    constructor() {
      this.data = {
        items: []
      };
    }
    
    loadData() {
      this.data.items = ['one', 'two', 'three'];
    }
  }
  
  angular.module('app').service('BaseService', BaseService);
}());
{% endraw %}
</code>
</pre>

We have a constructor that initializes our data store. Next we have one method on our service for populating this data store. 
This would be commonly where your service would call a web service to fetch data. Next lets take a look at our Controller that will be converted to use a ES2015 Class

<pre class="language-javascript">
<code>
{% raw %}
(function() {
  'use strict';
  
  angular.module('app').controller('BaseController', BaseController);
  BaseController.$inject = ['baseService'];

  function BaseController(baseService) {
    var vm = this;
    vm.data = baseService.data;
    vm.onClick = onClick;
    
    function onCLick() {
      baseService.loadData();
    }
  }
}());
{% endraw %}
</code>
</pre>

Notice we are binding our properties to `this` and not to `$scope`. Using the <a href="/blog/angularjs-controller-as-syntax">`controllerAs`</a> syntax we can write cleaner code that does 
not rely on `$scope` which no longer is needed in Angular 2. The controller is fairly straight forward it adds a property with our service data 
and a single function for a click event. Next lets look at the same service but using a ES2015 class.

<pre class="language-javascript">
<code>
{% raw %}
(function() {
  'use strict';
  
  class BaseController {
    constructor(BaseService) {
      this._baseService = BaseService;
      this.data = this._baseService.data;
    }
    
    onClick() {
      this._baseService.loadData();
    }
  }
  
  BaseController.$inject = ['BaseService'];
  angular.module('app').controller('BaseController', BaseController);
}());
{% endraw %}
</code>
</pre>

The class based controller is a bit simpler now. We have a constructor for initializing our properties and our click function is a method on our `BaseController` class.
Also note our controller and services are registered after the class is defined. ES2015 Classes are not hoisted so if the are referenced 
before we define them we get a reference error.

Now our controllers and services are using ES2015 classes and are that much closer to looking like Angular 2 style components and services. 
A working demo of this post can be found at this <a href="http://plnkr.co/edit/D9MEJZe4pF6oztf7DP31?p=preview" target="_blank">plnkr</a>.
Note using native non transpiled classes, this is not supported in Angular 1 just yet but it is in the works. 
See this <a href="https://github.com/angular/angular.js/issues/13510" target="_blank">GitHub Issue</a>.
