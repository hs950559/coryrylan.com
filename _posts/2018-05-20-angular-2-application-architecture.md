---
layout: post
title: Angular 2 Application Architecture
description: Learn the various architecture patterns we can use in Angular 2 to organize data and application state.
keywords: Cory Rylan, Angular 2, Redux, Components, RxJS
tags: Angular2, Angularjs
date: 2018-05-20
permalink: /blog/angular-2-application-architecture
demo:
---

In this post I am going to cover some of the common architecture patterns for an Angular 2
application. There are numerous design patterns but we will focus mainly on state management and communitcation.
With the rise of single page apps (SPA) managing data and state has become one of the most difficult parts to 
manage. Before SPAs server rendering guarenteeded the view the user saw was the latest data available. Now 
with SPAs we have caching, multiple views/ components and severall ways data can be retrieved. Making sure 
data is structured and communicated throughout our application is critical for a great use expereince.

In this post I will summarize certain patterns and reference other articles for learning and digging into.
This post will most certainly evolve and update as the Angular community has time to try variouse patterns and 
ideas. In this post I will also give each pattern its pros/cons and suggestions of when its appropriate to use.
These are the various patterns I will cover:

- Component Binding with Inputs and Outputs
- Shared Services
- State Management with Redux/Flux patterns
- Data Streams with RxJS

## Component Data Binding

The first and one of the most simple ways to pass data along in Angular 2 is through component bindings.
With the new binding template syntax we can easily define an API for our components to communicate to eachother.
Our example component a `products-list` allows us to bind a list of products and hook into a custom `selected` 
event.

<pre class="language-html">
<code>
{% raw %}
  &lt;products-list [products]="products" (onSelect)="selectedProduct = $event"&gt;&lt;products-list&gt;
{% endraw %}
</code>
</pre>

The `[]` bracket sytax allows us to bind directly to the components property. So a parent component can pass a list of products
to our product list. This allows our product list component to be "dumb" meaning it does not know how to retreive the list.
The product list components single job is to render the list it recieves. This makes this component highly reusable.