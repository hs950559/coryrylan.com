---
layout: post
title: Angular 2 HTTP Multiple Requests with RxJS and mergeMap
description: Learn how to handle muttiple http requests with the Angular 2 Http service and RxJS mergeMap.
keywords: Cory Rylan, Angular 2, Angular, RxJS, Observables, Http
tags: Angular, RxJS
date: 2016-11-13
permalink: /blog/angular-http-multiple-requests-with-rxjs-merge-map-and-fork-join
demo: http://plnkr.co/edit/Yj93mh5ZnX6ONtaMQPAQ?p=preview
---

A common pattern we run into with single page apps is to gether up data from multiple API endpoints and 
when completed display the data to the user. Fetching multiple asynchronous requests and managing them
can be tricky but with the Angular 2 Http service and a little help from the included RxJS library 
it can be acomplished in just a couple of lines of code. There are multiple ways to handle multiple requests, 
they can be sequntial or in parralel. In this post we will cover both.

So lets start with a simple http request using the Angular 2 Http service.

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
    this.http.get('/api/people/1').subscribe(response => conole.log(response));
  }
}
{% endraw %}
</code>
</pre>

So in our app we have just a single component that pulls in Angular's Http service via Dependency Injection. Angular 
will give us a instance of the Http service when its sees the signature in our component's constructor. 

Now that we have the service we call the service to fetch some data from our test api. We do this in the `ngOnInit`. 
This is a life cycle hook where its ideal to fetch data. You can read more about `ngOnInit` in the <a href="#">docs</a>. 
For now lets focus on the http call. We can see we have `http.get()` that makes a GET request to `/api/people/1`. We then 
call `subscribe` to subscribe to the data when it comes back. When the data comes back we just log the
response to the console. So this is the simplest snippet of code to make a single request. Let's next look at 
making two requests.

## MergeMap Operator

In our next example we will have the following use case: We need to retreive a character from 
the <a href="https://swapi.co/">Star Wars API</a>. To start we have the id of the desired character we want to request.

When we get the character back we then need to fetch that character's homeworld from the same API but a different REST endpoint. 
This example is sequntial. Make one request then the next.

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
    this.http.get('/api/person/1')
      .map(res => res.json())
      .subscribe(person => {
        this.http.get(person.homeworld).subscribe(homeworld => {
          person.homeworld = homeworld;
          this.loadedPerson = person;
        });
      });
  }
}
{% endraw %}
</code>
</pre>

So looking at the `ngOnInit` method we see our http requests. First we make a request to get
a user from `/api/user/1`. We then call `.map()` instead of subscribe. This allows us to map over the 
value and pull out the raw JSON from the Response object. Once loaded we the make a second request a fetch the homeworld
of that particular person. Once we get the abilties we add it to the person object and set the <code>loadedPerson</code>
property on our component to display it on our template. This works but there are two things to notice here. First
we are starting to see this nested pyramid stucture in nesting our Observables which isnt very readable. second
our two requests were sequntial. We have the id already we can make the requests parralel and speed up loading the
data. 

## ForkJoin

So in this next example we are going to use an operator called <code>forkJoin</code>. If you are familliar with 
Promises this is very similar to <code>Promise.all()</code>. The <code>forkJoin()</code> operator allows us take a list
of Observables and execute the in parralel. Once every Observable in the list emits a value the <code>forkJoin</code>
with emit a single Observable value containing a list of all the resolved values from the Observables in the list.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/forkJoin';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  loadedPerson: {};
  constructor(private http: Http) { }
  
  ngOnInit() {
    const personId = 1;
    const homeworldId = 1;

    let person = this.http.get(`/api/person/${personId}`);
    let personHomeworld = this.http.get(`http://swapi.co/api/planets/${homeworldId}/`)

    Observable.forkJoin(person, personHomeworld)subscribe(results => {
      this.loadedPerson = [0].abilites = [1];
    });
  }
}
{% endraw %}
</code>
</pre>
