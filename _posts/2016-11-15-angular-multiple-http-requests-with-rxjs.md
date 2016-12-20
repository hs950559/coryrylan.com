---
layout: post
title: Angular Multiple HTTP Requests with RxJS
description: Learn how to handle multiple http requests with the Angular Http service and RxJS mergeMap.
keywords: Cory Rylan, Angular 2, Angular, RxJS, Observables, Http
tags: Angular, RxJS
date: 2016-11-15
updated: 2016-12-19
permalink: /blog/angular-multiple-http-requests-with-rxjs
demo: http://plnkr.co/edit/w5MmyF4G3Hg1ivstU6Ev?p=preview
---

{% include ng-version.html %}

A common pattern we run into with single page apps is to gather up data from multiple API endpoints and 
then display the gathered data to the user. Fetching multiple asynchronous requests and managing them
can be tricky but with the Angular's Http service and a little help from the included RxJS library 
it can be accomplished in just a few of lines of code. There are multiple ways to handle multiple requests, 
they can be sequential or in parallel. In this post we will cover both.

Let's start with a simple http request using the Angular Http service.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {

  constructor(private http: Http) { }
  
  ngOnInit() {
    this.http.get('/api/people/1').subscribe(response => console.log(response));
  }
}
{% endraw %}
</code>
</pre>

In our app we have just a single component that pulls in Angular's Http service via Dependency Injection. Angular 
will give us a instance of the Http service when its sees the signature in our component's constructor. 

Now that we have the service we call the service to fetch some data from our test api. We do this in the `ngOnInit`. 
This is a life cycle hook where its ideal to fetch data. You can read more about `ngOnInit` in the <a href="#">docs</a>. 
For now lets focus on the http call. We can see we have `http.get()` that makes a GET request to `/api/people/1`. We then 
call `subscribe` to subscribe to the data when it comes back. When the data comes back we just log the
response to the console. So this is the simplest snippet of code to make a single request. Let's next look at 
making two requests.

## Map and Subscribe

In our next example we will have the following use case: We need to retrieve a character from 
the <a href="https://swapi.co/">Star Wars API</a>. To start we have the id of the desired character we want to request.

When we get the character back we then need to fetch that character's homeworld from the same API but a different REST endpoint. 
This example is sequential. Make one request then the next.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  loadedCharacter: {};
  constructor(private http: Http) { }
  
  ngOnInit() {
    this.http.get('/api/people/1')
      .map(res => res.json())
      .subscribe(character => {
        this.http.get(character.homeworld).subscribe(homeworld => {
          character.homeworld = homeworld;
          this.loadedCharacter = character;
        });
      });
  }
}
{% endraw %}
</code>
</pre>

Looking at the `ngOnInit` method we see our http requests. First we make a request to get
a user from `/api/user/1`. We then call `.map()` instead of subscribe. Map is a special function 
called an operator. This particular map allows us to map/iterate over the 
value and pull out the raw JSON from the Response object. Once loaded we the make a second request a fetch the homeworld
of that particular character. Once we get the homeworld we add it to the character object and set the `loadedCharacter`
property on our component to display it on our template. This works but there are two things to notice here. First
we are starting to see this nested pyramid structure in nesting our Observables which isnt very readable. second
our two requests were sequential. So lets say our use case is we just want to get the homeworld of our character and
to get that data we must load the character and then the home world. We can use a special operator to help
condense our code above.

## MergeMap

In this example we will use the `mergeMap` operator. Lets take a look at the code example first.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  homeworld: Observable<{}>;
  constructor(private http: Http) { }
  
  ngOnInit() {
    this.homeworld = this.http.get('/api/people/1')
      .map(res => res.json())
      .mergeMap(character => this.http.get(character.homeworld))
  }
}
{% endraw %}
</code>
</pre>

In this example we use the `mergeMap` also known as `flatMap` to map/iterate over the Observable values. 
So in our example when we get the homeworld we are getting back an Observable inside our character 
Observable stream. This creates a nested Observable in a Observable. The `mergeMap` operator helps 
us by subscribing and pulling the value out of the inner Observable and passing it back to the parent stream. 
This condenses our code quite a bit and removes the need of a nested subscription. This may take a little 
time to work through but with practice it can be a really useful tool in our RxJS tool belt. Next lets 
take a look at multiple parallel requests with RxJS.

## ForkJoin

In this next example we are going to use an operator called `forkJoin`. If you are familiar with 
Promises this is very similar to `Promise.all()`. The `forkJoin()` operator allows us take a list
of Observables and execute them in parallel. Once every Observable in the list emits a value the `forkJoin`
with emit a single Observable value containing a list of all the resolved values from the Observables in the list.
In our example we want to load a character and a characters homeworld. We already know what the ids are for these 
resources so we can request them in parallel.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  loadedCharacter: {};
  constructor(private http: Http) { }
  
  ngOnInit() {
    let character = this.http.get('https://swapi.co/api/people/1').map(res => res.json());
    let characterHomeworld = this.http.get('http://swapi.co/api/planets/1').map(res => res.json());

    Observable.forkJoin([character, characterHomeworld]).subscribe(results => {
      // results[0] is our character
      // results[1] is our character homeworld
      results[0].homeworld = results[1];
      this.loadedCharacter = results[0];
    });
  }
}
{% endraw %}
</code>
</pre>

In our example we capture the character and characterHomeworld Observable in variables. Observables are lazy
so they wont execute until someone subscribes. When we pass them into `forkJoin` the `forkJoin` operator will
subscribe and run each Observable, gathering up each value emitted and finally emitting a single array
value containing all the completed HTTP requests. This is a very common pattern with JavaScript UI programming.
With RxJS this is relatively easy compared to using traditional callbacks.

With the `mergeMap`/`flatMap` and `forkJoin` operators we can do pretty complex asynchronous 
code with only few lines of code. Check out the live example below!