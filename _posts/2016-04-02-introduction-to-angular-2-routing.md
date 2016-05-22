---
layout: post
title: Introduction to Angular 2 Routing
description: Learn how to manage large Angular 2 applications and navigation with the new component router using features such as child routing and route parameters.
keywords: Cory Rylan, Angular2, AngularJS, routing, router
tags: angular2, angularjs
date: 2016-04-02
updated: 2016-05-06
permalink: /blog/introduction-to-angular-2-routing
demo: http://plnkr.co/edit/mWwhzJptV24uZwZeSrHX?p=preview
---

Angular 2 brings many improved modules to the Angular ecosystem including a new router called the Component Router. 
The component router is a highly configurable and feature packed router. Features included are routing, child routes, 
named routes, route parameters and auxiliary routes. This post we will cover basic routing, route parameters and nested 
child routes. With these basics we can build a great navigation experience for users
that is easy to reason about. Note this post has been updated to the new RC 1 release router that is currently being 
documented on the Angular website.

## Basic Routing

So first lets start with a single app component that has two routes. We will have a home view and a about view.
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

// import router goodies
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';

// import our two components we will route between
import { AboutComponent } from 'app/about.component';
import { HomeComponent } from 'app/home.component';

@Component({
  selector: 'demo-app',
  template: `
    &lt;a [routerLink]=&quot;[&#39;/&#39;]&quot;&gt;Home&lt;/a&gt;
	  &lt;a [routerLink]=&quot;[&#39;/about&#39;]&quot;&gt;About&lt;/a&gt;
    &lt;div class=&quot;outer-outlet&quot;&gt;
      &lt;router-outlet&gt;&lt;/router-outlet&gt;
    &lt;/div&gt;
  `,
  // add our router directives we will be using
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
    // these are our two routes
    { path: '/', component: HomeComponent }, // , useAsDefault: true}, // coming soon
    { path: '/about', component: AboutComponent }
])
export class AppComponent { }
{% endraw %}
</code>
</pre>

So lets walk through our app component step by step and see what this code is doing. 

<pre class="language-javascript">
<code>
{% raw %}
// Router Goodies
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
{% endraw %}
</code>
</pre>

So this import is pulling in all of the pieces we need to set up our app component for routing. We will walk through each
of these pieces below. Next is the component template.

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
  `,
  
  // add our router directives we will be using
  directives: [ROUTER_DIRECTIVES]
})
{% endraw %}
</code>
</pre>

So the first part is the `[routerLink]`. This directive generates our link based on the route path. 
This path is defined by a `@Route()` decorator. The second part is the `router-outlet`, 
this is the location where Angular will insert the component we want to route to on 
the view. Next lets look at the `@Route()` decorator.

<pre class="language-javascript">
<code>
{% raw %}
@Routes([
    // these are our two routes
    { path: '/', component: HomeComponent },
    { path: '/about', component: AboutComponent }
])
{% endraw %}
</code>
</pre>

Our route decorator takes and array of routes. Each route has a path which is the string that will be used in the
browser URL. Then each route has a component that we will route to.

So now lets take a look at our rendered view.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-2-routing/angular-2-simple-routing.mp4" autoplay loop controls class="float-center col-5--max"></video>

### Hash Routing vs HTML5 Routing

Our url also updates to `/` and `/about` depending on what view we are on. Lets take a look at our `main.ts` file.

<pre class="language-javascript">
<code>
{% raw %}
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { provide } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
{% endraw %}
</code>
</pre>

If you noticed in our main file we
set this `provide(LocationStrategy, {useClass: HashLocationStrategy})` in our bootstrap method. This is for hash routing.
This adds a `#` hash in front of our routes to prevent the browser from posting to the server. Ex: `/#about` 
This is turned off by default. To allow HTML5 routing without the hash you will need to have some 
kind of redirect rule set up on the server to redirect all routes back to the index.html of your Angular app.

## Child Routing

Child/Nested routing is a powerful new feature in the new Angular 2 router. We can think of our application as
a tree structure, components nested in more components. We can think the same way with our routes and URLs.

So we have the following routes, `/` and `/about`. Maybe our about page is extensive and there are couple of different views
we would like to display as well. The URLs would look something like `/about` and `/about/item`. The first
route would be the default about page but the more route would offer another view with more details. 

So lets take a look at what that looks like rendered out.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-2-routing/angular-2-nested-routing.mp4" autoplay loop controls class="float-center col-5--max"></video>

So as above we can see the About view has its own `router-outlet` highlighted in blue. The about view also
has its own links that navigate between two nested about child components. We can think of this as a tree structure.

<img src="/assets/images/posts/2016-04-02-introduction-to-angular-2-routing/angular-2-router-tree.svg" alt="Example of Route Tree in Angular 2" class="full-width float-center col-6--max" />

So lets take a look at our About component.

<pre class="language-javascript">
<code>
{% raw %}
@Component({
    selector: 'app-about',
    template: `
      &lt;h2&gt;About&lt;/h2&gt;
      &lt;a [routerLink]=&quot;[&#39;./AboutHome&#39;]&quot;&gt;About Home&lt;/a&gt;
	  &lt;a [routerLink]=&quot;[&#39;./AboutItem&#39;]&quot;&gt;About Item&lt;/a&gt;
      &lt;div class=&quot;inner-outlet&quot;&gt;
        &lt;router-outlet&gt;&lt;/router-outlet&gt;
      &lt;/div&gt;
    `,
    directives: [RouterOutlet, RouterLink]
})
@Route([
  { path: '/', component: AboutHomeComponent } //  useAsDefault: true }, coming soon!
  { path: '/item', component: AboutItemComponent }
])
export class AboutComponent { }
{% endraw %}
</code>
</pre>

So our About template looks very similar to the App component template. Our about component routes
we two routes, a default home route and a item view route. These pull in two simple components that
just display the rendered text above. Notice our route paths start at the root of the about component.
The rendered URLs would be `/about/` and `/about/item`.

## Route Parameters

Building on top of our demo app we are now going to add a component that takes in a route parameter or route param.
Route parameters allow us to pass values in our url to our component so we can dynamically change our view content. 
So in our example we will have a route that can take an id and then display it on our AboutItem
component. So lets take a look at what the rendered output would be.

<video src="/assets/video/posts/2016-04-02-introduction-to-angular-2-routing/angular-2-route-parameters.mp4" autoplay loop controls class="float-center col-5--max"></video>

Our URLs would be the following: `/about/`, `/about/1`, and `/about/2`. We can swap out any number in our URL and 
our item component can pull that value out and display it in the view. Let's take a look at the code.

<pre class="language-javascript">
<code>
{% raw %}
@Component({
    selector: &#39;app-about&#39;,
    template: `
      &lt;h2&gt;About&lt;/h2&gt;
	    &lt;a [routerLink]=&quot;[&#39;/&#39;]&quot;&gt;Home&lt;/a&gt;
	    &lt;a [routerLink]=&quot;[&#39;/about/item&#39;, 1]&quot;&gt;Item 1&lt;/a&gt;
	    &lt;a [routerLink]=&quot;[&#39;/about/item&#39;, 2]&quot;&gt;Item 2&lt;/a&gt;
      &lt;div class=&quot;inner-outlet&quot;&gt;
        &lt;router-outlet&gt;&lt;/router-outlet&gt;
      &lt;/div&gt;
    `,
    directives: [ROUTER_DIRECTIVES]
})
@Routes([
  { path: &#39;/&#39;, component: AboutHomeComponent }, // , useAsDefault: true}, // coming soon
  { path: &#39;/item/:id&#39;, component: AboutItemComponent }
])
export class AboutComponent { }
{% endraw %}
</code>
</pre>

So the first part in our about template our new `[routerLink]`'s have a second parameter of the id value ex: `['/about/item', 2]`. 
This allows us to pass in parameters to the router. Now taking a look at the route decorator
we now have `'/item/:id'` the `:` denotes that this is a route parameter and the router should get the value
in the URL. So now lets take a look at the `AboutItemComponent` and see how we can get the id from the URL.

<pre class="language-javascript">
<code>
{% raw %}
@Component({
  selector: &#39;about-item&#39;,
  template: `&lt;h3&gt;About Item Id: {{id}}&lt;/h3&gt;`
})
class AboutItemComponent { 
  id: any;
  constructor(routeSegment: RouteSegment) {
    this.id = routeSegment.getParam(&#39;id&#39;);
  }
}
{% endraw %}
</code>
</pre>

We import the `RouteSegment` class and inject it into our component. Note this is yet to be documented as of RC1.
Now we can pass in the route param name that we defined in the parent route to get the id value in the URL. 
Then we set the value to a property on our component and display it in our template. 
This value can be changed via the URL directly or the `routerLink`.

So now lets take a look at our diagram of our application's routes.

<img src="/assets/images/posts/2016-04-02-introduction-to-angular-2-routing/angular-2-router-tree-2.svg" alt="Example of Route Tree in Angular 2 with Route Parameters" class="full-width float-center col-6--max" />

## Recap

So we learned how to do basic routing between components, child/nested routing and route parameters. With these features mastered
you can quickly build large scalable Angular 2 apps in no time. As the new Release Candidate router is documented I will
update this post accordingly. Take a look at full working demo in the link below.