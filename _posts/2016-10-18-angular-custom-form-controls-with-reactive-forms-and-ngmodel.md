---
layout: post
title: Angular Custom Form Controls with Reactive Forms and NgModel
description: Learn how to build your own Angular 2 custom form input with reactive forms and ngModel.
keywords: Cory Rylan, Angular 2, Angular, Forms, NgModel
tags: Angular, Angular2
date: 2016-10-18
permalink: /blog/angular-custom-form-controls-with-reactive-forms-and-ngmodel
demo: http://plnkr.co/edit/Yj93mh5ZnX6ONtaMQPAQ?p=preview
---

Custom form controls/inputs are a common pattern in complex front end applications. Its common to want to encapsulate
HTML, CSS and accessibility in a component to make it easier to use in forms throughout the application. Common examples
of this are datepickers, switches, dropdowns, and typeaheads. All of these types of inputs are not naitive 
HTML inputs. We would like them to easily integrate into Angular's form system to make them easy to use
with other form inputs. 

In this post we will show how to create a switch component (`app-switch`) which is essentially 
a checkbox with additional CSS and markup to get a physical switch effect. This component will easily
integrate into the new Angular 2 Reactive Forms and ngModel. So first lets take a look at what our final
output will look like.

<video src="/assets/video/posts/2016-10-15-angular-custom-form-controls-with-reactive-forms-and-ngmodel/angular-custom-form-control.mp4" autoplay loop controls class="float-center col-4--max" style="border: 2px solid #ccc;"></video>

So our switch component is essentially the behavior of a checkbox. It toggles a boolean value in our forms.
In this component we will use a naitive checkbox and some HTML and CSS to create the switch effect. In Angular 2
there are two different ways to interact with form controls/inputs. The first recommended default is the 
Reactive Form API and the other is the NgModel. We will use a special API Angular exposes to allow us to 
support both API interactions with our custom switch component.

## Using Reactive Forms

The Reactive Forms API allows us to explicitly create forms in our TypeScript. This allows us to keep form logic
and validation logic in the TypeScript and our of our templates. With the Reactive Forms API we use a valid form with a 
submit event that is triggered by the user. So lets take a quick look at how a form would look with our custom `app-switch` component.

<pre class="language-html">
<code>
{% raw %}
&lt;h3&gt;Reactive Forms&lt;/h3&gt;
&lt;form [formGroup]=&quot;myForm&quot; (submit)=&quot;submit()&quot;&gt;
  &lt;app-switch formControlName=&quot;mySwitch&quot; [label]="'My Switch'" &gt;&lt;/app-switch&gt;
  &lt;button&gt;Submit&lt;/button&gt;
&lt;/form&gt;
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  myForm: FormGroup
  
  constructor(private formBuilder: FormBuilder) { }
  
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      mySwitch: [true]
    });
  }
  
  submit() {
    alert(`Value: ${this.myForm.controls.on.value}`);
    console.log(`Value: ${this.myForm.controls.on.value}`);
  }
}
{% endraw %}
</code>
</pre>

So we can see our custom `app-switch` work seamlessly with the Reactive Forms/Form Builder API. To learn more about this API check out this post:
<a href="/blog/angular-2-form-builder-and-validation-management">Angular 2 Form Builder and Validation Management</a>.

## Using NgModel

NgModel allows us to bind to an input with traditional 2 way data binding similar to Angular 1. While not recommended
for forms this is handy for simple interactions such as toggling the visiibility of some UI.

<pre class="language-html">
<code>
{% raw %}
&lt;h3&gt;NgModel&lt;/h3&gt;
&lt;app-switch [(ngModel)]=&quot;value&quot; [label]="'My Switch'"&gt;&lt;/app-switch&gt;&lt;br /&gt;
&lt;strong&gt;Value:&lt;/strong&gt; {{value}}
{% endraw %}
</code>
</pre>

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  value = false;
  
  constructor() { }
}
{% endraw %}
</code>
</pre>

So now that we see what our custom form control looks like when using with Angular's two 
different form API lets dig into the code for `app-switch`.

## Building a Custom Form Control

So first lets take a look at the template for out custom form control `app-switch`.

<pre class="language-html">
<code>
{% raw %}
&lt;div (click)=&quot;switch()&quot; class=&quot;switch&quot; [ngClass]=&quot;{ &#39;checked&#39;: value }&quot; [attr.title]=&quot;label&quot;&gt;
  &lt;input type=&quot;checkbox&quot; class=&quot;switch-input&quot; [value]=&quot;value&quot; [attr.checked]=&quot;value&quot; [attr.aria-label]=&quot;label&quot;&gt;
  &lt;span class=&quot;switch-label&quot; data-on=&quot;On&quot; data-off=&quot;Off&quot;&gt;&lt;/span&gt;
  &lt;span class=&quot;switch-handle&quot;&gt;&lt;/span&gt;
&lt;/div&gt;
{% endraw %}
</code>
</pre>

So in our template we have a few dynamic properties and events. We have a click event to toggle our value. We also bind to the value to set our check box 
value and our CSS class for styles. In the post we wont cover the CSS file for this component but you can dig into the source code in the 
working example demo at the end of this post. Next lets take a look at the `app-switch` component code and dig into the API.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: 'app/switch.component.html',
  styleUrls: ['app/switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.propagateChange(val);
  }

  @Input() label = 'switch';
  @Input('value') _value = false;
  propagateChange: any = () => { };

  constructor() { }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  switch() {
    this.value = !this.value;
  }
}

{% endraw %}
</code>
</pre>

So theres a lot going on here so lets break it down. First our imports and `@Component` decorator.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: 'app/switch.component.html',
  styleUrls: ['app/switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
{% endraw %}
</code>
</pre>

So the fisrt part of our decorator is defining our component template, css and selector. The API we are interested in is under providers.
Under providers we are telling the Angular DI to extend the existing `NG_VALUE_ACCESSOR` token and use SwitchComponent when requested. 
We then set multi to true. This mechanisim enables `multi providers`. Essentailly allowing multiple values for a single DI token. This allows 
easy extensions to existing APIs for devs. Next lets look at our component class.

<pre class="language-javascript">
<code>
{% raw %}
export class SwitchComponent implements ControlValueAccessor {
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.propagateChange(val);
  }

  @Input() label = 'switch';
  @Input('value') _value = false;
  propagateChange: any = () => { };

  constructor() { }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  switch() {
    this.value = !this.value;
  }
}
{% endraw %}
</code>
</pre>

So the first part of our class is the `ControlValueAccessor` interface we are extending. The `ControlValueAccessor`
interface looks like this:

<pre class="language-javascript">
<code>
{% raw %}
export interface ControlValueAccessor {
  writeValue(obj: any) : void
  registerOnChange(fn: any) : void
  registerOnTouched(fn: any) : void
}
{% endraw %}
</code>
</pre>

The `ControlValueAccessor` `writeValue` method is called whenever we need to set the control value of our component. 
The second `registerOnChange` fires whenever the view value is updated. This mechanisim notifies our form to update its 
values. The last `registerOnTouched` is called when the custom control is touched. For our use we will only implements
`writeValue` and `registerOnChange`.

## Summary
