---
layout: post
title: Angular 2 Observable Data Services
description: A look into Observables and how they can improve your Angular 2 data services.
keywords: Cory Rylan, Angular 2, JavaScript, Observables, Flux, TypeScript
tags: angular2, rxjs, javascript
date: 2015-11-17
updated: 2016-06-12
permalink: /blog/angular-2-observable-data-services
demo: http://plnkr.co/edit/yMBoVkxohwhPig5COgkU?p=preview
---

Angular 2 brings many new concepts that can can improve our JavaScript applications. The first new concept to Angular is the use of Observables.
Observables are a proposed feature for ES2016 (ES7).
I wont go in depth into Observables but will just cover some of the high level concepts. If you want a introduction to
Observables check out my screen cast. 

<a href="/blog/intro-to-rxjs-observables-and-angular-2" class="btn display-block float-center col-5--max">Intro to RxJS Observables and Angular 2</a>

The rest of this post will cover more data and application state management in a Angular 2 application. 
This post has been updated as of <a href="https://splintercode.github.io/is-angular-2-ready/" target="_blank">Release Candidate 1</a>.

Observables can help manage async data and a few other useful patterns. Observables are similar to Promises but with a few key differences. The first is Observables emit
multiple values over time. For example a Promise once called will always return one value or one error.
This is great until you have multiple values over time. Web socket/real-time based data or event handlers can
emit multiple values over any given time. This is where Observables really shine. 
Observables are used extensively in Angular 2. The new HTTP service and EventEmitter system 
are all Observable based. Lets look at an example where we subscribe to an Observable.

<pre class="language-typescript">
<code>
{% raw %}
todosService.todos$.subscribe(updatedTodos => {
  this.componentTodos = updatedTodos;
});

// OR if using the prefered async pipe 
// https://angular.io/docs/ts/latest/guide/pipes.html
this.todos = todosService.todos$;
{% endraw %}
</code>
</pre>

In this snippet our `todos$` property on our data service is an Observable. We can subscribe to this
Observable in our component. Each time there is a new value emitted from our Observable Angular updates the view.

<pre class="language-html">
<code>
{% raw %}
&lt;!-- Async pipe is used to bind an observable directly in our template --&gt;
&lt;div *ngFor=&quot;let todo of todos$ | async&quot;&gt;
  {{ todo.value }} &lt;button (click)=&quot;deleteTodo(todo.id)&quot;&gt;x&lt;/button&gt;
&lt;/div&gt;
{% endraw %}
</code>
</pre>

Observables are treated like arrays. Each value over time is one item in the array.
This allows us to use array like methods called operators on our Observable such as `map`, `flatmap`,
`reduce`, ect. In our service we will be using a special type of an Observable called a Subject.
A Subject allows us to push and pull values to the underlying Observable. We will see how this will
help us construct our service. 

In Angular 2 we use RxJS a polyfill/util library for the proposed Observables primitive in the next new version JavaScript. RxJS version 5 is in beta and is a peer dependency with Angular 2.
A slim Observable is used in Angular 2 core. The slim Observable does not have many of the useful operators that makes RxJS so productive.
The Observable in Angular 2 is slim to keep the byte site of the library down. To use extra operators we import them like
so: `import 'rxjs/add/operator/map';`.

In our example we will have a `TodosService`. Our todos service will have basic CRUD operations and a
Observable stream to subscribe to. This example we will use a REST based API but it could be converted 
to a real-time socket based API with little effort. Next lets take a look at a the constructor of our 
service.

<pre class="language-typescript">
<code>
{% raw %}
@Injectable() 
export class TodoService {
  private _todos$: Subject&lt;Todo[]&gt;; 
  private baseUrl: string;
  private dataStore: {  // This is where we will store our data in memory
    todos: Todo[]
  };
    
  // Using Angular DI we use the HTTP service
  constructor(private http: Http) {
    this.baseUrl  = 'http://56e05c3213da80110013eba3.mockapi.io/api';
    this.dataStore = { todos: [] };
    this._todos$ = &lt;Subject&lt;Todo[]&gt;&gt;new Subject();
  }

  get todos$() {
    return this._todos$.asObservable();
  }
}
{% endraw %}
</code>
</pre>

In our todo service we have a few moving parts. First we have a private data store. This is where we store our
list of todos in memory. We can return this list immediately for faster rendering or when off-line. For now
its simply just holds onto our list of todos. Since services in Angular 2 are singletons we can use them 
to hold our data model/state we want to share.

Next is our `todos$` Subject. Our Subject can recieve and emit new Todo lists. We don't want subscribers of
our service to be able to push new values to our subject without going through our CRUD methods. To prevent
the data from being altered we expose the Subject through a getter and cast it to an Observable. This will
allow components to receive updates but not push new values. We will see how that is done in further in 
the example. Note, it is common practice in reactive programing to end Observables/Subject 
streams of data with a `$`.

Now in our public methods we can load, create, update, and remove todos. Lets start off with loading the todos.

<pre class="language-typescript">
<code>
{% raw %}
@Injectable() 
export class TodoService {
  private _todos$: Subject&lt;Todo[]&gt;; 
  private baseUrl: string;
  private dataStore: {
    todos: Todo[]
  };
    
  constructor(private http: Http) {
    this.baseUrl  = 'http://56e05c3213da80110013eba3.mockapi.io/api';
    this.dataStore = { todos: [] };
    this._todos$ = &lt;Subject&lt;Todo[]&gt;&gt;new Subject();
  }
  
  get todos$() {
    return this._todos$.asObservable();
  }
    
  loadAll() {
    this.http.get(`${this.baseUrl}/todos`).map(response => response.json()).subscribe(data => {
      this.dataStore.todos = data;
      this._todos$.next(this.dataStore.todos);
    }, error => console.log('Could not load todos.'));
  }
}
{% endraw %}
</code>
</pre>

Notice instead of these methods returning new values of our todos list they update our internal data store. 

<pre class="language-typescript">
<code>
{% raw %}
  // Push a new copy of our todo list to all Subscribers.
  this._todos$.next(this.dataStore.todos);
{% endraw %}
</code>
</pre>
 
Once the data store of todos is updated we push the new list of todos with our private `_todos$` Subject. 
Now anytime we call one of these methods any component subscribed to our public `todos$` Observable stream 
will get a value pushed down and always have the latest version of the data.
This helps keeps our data consistent across our application.

In our component's <a href="https://angular.io/docs/ts/latest/tutorial/toh-pt4.html#!#the-ngoninit-lifecycle-hook" target="blank">`ngOnInit`</a> 
method we subscribe to the `todos$` data stream then call `load()` to load the latest into the stream. 
The `ngOnInit` is the ideal place for loading in data. You can read into the docs
and the various reasons why this is a best practice. 

<pre class="language-typescript">
<code>
{% raw %}
// In our todo component
ngOnInit() {
  this.todos$ = this.todoService.todos$; // subscribe to entire collection
  this.singleTodo$ = this.todoService.todos$
                         .map(todos => todos.find(item => item.id === '1'));  
                         // subscribe to only one todo 
    
  this.todoService.loadAll();    // load all todos
  this.todoService.load('1');    // load only todo with id of '1'
}{% endraw %}
</code>
</pre>

We could subsequently call remove and our stream will get a new list with one less todo. 
So lets add the rest of the code to add CRUD operations to our todos.
Now lets look at the todos service in its entirety.

<pre class="language-typescript">
<code>
{% raw %}
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

export interface Todo {
  id: any;
  createdAt: number;
  value: string;
}

@Injectable()
export class TodoService {
  private _todos$: Subject<Todo[]>;
  private baseUrl: string;
  private dataStore: {
    todos: Todo[]
  };

  constructor(private http: Http) {
    this.baseUrl  = 'http://56e05c3213da80110013eba3.mockapi.io/api';
    this.dataStore = { todos: [] };
    this._todos$ = &lt;Subject&lt;Todo[]&gt;&gt;new Subject();
  }

  get todos$() {
    return this._todos$.asObservable();
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/todos`).map(response => response.json()).subscribe(data => {
      this.dataStore.todos = data;
      this._todos$.next(this.dataStore.todos);
    }, error => console.log('Could not load todos.'));
  }

  load(id: any) {
    this.http.get(`${this.baseUrl}/todos/${id}`).map(response => response.json()).subscribe(data => {
      let notFound = true;

      this.dataStore.todos.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.todos[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.todos.push(data);
      }

      this._todos$.next(this.dataStore.todos);
    }, error => console.log('Could not load todo.'));
  }

  create(todo: Todo) {
    this.http.post(`${this.baseUrl}/todos`, JSON.stringify(todo))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.todos.push(data);
        this._todos$.next(this.dataStore.todos);
      }, error => console.log('Could not create todo.'));
  }

  update(todo: Todo) {
    this.http.put(`${this.baseUrl}/todos/${todo.id}`, JSON.stringify(todo))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.todos.forEach((todo, i) => {
          if (todo.id === data.id) { this.dataStore.todos[i] = data; }
        });

        this._todos$.next(this.dataStore.todos);
      }, error => console.log('Could not update todo.'));
  }

  remove(todoId: number) {
    this.http.delete(`${this.baseUrl}/todos/${todoId}`).subscribe(response => {
      this.dataStore.todos.forEach((t, i) => {
        if (t.id === todoId) { this.dataStore.todos.splice(i, 1); }
      });

      this._todos$.next(this.dataStore.todos);
    }, error => console.log('Could not delete todo.'));
  }
}
{% endraw %}
</code>
</pre>
 
## Overview

This pattern can also be used in Angular 1. RxJS and Observables are not just an Angular 2 feature. This may seem like a lot
of work for a simple todo app but scale this up to a very large app and Observables can really help manage our data and application state. 
This pattern follows the idea of unidirectional data flow. Meaning data flow is predictable and consistently comes from one source. 
If you have worked with <a href="https://facebook.github.io/flux/docs/overview.html" target="_blank">Flux</a> based architectures this may seem very familiar.

<figure>
<img src="/assets/images/posts/2015-11-17-angular-2-observable-data-services/ng2data-serv.png" alt="Diagram of Angular 2 Data flow with Observables" class="full-width col-9--max float-center">
<figcaption class="text-center">Angular 2 data flow with Observables</figcaption>
</figure>

This pattern can ensure data is coming from one place in our application and that every component receives the latest version of that data through our data streams.
Our component logic simple by just subscribing to public data streams on our data services. A working demo of a Observable data service can be found at this <a href="http://plnkr.co/edit/TiUasGdutCsll1nI6USC?p=preview" target="_blank">plnkr.co</a>
This service conforms to a REST based backend but could easily translate to a socket based service like <a href="https://www.firebase.com/" target="_blank">Firebase</a>
without having to change any components.

To set up loading extra operators for the Observable included in Angular 2 core check out this <a href="https://github.com/escardin/angular2-community-faq/blob/master/rxjs_operators.md" target="_blank">GitHub Doc</a>.
To get more in depth review of Observables check out <a href="https://vimeo.com/144625829">Rob Wormald's</a> intro to Observables or <a href="https://www.youtube.com/watch?v=KOOT7BArVHQ">Ben Lesh's</a> RxJS In-Depth.