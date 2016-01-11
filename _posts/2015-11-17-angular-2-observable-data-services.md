---
layout: post
title: Angular 2 Observable Data Services
description: A look into Observables and how they can improve your Angular 2 data services.
keywords: Cory Rylan, Angular 2, JavaScript, Observables, Flux, TypeScript
tags: angular2, rxjs, javascript
date: 2015-11-17
updated: 2015-12-15
permalink: /blog/angular-2-observable-data-services
---

Angular 2 brings many new concepts that can improve our JavaScript applications. The first concept new to Angular is the use of Observables.
Observables are a proposed feature for ES2016 (ES7).
I wont go to in depth into Observables but will just cover some of the high level concepts.
The rest of this post will cover more data and application state management in a Angular 2 application. At the time of this writing Angular is on version <a href="https://splintercode.github.io/is-angular-2-ready/" target="_blank">Beta 0</a>.
The syntax of how Observables and their operators are imported may change.

Observables can help manage async data and a few other useful patterns. Observables are similar to Promises but with a few key differences. The first is Observables emit
multiple values over time. For example a Promise once called will always return one value or one error.
This is great until you have multiple values over time. Web socket/real time based data or event handlers can
emit multiple values over any given time. This is where Observables really shine. Other benefits are
Observables are cancel-able and can use array like operations. Lets look at a example where we subscribe
to an Observable.

<pre class="language-javascript">
<code>
todosService.todos$.subscribe(updatedTodos => {
    this.todos = updatedTodos;
});
</code>
</pre>

In this snippet our `todos$` property on our data service is an Observable. We can subscribe to this
Observable in our component. Each time we assign it to our component property updating the view.

Observables are treated like arrays. Each value over time is one item in the array.
This allows us to use array like methods called operators on our Observable such as `map`, `flatmap`,
`reduce`, ect. Next lets take a look at a data service using Observables and dig into some Observable operators.

In our example we will have a `TodosService`. Our todos service will have basic CRUD operations and a
Observable stream to subscribe to. This example we will use a REST based API but it can be converted to a real time socket based API with little effort.

<pre class="language-javascript">
<code>
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Todo} from 'app/interfaces';

@Injectable()
export class TodosService {
    todos$: Observable&lt;Array&lt;Todo&gt;&gt;;
    private _todosObserver: any;
    private _dataStore: {
        todos: Array&lt;Todo&gt;
    };
     
    constructor(private _http: Http) {
        // Create Observable Stream to output our data
        this.todos$ = new Observable(observer => 
            this._todosObserver = observer).share();
     
        this._dataStore = { todos: [] };
    }
}
</code>
</pre>

In Angular 2 we use RxJS a polyfill library for ES7 Observables. RxJS 5 is in alpha and is a peer dependency with Angular 2.
A slim Observable is used in Angular 2 core. The slim Observable does not have many of the useful operators that make RxJS so productive.
The Observable in Angular 2 is slim to keep the byte site of the library down. To use extra operators we import them like
so: `import 'rxjs/add/operator/share';`.
This change was introduced in <a href="https://github.com/angular/angular/blob/master/CHANGELOG.md#200-alpha48-2015-12-05" target="_blank">Alpha 48</a>.

In our todo service we have a few moving parts. First we have a private data store. This is where we store our
list of todos in memory. We can return this list immediately for faster rendering or when off-line. For now
its simply just holds onto our list of todos.

Next is our `todos$` Observable. It is common practice
in Reactive programing to end Observables/streams of data with a `$`. This is what our todo component
will subscribe to. Also we call the `share()` operator. This will allow multiple Subscribers to one
Observable. Since services in Angular 2 are singletons and tend to hold our data model/state we want to share
this data stream with all our components.

In our service we hold onto a Observer as a private property on our service. A Observer instance is generated when creating a
new Observable. The Observer allows us to push new values down our Observable data stream. Calling `next()`
will push a new value to all subscribers to our Observable stream.

<pre class="language-javascript">
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

<pre class="language-javascript">
<code>
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Todo} from 'app/interfaces';

@Injectable()
export class TodosService {
    todos$: Observable&lt;Array&lt;Todo&gt;&gt;;
    private _todosObserver: any;
    private _dataStore: {
        todos: Array&lt;Todo&gt;
    };
     
    constructor(private _http: Http) {
        // Create Observable Stream to output our data
        this.todos$ = new Observable(observer => 
            this._todosObserver = observer).share();
     
        this._dataStore = { todos: [] };
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

In our Component constructor we subscribe to the `todo$` data stream then call `load()` to load the latest into the stream.

<pre class="language-javascript">
<code>
    todosService.todos$.subscribe(updatedTodos => this.todos = updatedTodos);
    todosService.loadTodos();
</code>
</pre>

We could subsequently call delete and our stream will get a new list with one less todo. So lets add the rest of the code to add CRUD operations to our todos.
Now lets look at the todos service in its entirety.

<pre class="language-javascript">
<code>
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Todo} from 'app/interfaces';
     
@Injectable()
export class TodosService {
    todos$: Observable&lt;Array&lt;Todo&gt;&gt;;
    private _todosObserver: any;
    private _dataStore: {
        todos: Array&lt;Todo&gt;
    };
     
    constructor(private _http: Http) {
        this.todos$ = new Observable(observer => 
            this._todosObserver = observer).share();
     
        this._dataStore = { todos: [] };
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
     
    deleteTodo(todo: Todo) {
        this._http.delete(`/api/todos/${todo.id}`).subscribe(response => {
            this._dataStore.todos.forEach((t, index) => {
                if (t.id === todo.id) { this._dataStore.todos.splice(index, 1); }
            });
     
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not delete todo.'));
    }
}
</code>
</pre>

This pattern can also be used in Angular 1. RxJS and Observables are not just a Angular 2 feature. This may seem like a lot
of work for a simple todo app but scale this up to a very large app and Observables can really help manage our data. This pattern
follows the idea of unidirectional data flow. Meaning data flow is predictable and consistently comes from one source. 
If you have worked with <a href="https://facebook.github.io/flux/docs/overview.html" target="_blank">Flux</a> based architectures this may seem very familiar.

<figure class="col-9-contain">
<img src="/assets/images/posts/angular-2-observable-data-services/ng2data-serv.png" alt="Diagram of Angular 2 Data flow with Observables" class="full-width contain--9 block-center">
<figcaption class="text-center">Angular 2 data flow with Observables</figcaption>
</figure>

This pattern can ensure data is coming from one place in our application and that every component receives the latest version of that data through our data streams.
Our component logic simple by just subscribing to public data streams on our data services.
This service models to a REST based backend but could easily translate to a socket based service like <a href="https://www.firebase.com/" target="_blank">Firebase</a>
without having to change any components.

To set up loading extra operators for the Observable included in Angular 2 core check out this <a href="https://github.com/escardin/angular2-community-faq/blob/master/rxjs_operators.md" target="_blank">GitHub Doc</a>.
To get more in depth review of Observables check out <a href="https://vimeo.com/144625829">Rob Wormald's</a> intro to Observables or <a href="https://www.youtube.com/watch?v=KOOT7BArVHQ">Ben Lesh's</a> RxJS In-Depth.