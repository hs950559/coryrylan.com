---
layout: post
title: Converting Angular 1 components to Angular 2 
description: Learn how to convert Angular 1 components to Angular 2 components and the syntax differences.
keywords: Cory Rylan, Angular2, AngularJS, Components
tags: angular2, angularjs
date: 2016-04-03
permalink: /blog/converting-angular-1-components-to-angular-2
demo: 
---

With Angular 2 fast approaching, Angular 1.5 introduced a new components syntax that mimics similar
behavior to Angular 2 components. First we are going to take a look at a simple Angular 1 component
how it accepts inputs and emits output events to other components.

## Angular 1 Component

In this example we have a simple application that lists a list of products for sale. We have two components a root 
app component and a `product-item` component. Using components our apps are formed into a tree of components. 
With this tree like structure it is easier to understand how an app is structured and data is passed between components.
Lets take a look at what the rendered output looks like.

<video src="/assets/video/posts/2016-04-03-converting-angular-1-components-to-angular-2/angular-component.mp4" autoplay loop controls class="float-center col-4--max"></video>

So lets take a look at the app component source code. Our Angular 1 code is in ES5 while our Angular 2 code will
be written in ES6/TypeScript.

<pre class="language-javascript">
<code>
{% raw %}
angular.module('app', [])
    .component('appComponent', {
        template: [
            &#39;&lt;div ng-repeat=&quot;product in $ctrl.products&quot;&gt;&#39;,
                &#39;&lt;product-item product=&quot;product&quot; on-select=&quot;$ctrl.selectedProduct = $event&quot;&gt;&lt;/product-item&gt;&#39;,
            &#39;&lt;/div&gt;&#39;,
            &#39;&lt;hr /&gt;&#39;,
            &#39;&lt;h3&gt;{{$ctrl.selectedProduct.name}}&lt;/h3&gt;&#39;,
            &#39;&lt;p&gt;{{$ctrl.selectedProduct.price | currency}}&lt;/p&gt;&#39;,
        ].join(''),
        controller: function () {
            this.products = [
                { name: 'iPhone', price: 500.00 },
                { name: 'iPad', price: 800.00 },
                { name: 'Macbook', price: 1200.00 }
            ];
        
            this.selectedProduct = this.products[0];
        }
});
{% endraw %}
</code>
</pre>

So our App component has a list of products that we list using `ng-repeat`. We then pass our product to the
`product-item` component. Our App component also listens for an `on-select` event from the `product-item` component
to know what item was selected by the user and display that item. The `$ctrl` in our template references the methods and properties
listed on our component's controller. So now lets look at the `product-item` source code.

<pre class="language-javascript">
<code>
{% raw %}
angular
    .module('app')
    .component('productItem', {
        bindings: {
            product: '<',
            onSelect: '&'
        },
        controller: function () { },
        template: [
            &#39;&lt;div class=&quot;product&quot;&gt;&#39;,
            &#39;&lt;button ng-click=&quot;$ctrl.onSelect({$event: $ctrl.product})&quot;&gt;Buy&lt;/button&gt; &#39;,
            &#39;{{$ctrl.product.name}}&#39;,
            &#39;&lt;/div&gt;&#39;
        ].join('')
    });
{% endraw %}
</code>
</pre>

Looking at our `product-item` component we have a propery called `bindings` defined. This let us define an API to our
component for how it will interact with other components. The first binding we have is `product` this is the 
product that is passed into the component from our parent app component. `<product-item product="product">` The
`'<'` is for binding it as a <a href="https://docs.angularjs.org/guide/component#component-based-application-architecture" target="_blank">one way property</a> 
passing a reference to the product. 

The next binding is the `onSelect` which uses the `'&'` notation. This means the incoming value should be 
treated as a expression or function to be executed. This allows the `product-item` to call a function that is being passed
in to notify our parent app component. `<product-item on-select="$ctrl.selectedProduct = $event">`.

So when we click a buy button we call the `onSelect` and pass back the selected item to the parent component. This 
data flow is strongly recommended and encouraged in Angular 2. We can visualize how the data flows through our app
with the diagram below. 



## Angular 2 Component

## Migration Strategies