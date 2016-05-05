---
layout: post
title: Comparing Angular 1 Components to Angular 2 Components
description: A comparison of Angular 1 components to Angular 2 components and migration strategies.
keywords: Cory Rylan, Angular2, AngularJS, Components
tags: angular2, angularjs
date: 2016-04-06
updated: 2016-05-05
permalink: /blog/comparing-angular-1-components-to-angular-2-components
demo:
---

With Angular 2 fast approaching, Angular 1.5 introduced a new component syntax that mimics similar
behavior to Angular 2 components. In this example we will take an Angular 1 component and compare it to 
an Angular 2 component. By the end of this post you should have a better idea of what it takes to convert an
Angular 1.x component to Angular 2.x. First we are going to take a look at a simple Angular 1 component
how it accepts inputs and emits output events to other Angular 1 components.

## Angular 1 Component

In this example we have a simple application that lists a list of products for sale. We have two components a root 
`app` component and a `product-item` component. Using components our apps are formed into a tree structure of components. 
With this tree like structure it is easier to understand how an app is composed and data is passed between components.
Lets take a look at what the rendered output will look like.

<video src="/assets/video/posts/2016-04-06-comparing-angular-1-components-to-angular-2-components/angular-component.mp4" autoplay loop controls class="float-center col-4--max"></video>

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

Looking at our `product-item` component we have a property called `bindings` defined. This let us define an API to our
component for how it will interact with other components. The first binding we have is `product` this is the 
product that is passed into the component from our parent app component. `<product-item product="product">` The
binding `'<'` is for binding as a <a href="https://docs.angularjs.org/guide/component#component-based-application-architecture" target="_blank">one way property</a> 
passing a reference of the product. 

The next binding is the `onSelect` which uses the `'&'` notation. This means the incoming value should be 
treated as a expression or function to be executed. This allows the `product-item` to call a function that is being passed
in to notify our parent app component. `<product-item on-select="$ctrl.selectedProduct = $event">`.

So when we click a buy button we call the `onSelect` and pass back the selected item to the parent component. This 
data flow is common and encouraged in Angular 2. We can visualize how the data flows through our app
with the diagram below. 

<img src="/assets/images/posts/2016-04-06-comparing-angular-1-components-to-angular-2-components/angular-component-comunication.svg" alt="Example of Angular 2 component data flow" class="full-width float-center col-6--max" />

So we can see we pass data along down to child components and the child components use events to notify their parent of 
a change or user action. We will see how this pattern is renforced in our Angular 2 version.

## Angular 2 Component

So now lets take a look at an Angular 2 component that has the exact same functionality as our Angular 1 component. 
First we will look at our root app component.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from &#39;@angular/core&#39;;
import { ProductItemComponent } from &#39;app/product-item.component&#39;;

@Component({
  selector: &#39;demo-app&#39;,
  template: `
    &lt;div *ngFor=&quot;let product of products&quot;&gt;
      &lt;product-item [product]=&quot;product&quot; (onSelect)=&quot;selectedProduct = $event&quot;&gt;&lt;/product-item&gt;
    &lt;/div&gt;
    &lt;hr /&gt;
    &lt;h3&gt;{{selectedProduct.name}}&lt;/h3&gt;
    &lt;p&gt;{{selectedProduct.price | currency:&#39;USD&#39;:true:&#39;1.2-2&#39;}}&lt;/p&gt;
  `,
  directives: [ProductItemComponent]
})
export class AppComponent {
  selectedProduct: any;
  
  constructor() { 
    this.products = [
      { name: &#39;iPhone&#39;, price: 500.00 },
      { name: &#39;iPad&#39;, price: 800.00 },
      { name: &#39;Macbook&#39;, price: 1200.00 }
    ];

    this.selectedProduct = this.products[0];
  }
}
{% endraw %}
</code>
</pre>

In our Angular 2 app we are taking advantage of ES6 and TypeScript to give us a nice clean syntax with improved
IDE tooling. I wont be covering setup on an Angular 2 project but you can check out the running demos and any 
number of Angular 2 seed projects. First we are importing
Angular 2 modules and our `ProductItemComponent` using ES6 module syntax. 

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from &#39;@angular/core&#39;;
import { ProductItemComponent } from &#39;app/product-item.component&#39;;
{% endraw %}
</code>
</pre>

Next we have what is called a decorator `Component()` on our Class. This decorator tells Angular that this ES6 class
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

The first property in the component decorator is the `selector` this simply tells Angular what the HTML element should be.
Ex: `<demo-app></demo-app>`.

Looking at our template it looks similar to the Angular 1 component with some slight differences. First `ng-repeat` is now
`ngFor`. The `*` is used to signal that this directive is a structural directive and will change the DOM structure of our template.
Next look at the `product-item` component.

### Template Syntax, Properties and Events

<pre class="language-html">
<code>
{% raw %}
&lt;product-item [product]=&quot;product&quot; (onSelect)=&quot;selectedProduct = $event&quot;&gt;&lt;/product-item&gt;
{% endraw %}
</code>
</pre>

This is where things get a bit strange but it actually is a great improvement over Angular 1. First is our `[]` notation
we see wrapped around `[product]`. This means we are passing in a product to our `product-item` component via a 
custom property. So in Angular 2 when we want to pass data into components we use the brackets to signify that we are
passing in data `[product]`. 

Next is the `(onSelect)` on the `product-item`. The `onSelect` is a custom event our `product-item` component raises to 
notify it's parent component. When we want to hook into events we reference using the `()` parens syntax. This 
applies to all events even browser events like click, ex: `(click)`. We will see more of this once we go over our `product-item`
component. One thing to note our `(onSelect)` uses camel casing vs dashes. This is because of Angular 2's new
HTML parser that allows our HTML to be case-sensitive. This removes the need of case conversions that we had in Angular 1.x.

So whats the benefit of this syntax? Well we can easily describe our components API. Data flows in as **inputs** to the component
via [properties] and data flows as **outputs** via `(events)`. We can look at a template and quickly understand the 
data flow between components. This will also help IDEs statically analyze and understand our template and give us
 hints such as possible missing properties and events on our component.

Now lets look at the class definition of the app component. This is a simple ES6/ES2015 class with a bit of TypeScript.
We will ignore the TypeScript bit for now.

<pre class="language-javascript">
<code>
{% raw %}
export class AppComponent {
  selectedProduct: any;  // TypeScript specific code defining that this prop can be of type any

  constructor() { 
    this.products = [
      { name: &#39;iPhone&#39;, price: 500.00 },
      { name: &#39;iPad&#39;, price: 800.00 },
      { name: &#39;Macbook&#39;, price: 1200.00 }
    ];

    this.selectedProduct = this.products[0];
  }
}
{% endraw %}
</code>
</pre>

So here we can see we are defining some properties on our component class. First is a list of products that 
we will pass into our `ngFor`. Next is the `selectedProduct` property. We set this value to the selected property
our `product-item` component emits. 

So lets look into the `product-item` source code and then dig into the template syntax a bit more.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, Input, Output, EventEmitter } from &#39;@angular/core&#39;;

@Component({
  selector: 'product-item',
  template: `
    &lt;div class="product"&gt;
       &lt;button (click)="select()">Buy&lt;/button&gt;
      {{product.name}}
    &lt;/div&gt;
  `
})
export class ProductItemComponent {
  @Input() product: any;
  @Output() onSelect: EventEmitter;
  
  constructor() {
      this.onSelect = new EventEmitter();
  }
  
  select() {
    this.onSelect.emit(this.product);
  }
}
{% endraw %}
</code>
</pre>

The first line we are importing the pieces we need from Angular once again using the new ES6 module syntax.
Next is our component decorator that we covered earlier. The template is fairly small. We display the product 
we get from our input property. The next part is the click event we create. Using the event syntax we don't need 
a bunch of Angularisms like `ng-click`, `ng-whatever-event`. The `()` lets Angular know we simply want a browser 
click event. Our click event calls a method on the component called `select`.

Now lets look at the component class.

<pre class="language-javascript">
<code>
{% raw %}
export class ProductItemComponent {
  @Input() product: any;             // incoming data  [product]
  @Output() onSelect: EventEmitter;  // outgoing data  (onSelect)
  
  constructor() {
    this.onSelect = new EventEmitter();
  }

  select() {
    this.onSelect.emit(this.product);
  }
}
{% endraw %}
</code>
</pre>

As you can see we have two properties defined on our component. They are `product` and `onSelect`. These properties 
are decorated with `@Input` and `@Output` decorators. This syntax is currently a TypeScript feature but there
is an equivalent syntax for ES2015 code. These property decorators tell Angular their purpose. So the `product` is
an input to our component accepting a product object. `[product]` -> `@Input() product: any` The `onSelect` is an output
and tells Angular that we will be outputting values using the `EventEmitter` class. `(onSelect)` -> `@Output() onSelect: EventEmitter`.

In our constructor we set the `onSelect` property to a new `EventEmitter`. In the component's method `select` we emit a new 
event which will be our selected product. The `select` method is called in our `(click)` event on the template. 

## Conclusion

So lets take another look at our data flow diagram now with the updated Angular 2 syntax.

<img src="/assets/images/posts/2016-04-06-comparing-angular-1-components-to-angular-2-components/angular-component-comunication-2.svg" alt="Example of Angular 2 component data flow" class="full-width float-center col-6--max" />

As we can see the new Angular 2 syntax directly corresponds to how data flows in our application making it 
easier to understand and debug. Here is a code snippet of our component with the Angular 1 and Angular 2 versions.

<pre class="language-javascript">
<code>
{% raw %}
// Angular 1
angular
  .module(&#39;app&#39;)
  .component(&#39;productItem&#39;, {
    template: [
      &#39;&lt;div class=&quot;product&quot;&gt;&#39;,
      &#39;&lt;button ng-click=&quot;$ctrl.onSelect({$event: $ctrl.product})&quot;&gt;Buy&lt;/button&gt; &#39;,
      &#39;{{$ctrl.product.name}}&#39;,
      &#39;&lt;/div&gt;&#39;
    ].join(&#39;&#39;),
    bindings: {
      product: &#39;=&#39;,
      onSelect: &#39;&amp;&#39;
    },
    controller: function () { }
  });
       
// Angular 2    
import { Component, Input, Output, EventEmitter } from &#39;@angular/core&#39;;

@Component({
  selector: &#39;product-item&#39;,
  template: `
    &lt;div class=&quot;product&quot;&gt;
    &lt;button (click)=&quot;select()&quot;&gt;Buy&lt;/button&gt;
    {{product.name}}
    &lt;/div&gt;
    `
})
export class ProductItemComponent {
  @Input() product: any;
  @Output() onSelect: EventEmitter;

  constructor() {
    this.onSelect = new EventEmitter();
  }

  select() {
    this.onSelect.emit(this.product);
  }
}
{% endraw %}
</code>
</pre>

## Migration Strategies

Many existing Angular 1 apps are not using components but controllers and directives. My recommendation
is to convert controllers over to components if you are concerned about upgrading to Angular 2 in the future.
Another stepping stone to a Angular 2 migration is using ES6 or TypeScript in your Angular 1 applications.
Angular 2 will be very component centric and by using components in 1.x it will help guide your app
closer to the vision of Angular 2.

You can check out both versions of the demo below.

<div class="flex-row--center">
    <div class="col-3">
        <a href="http://plnkr.co/edit/O2DSd7dH7akOgXD1pD0P?p=preview" target="_blank" class="btn--raised">Angular 1 Example</a>
    </div>
    <div class="col-3">
        <a href="http://plnkr.co/edit/ISusP30dkrA8rJJ6aQjG?p=preview" target="_blank" class="btn--raised">Angular 2 Example</a>
    </div>
</div>
