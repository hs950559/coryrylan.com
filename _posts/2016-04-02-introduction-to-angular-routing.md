---
layout: post
title: Introduction to Angular Routing
description: Learn how to manage large Angular applications and navigation with the new component router using features such as child routing and route parameters.
keywords: Cory Rylan, Angular, javascript, routing, router
tags: angular
date: 2016-04-02
updated: 2016-12-19
permalink: /blog/introduction-to-angular-routing
demo: https://embed.plnkr.co/RPvgcUdiLFP4Mtig9Q7n/
---

{% include ng-version.html %}

Angular brings many improved modules to the Angular ecosystem including a new router called the Component Router. 
The Component Router is a highly configurable and feature packed router. Features included are standard view routing, nested child routes, 
named routes, and route parameters. This post we will cover standard routing, route parameters and nested 
child routes. With these basics we can build a great navigation experience for users
that is easy to reason about.

## Basic Routing

So now lets take a look at what our first rendered view will look like.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-routing/angular-simple-routing.mp4" autoplay loop controls bp-layout="float-center 5--max"></video>

We will start with single app component that has two routes. We will have a home view and a about view.
Lets take a look at these two components first.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `&lt;h2&gt;Home&lt;/h2&gt;`
})
export class Home { }

@Component({
  selector: 'app-about',
  template: `&lt;h2&gt;About&lt;/h2&gt;`
})
export class About { }
{% endraw %}
</code>
</pre>

So we can see that our two components are very simple just displaying some text. Now lets look at our
app component and see how we can use the new Router to route between these two components.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    &lt;a [routerLink]=&quot;[&#39;/&#39;]&quot;&gt;Home&lt;/a&gt;
    &lt;a [routerLink]=&quot;[&#39;/about&#39;]&quot;&gt;About&lt;/a&gt;
    &lt;div class=&quot;outer-outlet&quot;&gt;
      &lt;router-outlet&gt;&lt;/router-outlet&gt;
    &lt;/div&gt;
  `
})
export class AppComponent { }
{% endraw %}
</code>
</pre>

So lets walk through our app component step by step and see what this code is doing. 

<pre class="language-javascript">
<code>
{% raw %}
@Component({
  selector: &#39;demo-app&#39;,
  template: `
    &lt;a [routerLink]=&quot;[&#39;/&#39;]&quot;&gt;Home&lt;/a&gt;
    &lt;a [routerLink]=&quot;[&#39;/about&#39;]&quot;&gt;About&lt;/a&gt;
    &lt;div class=&quot;outer-outlet&quot;&gt;
      &lt;router-outlet&gt;&lt;/router-outlet&gt;
    &lt;/div&gt;
  `
})
{% endraw %}
</code>
</pre>

So the first part is the `[routerLink]`. This directive generates our link based on the route path. 
The second part is the `router-outlet`, this is the location where Angular will insert the component 
we want to route to on the view. Next lets take a look at our route config file `app.routes.ts`.

<pre class="language-javascript">
<code>
{% raw %}
import { Routes } from '@angular/router';

import { AboutComponent } from 'app/about.component';
import { HomeComponent } from 'app/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }
  { path: 'about', component: AboutComponent }
];
{% endraw %}
</code>
</pre>

Our route config defines all the routes in our application. The first route is our default home route.
The second one is our `AboutComponent`. The path value is the path that we referenced in our template.
We export our routes to be added to our App Module.

<pre class="language-javascript">
<code>
{% raw %}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { AboutComponent } from './about.component';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AboutComponent,
    HomeComponent,
    AppComponent
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
{% endraw %}
</code>
</pre>

<p>
  Our `AppModule` is where we create a new `@NgModule`. A NgModule is a way to bundle components, services and pipes 
  into a single module for Angular to consume. So we will register all of our components to our `AppModule`
  then boostrap the module like below.
</p>

<pre class="language-javascript">
<code>
{% raw %}
import { browserDynamicPlatform } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

browserDynamicPlatform().bootstrapModule(AppModule);
{% endraw %}
</code>
</pre>

Now that our routes are registered we have our standard routing working. Next lets look at nested routes.

## Nested Child Routes

Child/Nested routing is a powerful new feature in the new Angular router. We can think of our application as
a tree structure, components nested in more components. We can think the same way with our routes and URLs.

So we have the following routes, `/` and `/about`. Maybe our about page is extensive and there are a couple of different views
we would like to display as well. The URLs would look something like `/about` and `/about/item`. The first
route would be the default about page but the more route would offer another view with more details. 

So lets take a look at what that looks like rendered out.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-routing/angular-nested-routing.mp4" autoplay loop controls bp-layout="float-center 5--max"></video>

So as above we can see the About view has its own `router-outlet` highlighted in blue. The about view also
has its own links that navigate between two nested about child components. We can think of this as a tree structure.

<img src="/assets/images/posts/2016-04-02-introduction-to-angular-routing/angular-router-tree.svg" alt="Example of Route Tree in Angular" bp-layout="full-width float-center 6--max" />

So lets take a look at our About components.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from &#39;@angular/core&#39;;

@Component({
  selector: &#39;about-home&#39;,
  template: `&lt;h3&gt;About Home&lt;/h3&gt;`
})
export class AboutHomeComponent { }

@Component({
  selector: &#39;about-item&#39;,
  template: `&lt;h3&gt;About Item&lt;/h3&gt;`
})
export class AboutItemComponent { }

@Component({
    selector: &#39;app-about&#39;,
    template: `
      &lt;h2&gt;About&lt;/h2&gt;
      &lt;a [routerLink]=&quot;[&#39;/about&#39;]&quot;&gt;Home&lt;/a&gt;
      &lt;a [routerLink]=&quot;[&#39;/about/item&#39;]&quot;&gt;Item&lt;/a&gt;
      &lt;div class=&quot;inner-outlet&quot;&gt;
        &lt;router-outlet&gt;&lt;/router-outlet&gt;
      &lt;/div&gt;
    `
})
export class AboutComponent { }
{% endraw %}
</code>
</pre>

So our About template looks very similar to the App component template. Our about component has
two child routes, `about/` and `about/item` These pull in two simple components that
just display the rendered text above. Notice our route paths start at the root of the about component.
The rendered URLs would be `/about/` and `/about/item`. Note remember to add our newly created 
components to the `declarations` in our `AppModule`.  Lets now take a look at the updated route config.

<pre class="language-javascript">
<code>
{% raw %}
import { Routes } from '@angular/router';

import { AboutComponent, AboutHomeComponent, AboutItemComponent } from 'app/about.component';
import { HomeComponent } from 'app/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }
  {
    path: 'about',
    component: AboutComponent,
    children: [
      { path: '', component: AboutHomeComponent }, // url: about/
      { path: 'item', component: AboutItemComponent } // url: about/item
    ]
  }
];
{% endraw %}
</code>
</pre>

Notice our path in our About component is now relative for all the child components.
Next we will learn how to dynamically change data in our component via route parameters.

## Route Parameters

Building on top of our demo app we are now going to add a component that takes in a route parameter.
Route parameters allow us to pass values in our url to our component so we can dynamically change our view content. 
So in our example we will have a route that can take an id and then display it on our `AboutItemComponent`
component. So lets take a look at what the rendered output would be.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-routing/angular-route-parameters.mp4" autoplay loop controls bp-layout="float-center 5--max"></video>

Our URLs would be the following: `/about/`, `/about/item/1`, and `/about/item/2`. We can swap out any number in our URL and 
our item component can pull that value out and display it in the view. Let's take a look at the code for the root about component.

<pre class="language-javascript">
<code>
{% raw %}
@Component({
    selector: &#39;app-about&#39;,
    template: `
      &lt;h2&gt;About&lt;/h2&gt;
      &lt;a [routerLink]=&quot;[&#39;/about&#39;]&quot;&gt;Home&lt;/a&gt;
      &lt;a [routerLink]=&quot;[&#39;/about/item&#39;, 1]&quot;&gt;Item 1&lt;/a&gt;
      &lt;a [routerLink]=&quot;[&#39;/about/item&#39;, 2]&quot;&gt;Item 2&lt;/a&gt;
      &lt;div class=&quot;inner-outlet&quot;&gt;
        &lt;router-outlet&gt;&lt;/router-outlet&gt;
      &lt;/div&gt;
    `
})
export class AboutComponent { }
{% endraw %}
</code>
</pre>

So the first part in our about template our new `[routerLink]`'s have a second parameter of the id value ex: `['/about/item', 2]`. 
This allows us to pass in parameters to the router. For now we are just passing in a number. Now lets take a look at the 
updated route config.

<pre class="language-javascript">
<code>
{% raw %}
export const routes: Routes = [
  { path: '', component: HomeComponent }
  {
    path: 'about',
    component: AboutComponent,
    children: [
      { path: '', component: AboutHomeComponent },
      { path: 'item/:id', component: AboutItemComponent }
    ]
  }
];
{% endraw %}
</code>
</pre>

Now taking a look at the item route we now have `'item/:id'` the `:` denotes that this is a route parameter and the r
outer should get the value in the URL. So now lets take a look at the `AboutItemComponent` and see how we can get the id from the URL.

<pre class="language-javascript">
<code>
{% raw %}
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: &#39;about-item&#39;,
  template: `&lt;h3&gt;About Item Id: {{id}}&lt;/h3&gt;`
})
export class AboutItemComponent { 
  id: any;
  paramsSub: any;
  
  constructor(private activatedRoute: ActivatedRoute) { }
  
  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params =&gt; this.id = parseInt(params[&#39;id&#39;], 10));
  }
  
  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
{% endraw %}
</code>
</pre>

We import the `ActivatedRoute` class and inject it into our component. The parameters are wrapped in an Observable
that will push the current route parameter value whenever the parameter is updated. We subscribe for any changes.
When a new value is received we set the value to a property on our template. We could just as easily taken this value
as an ID to retrieve some data from a API. We capture the subscription in a property so when the component is destroyed 
we unsubscribe preventing any memory leaks. 

Using Observables to get route params works well when the component persists on the same screen without having 
to be destroyed and recreated each time. If you are certain your component will be destroyed before a new 
parameter is updated you can use the `snapshot` api option documented 
<a href="https://angular.io/docs/ts/latest/guide/router.html#!#snapshot" target="_blank">here</a>.

So now lets take a look at our diagram of our application's routes.

<img src="/assets/images/posts/2016-04-02-introduction-to-angular-routing/angular-router-tree-2.svg" alt="Example of Route Tree in Angular with Route Parameters" bp-layout="full-width float-center 6--max" />

## Recap

So we learned how to do basic routing between components, child/nested routing and route parameters. With these features mastered
you can quickly build large scalable Angular apps in no time. As the new Release Candidate router is documented I will
update this post accordingly. Take a look at full working demo in the link below.