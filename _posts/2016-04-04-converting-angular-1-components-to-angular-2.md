---
layout: post
title: Converting Angular 1 components to Angular 2 
description: Learn how to convert Angular 1 components to Angular 2 components and the syntax differences.
keywords: Cory Rylan, Angular2, AngularJS, Components
tags: angular2, angularjs
date: 2016-04-04
permalink: /blog/converting-angular-1-components-to-angular-2
demo: 
---

With Angular 2 fast approaching, Angular 1.5 introduced a new components syntax that mimics similar
behavior to Angular 2 components. In this example we will take an Angular 1 component and convert it to 
an Angular 2 component. First we are going to take a look at a simple Angular 1 component
how it accepts inputs and emits output events to other Angular 1 components.

## Angular 1 Component

In this example we have a simple application that lists a list of products for sale. We have two components a root 
app component and a `product-item` component. Using components our apps are formed into a tree of components. 
With this tree like structure it is easier to understand how an app is structured and data is passed between components.
Lets take a look at what the rendered output will look like.

<video src="/assets/video/posts/2016-04-03-converting-angular-1-components-to-angular-2/angular-component.mp4" autoplay loop controls class="float-center col-4--max"></video>

Now lets take a look at the app component source code. Our Angular 1 code is in ES5 while our Angular 2 code will
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
binding `'<'` is for binding it as a <a href="https://docs.angularjs.org/guide/component#component-based-application-architecture" target="_blank">one way property</a> 
passing a reference to the product. 

The next binding is the `onSelect` which uses the `'&'` notation. This means the incoming value should be 
treated as a expression or function to be executed. This allows the `product-item` to call a function that is being passed
in to notify our parent app component. `<product-item on-select="$ctrl.selectedProduct = $event">`.

So when we click a buy button we call the `onSelect` and pass back the selected item to the parent component. This 
data flow is strongly recommended and encouraged in Angular 2. We can visualize how the data flows through our app
with the diagram below. 

<img src="/assets/images/posts/2016-04-04-converting-angular-1-components-to-angular-2/angular-component-comunication.svg" alt="Example of Route Tree in Angular 2" class="full-width float-center col-6--max" />

So we can see we pass data along down to child components and the child components use events to notify their parent of 
a change or user action. We will see how this pattern is renforced in Angular 2.

## Angular 2 Component

So now lets take a look at an Angular 2 component that has the exact same functionality as our Angular 1 component. 
First we will look at our root app component.

<pre class="language-javascript">
<code>
{% raw %}
import {Component} from &#39;angular2/core&#39;;
import {bootstrap} from &#39;angular2/platform/browser&#39;;
import {ProductItemComponent} from &#39;src/product-item.component&#39;;

@Component({
  selector: &#39;demo-app&#39;,
  template: `
    &lt;div *ngFor=&quot;#product of products&quot;&gt;
      &lt;product-item [product]=&quot;product&quot; (onSelect)=&quot;selectedProduct = $event&quot;&gt;&lt;/product-item&gt;
    &lt;/div&gt;
    &lt;hr /&gt;
    &lt;h3&gt;{{selectedProduct.name}}&lt;/h3&gt;
    &lt;p&gt;{{selectedProduct.price | currency:&#39;USD&#39;:true:&#39;1.2-2&#39;}}&lt;/p&gt;
  `,
  directives: [ProductItemComponent]
})
export class App {
  selectedProduct: any;
  
  constructor() { 
    this.products = [
      { name: &#39;iPhone&#39;, price: 500.00 },
      { name: &#39;iPad&#39;, price: 800.00 },
      { name: &#39;Macbook&#39;, price: 1200.00 }
    ];
    
    this.selectedProduct = this.products[1];
  }
}

bootstrap(App);
{% endraw %}
</code>
</pre>

In our Angular 2 app we are taking advantage of ES6 and TypeScript to give us a nice clean syntax. I wont
be covering setup on an Angular 2 project but you can check out the running demos and any number of Angular 2
seed projects. First we are importing
Angular 2 modules and our `ProductItemComponent` using ES6 module syntax. 

<pre class="language-javascript">
<code>
{% raw %}
import {Component} from &#39;angular2/core&#39;;
import {bootstrap} from &#39;angular2/platform/browser&#39;;
import {ProductItemComponent} from &#39;src/product-item.component&#39;;
{% endraw %}
</code>
</pre>

Next we have whats called a decorator `Component()` on our Class. This decorator tells Angular that this ES6 claass
is a component and allows us to add meta data such as what our template is and what other components it may need to work. 

<pre class="language-javascript">
<code>
{% raw %}
@Component({
  selector: &#39;demo-app&#39;,
  template: `
    &lt;div *ngFor=&quot;#product of products&quot;&gt;
      &lt;product-item [product]=&quot;product&quot; (onSelect)=&quot;selectedProduct = $event&quot;&gt;&lt;/product-item&gt;
    &lt;/div&gt;
    &lt;hr /&gt;
    &lt;h3&gt;{{selectedProduct.name}}&lt;/h3&gt;
    &lt;p&gt;{{selectedProduct.price | currency:&#39;USD&#39;:true:&#39;1.2-2&#39;}}&lt;/p&gt;
  `,
  directives: [ProductItemComponent]
})
{% endraw %}
</code>
</pre>

Looking at our template it looks similar to the Angular 1 component with some slight differences. First `ng-repeat` is now
`ngFor`. The `*` is used to signal that this directive is a structural directive and will change the DOM structure of our template.
Next look at the `product-item` component.

<pre class="language-html">
<code>
{% raw %}
&lt;product-item [product]=&quot;product&quot; (onSelect)=&quot;selectedProduct = $event&quot;&gt;&lt;/product-item&gt;
{% endraw %}
</code>
</pre>



## Migration Strategies