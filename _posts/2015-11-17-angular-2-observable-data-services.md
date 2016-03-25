---
layout: post
title: Angular 2 Observable Data Services
description: A look into Observables and how they can improve your Angular 2 data services.
keywords: Cory Rylan, Angular 2, JavaScript, Observables, Flux, TypeScript
tags: angular2, rxjs, javascript
date: 2015-11-17
updated: 2016-03-25
permalink: /blog/angular-2-observable-data-services
demo: http://plnkr.co/edit/wzocFwRHsCnu46kp8rpJ?p=preview
---

Angular 2 brings many new concepts that can can improve our JavaScript applications. The first new concept to Angular is the use of Observables.
Observables are a proposed feature for ES2016 (ES7).
I wont go in depth into Observables but will just cover some of the high level concepts. If you want a introduction to
Observables check out my screen cast. 

<a href="/blog/intro-to-rxjs-observables-and-angular-2" class="btn display-block float-center col-5--max">Intro to RxJS Observables and Angular 2</a>

The rest of this post will cover more data and application state management in a Angular 2 application. 
At the time of this writing Angular is on version <a href="https://splintercode.github.io/is-angular-2-ready/" target="_blank">Beta 1</a>.
This post has been updated as of <a href="https://splintercode.github.io/is-angular-2-ready/" target="_blank">Beta 12</a>.
The syntax of how Observables and their operators are imported may change.

Observables can help manage async data and a few other useful patterns. Observables are similar to Promises but with a few key differences. The first is Observables emit
multiple values over time. For example a Promise once called will always return one value or one error.
This is great until you have multiple values over time. Web socket/real-time based data or event handlers can
emit multiple values over any given time. This is where Observables really shine. 
Observables are used extensively in Angular 2. The new HTTP service and Event system 
are all Observable based. Lets look at an example where we subscribe to an Observable.

<pre class="language-typescript">
<code>
todosService.todos$.subscribe(updatedTodos => {
    this.componentTodos = updatedTodos;
});

// OR if using the prefered async pipe 
// https://angular.io/docs/ts/latest/guide/pipes.html
this.todos = todosService.todos$;
</code>
</pre>

In this snippet our `todos$` property on our data service is an Observable. We can subscribe to this
Observable in our component. Each time there is a new value emitted from our Observable Angular updates the view.

Observables are treated like arrays. Each value over time is one item in the array.
This allows us to use array like methods called operators on our Observable such as `map`, `flatmap`,
`reduce`, ect. Next lets take a look at a data service using Observables and dig into some Observable operators.

In our example we will have a `TodosService`. Our todos service will have basic CRUD operations and a
Observable stream to subscribe to. This example we will use a REST based API but it could be converted to a real-time socket based API with little effort.

<pre class="language-typescript">
<code>
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {Todo} from 'app/interfaces';

export class TodosService {
    todos$: Observable&lt;Todo[]&gt;;
    private _todosObserver: Observer&lt;Todo[]&gt;;
    private _dataStore: {
        todos: Todo[]
    };
     
    constructor(private _http: Http) {
        this._dataStore = { todos: [] };
        
        // Create Observable Stream to output our data
        this.todos$ = new Observable(observer => this._todosObserver = observer)
                        .startWith(this._dataStore.todos)
                        .share();
    }
}
</code>
</pre>

In Angular 2 we use RxJS a polyfill/util library for the proposed Observables primitive in the next new version JavaScript. RxJS version 5 is in alpha and is a peer dependency with Angular 2.
A slim Observable is used in Angular 2 core. The slim Observable does not have many of the useful operators that makes RxJS so productive.
The Observable in Angular 2 is slim to keep the byte site of the library down. To use extra operators we import them like
so: `import 'rxjs/add/operator/share';`.
This change was introduced in <a href="https://github.com/angular/angular/blob/master/CHANGELOG.md#200-alpha48-2015-12-05" target="_blank">Alpha 48</a>.

In our todo service we have a few moving parts. First we have a private data store. This is where we store our
list of todos in memory. We can return this list immediately for faster rendering or when off-line. For now
its simply just holds onto our list of todos.

Next is our `todos$` Observable. It is common practice
in Reactive programing to end Observables/streams of data with a `$`. This is what our todo component
will subscribe to. 

We call two operators after our Observable. The first is the `startWith` operator which initializes our Observable with a initial value of 
our data store. Next we call the `share()` operator. This will allow multiple Subscribers to one
Observable. Since services in Angular 2 are singletons and tend to hold our data model/state we want to share
this data stream with all our components.

In our service we hold onto a Observer as a private property on our service. A Observer instance is generated when creating a
new Observable and subscribing to it. The Observer allows us to push new values down our Observable data stream. Calling `next()`
will push a new value to all subscribers of the Observable stream.

<pre class="language-typescript">
<code>
    // Push a new copy of our todo list to all Subscribers.
    this._todosObserver.next(this._dataStore.todos);
</code>
</pre>
 
Now in our public methods we can load, create, update, and delete todos. Lets start off with loading the todos. Instead of these methods returning new
values of our todos list they update our internal data store. Once the data store of todos is updated we push
the new list of todos with our `todosObserver`. Now anytime we call one of these methods any component subscribed
to our `todos$` stream will get a value pushed down from the Observable data stream and always have the latest version of the data.
This also protects the data from being manipulated outside of our service and keeps our data consistent across our application.

<pre class="language-typescript">
<code>
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {Todo} from 'app/interfaces';

export class TodosService {
    todos$: Observable&lt;Todo[];&gt;;
    private _todosObserver: Observer&lt;Todo[]&gt;;
    private _dataStore: {
        todos: Todo[]
    };
     
    constructor(private _http: Http) {
        this._dataStore = { todos: [] };
        
        // Create Observable Stream to output our data
        this.todos$ = new Observable(observer =>  this._todosObserver = observer)
                            .startWith(this._dataStore.todos)
                            .share();
    }
     
    loadTodos() {
        this._http.get('/api/todos').map(response => response.json()).subscribe(data => {
            // Update data store
            this._dataStore.todos = data;
     
            // Push the new list of todos into the Observable stream
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not load todos.'));
    }
}
</code>
</pre>

In our component's <a href="https://angular.io/docs/ts/latest/tutorial/toh-pt4.html#!#the-ngoninit-lifecycle-hook" target="blank">`ngOnInit`</a> 
we subscribe to the `todo$` data stream then call `load()` to load the latest into the stream.

<pre class="language-typescript">
<code>
ngOnInit() {
    todosService.todos$.subscribe(updatedTodos => this.componentTodos = updatedTodos);
    todosService.loadTodos();
}
</code>
</pre>

We could subsequently call delete and our stream will get a new list with one less todo. So lets add the rest of the code to add CRUD operations to our todos.
Now lets look at the todos service in its entirety.

<pre class="language-typescript">
<code>
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

export interface Todo {
  id: number;
  createdAt: number;
  value: string;
}
     
export class TodosService {
    todos$: Observable&lt;Todo[]&gt;;
    private _todosObserver: Observer&lt;Todo[]&gt;;
    private _dataStore: {
        todos: Todo[];
    };
     
    constructor(private _http: Http) {
        this._dataStore = { todos: [] };
        
        this.todos$ = new Observable(observer =>  this._todosObserver = observer)
                            .startWith(this._dataStore.todos)
                            .share();
    }
     
    loadTodos() {
        this._http.get('/api/todos').map(response => response.json()).subscribe(data => {
            this._dataStore.todos = data;
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not load todos.'));
    }
     
    createTodo(todo: Todo) {
        this._http.post('/api/todos', todo)
            .map(response => response.json()).subscribe(data => {
            this._dataStore.todos.push(data);   
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not create todo.'));
    }
     
    updateTodo(todo: Todo) {
        this._http.put(`/api/todos/${todo.id}`, todo)
            .map(response => response.json()).subscribe(data => {
            this._dataStore.todos.forEach((todo, i) => {
                if (todo.id === data.id) { this._dataStore.todos[i] = data; }
            });
     
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not update todo.'));
    }
     
    deleteTodo(todoId: number) {
        this._http.delete(`/api/todos/${todoId}`).subscribe(response => {
            this._dataStore.todos.forEach((t, index) => {
                if (t.id === todo.id) { this._dataStore.todos.splice(index, 1); }
            });
     
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not delete todo.'));
    }
}
</code>
</pre>

##Overview

This pattern can also be used in Angular 1. RxJS and Observables are not just an Angular 2 feature. This may seem like a lot
of work for a simple todo app but scale this up to a very large app and Observables can really help manage our data. This pattern
follows the idea of unidirectional data flow. Meaning data flow is predictable and consistently comes from one source. 
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