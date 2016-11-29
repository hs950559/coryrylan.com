---
layout: post
title: Build a Angular 2 modal dialog with Angular Animate
description: Learn how to build your own Angular 2 modal dialog with Angular Animate
keywords: Cory Rylan, Angular 2, Angular, Animate
tags: Angular, Angular2
date: 2016-09-19
permalink: /blog/build-a-angular-modal-dialog-with-angular-animate
demo: http://plnkr.co/edit/AuFMJVHpk9OaLr62puS1?p=preview
---

Angular is full fledged framework which provides a lot of functionality for developers right out of the box.
In this post we are going to build our own modal dialog in the latest Angular 2.x. This will be simplistic example compared to 
a modal dialog from a UI kit like [Kendo UI](http://www.telerik.com/kendo-angular-ui/). In our example 
we will learn how to use Angular Animate, two way data binding, and ngContent for easy integration into our application.
If you want to skip to the live code example check out the link at the bottom of the page. This post is slightly 
more advanced and assumes the basic knowledge of Angular 2 and its template syntax.
Here is a brief look at what our final component will look like.

<video src="/assets/video/posts/2016-15-09-build-a-angular-modal-dialog-with-angular-animate/angular-modal-dialog.mp4" autoplay loop controls bp-layout="float-center 5--max" style="border: 2px solid #ccc;"></video>

First lets start with our top level app component template. In this template we will have just a single button
to toggle our dialog to open and close. Here we will also see how we interact with our custom dialog in other components.

<pre class="language-html">
<code>
{% raw %}
&lt;button (click)=&quot;showDialog = !showDialog&quot; class=&quot;btn&quot;&gt;Open&lt;/button&gt;

&lt;app-dialog [(visible)]=&quot;showDialog&quot;&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;button (click)=&quot;showDialog = !showDialog&quot; class=&quot;btn&quot;&gt;Close&lt;/button&gt;
&lt;/app-dialog&gt;
{% endraw %}
</code>
</pre>

Looking at our app template we have a single button that toggles a `showDialog` property on our app component.
The next line is our `app-dialog` component. Notice the `[(visible)]="showDialog"` on our dialog component.
We are using the two way data binding syntax or also known as "bananas in a box". This binds the value of the `showDialog`
to the `app-dialog` and allows us to communicate to the `app-dialog` when to show and hide. 


Inside the `app-dialog` we have the content we would like to be displayed in our dialog. This is a feature called
ngContent. This allow content between component tags to be injected in specific parts of our `app-dialog` template.

## Modal Dialog Component

Lets take a look at the `app-dialog` template.

<pre class="language-html">
<code>
&lt;div [@dialog] *ngIf=&quot;visible&quot; class=&quot;dialog&quot;&gt;
  &lt;ng-content&gt;&lt;/ng-content&gt;
  &lt;button *ngIf=&quot;closable&quot; (click)=&quot;close()&quot; aria-label=&quot;Close&quot; class=&quot;dialog__close-btn&quot;&gt;X&lt;/button&gt;
&lt;/div&gt;
&lt;div *ngIf=&quot;visible&quot; class=&quot;overlay&quot; (click)=&quot;close()&quot;&gt;&lt;/div&gt;
</code>
</pre>

So our first line we see a interesting syntax `[@dialog]`. This is a special property syntax for the Angular Animations
to target specific elements. We will come back to this in a bit. The next line is an `ngIf` to toggle the 
visibility of our dialog.

Next we have the `ng-content` tag. This is where the content in our app template is injected and displayed. This
is the content that will be visible in our dialog. The last two parts are the close button and overlay of our dialog
that when clicked toggle the visible property on the dialog component. Next lets look at the `app-dialog` component.

<pre class="language-javascript">
<code>
import { 
  Component, OnInit, Input, Output, OnChanges, EventEmitter, 
  trigger, state, style, animate, transition } from &#39;@angular/core&#39;;

@Component({
  selector: &#39;app-dialog&#39;,
  templateUrl: &#39;app/dialog.component.html&#39;,
  styleUrls: [&#39;app/dialog.component.css&#39;],
  animations: [
    trigger(&#39;dialog&#39;, [
      transition(&#39;void =&gt; *&#39;, [
        style({ transform: &#39;scale3d(.3, .3, .3)&#39; }),
        animate(100)
      ]),
      transition(&#39;* =&gt; void&#39;, [
        animate(100, style({ transform: &#39;scale3d(.0, .0, .0)&#39; }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter&lt;boolean&gt; = new EventEmitter&lt;boolean&gt;();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
</code>
</pre>

So looking at our `app-dialog` component there is quite a bit going on the first few lines
are describing where our CSS and template files are. In our CSS file we just have some CSS
for the dialog box styles. The animations are controlled by Angular Animate. So lets take a look
at the `animations` property on the component decorator.

## Animation

<pre>
<code class="language-javascript">
animations: [
  trigger(&#39;dialog&#39;, [
    transition(&#39;void =&gt; *&#39;, [
      style({ transform: &#39;scale3d(.3, .3, .3)&#39; }),
      animate(100)
    ]),
    transition(&#39;* =&gt; void&#39;, [
      animate(100, style({ transform: &#39;scale3d(.0, .0, .0)&#39; }))
    ])
  ])
]
</code>
</pre>

The Angular Animation is based on the Web Animation API instead of traditional CSS. This allows 
fine grain control of our animation timing in JavaScript and great performance. The first line we have
a trigger value: `dialog`. This is the value that matches the `[@dialog]` property in our template.
When the trigger is seen in the template Angular will apply the animation to that element.

Next is the `transition` function. This takes in a value of how the animation should occur. In our example
we are using the `*` wildcard syntax which means in any state change of the applied element it should
trigger the animation. The first transition uses the `void` state which is applied to elements not yet in
the view. So when our `*ngIf` is active the element will enter into the view applying the transform
style on the next line. The `animate(100)` applies the style function over a time span of 100 milliseconds.

The second transition is very similar but uses `* => void` to apply the second animation when the element
leaves the view or is "void" of the view. Once applied we use the animate function and immediately apply the style transform to 
our dialog wrapping div.

## Component Data binding

Now lets look at the last half of our `app-dialog` component.

<pre class="language-javascript">
<code>
export class DialogComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter&lt;boolean&gt; = new EventEmitter&lt;boolean&gt;();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
</code>
</pre>

On our `app-dialog` we have a few properties. Using the `Input` and `Output` decorators we are 
defining the API for other components to interact with the `app-dialog`. The first input allows 
us to set the dialog to show or hide the close button, which is a common scenario for dialogs.

The input and output `visible` and `visibleChange` allows us to create custom two way binding
so we can toggle the visibility of the dialog. Why two way? Could we not just set the visibility from the 
app component with just the `[property]` syntax? Well if we keep it two way using the `EventEmitter` 
we can set the app `showDialog` property when the close button is clicked. This allows 
the `showDialog` property to stay in sync whether its the app component or the dialog component setting it. 
The `visibleChange` follows the Angular convention adding `Change` to the end for properties that are for 
two way data binding. If you are unfamiliar with the Angular 2 template syntax
I recommend checking out the [documentation](https://angular.io).

## Conclusion

The three main features we used, animations, ngContent, and two way data binding, when combined allows us
to create easy to use feature rich components. Check out the live working demo below!