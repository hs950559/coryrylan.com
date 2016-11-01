---
layout: post
title: Angular 2 HTTP Multiple Requests with RxJS and mergeMap
description: Learn how to handle muttiple http requests with the Angular 2 Http service and RxJS mergeMap.
keywords: Cory Rylan, Angular 2, Angular, RxJS, Observables, Http
tags: Angular, RxJS
date: 2017-10-20
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
    this.http.get('/api/user/1').subscribe(response => conole.log(response));
  }
}
{% endraw %}
</code>
</pre>

So in our app we have just a single component that pulls in Angular's Http service via Dependency Injection. Angular 
will give us a instance of the Http service when its sees the signature in our component's constructor. 

Now that we have the service we call the service to fetch some data from our test api. We do this in the `ngOnInit`. 
This is a life cycle hook where its ideal to fetch data. You can read more about `ngOnInit` in the <a href="#">docs</a>. 
For now lets focus on the http call. We can see we have `http.get()` that makes a GET request to `/api/user/1`. We then 
call `subscribe` to subscribe to the data when it comes back. When the data comes back we just log the
response to the console. So this is the simplest snippet of code to make a single request. Let's next look at 
making two requests.

## MergeMap Operator

** Use the POKEMON API for example **
In our next example we will have the following use case: We need to retreive user notes from a REST API. 
To do this we have only the user ID so we must 
When we get the user back we then need to fetch that users notes from the same API but a different REST endpoint. This example is sequntial. 
Do one request then the next.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {

  constructor(private http: Http) { }
  
  ngOnInit() {
    this.http.get('/api/people/1')
      .map(res => res.data.person.id)
      .mergeMap(userId => this.http.get(`/api/user-notes/${userId}`))
      .subscribe(response => conole.log(response));
  }
}
{% endraw %}
</code>
</pre>

So looking at the `ngOnInit` method we see our http requests. First we make a request to get
a user from `/api/user/1`. We then call `.map()` instead of subscribe. This allows us to map over the 
value and pull out  