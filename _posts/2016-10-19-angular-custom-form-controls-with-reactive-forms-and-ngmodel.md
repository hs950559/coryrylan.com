---
layout: post
title: Angular 2 Custom Form Controls with Reactive Forms and NgModel
description: Learn how to build your own Angular 2 custom form input with reactive forms and ngModel.
keywords: Cory Rylan, Angular 2, Angular, Forms, NgModel
tags: Angular, Angular2
date: 2016-10-19
permalink: /blog/angular-custom-form-controls-with-reactive-forms-and-ngmodel
demo: http://plnkr.co/edit/Yj93mh5ZnX6ONtaMQPAQ?p=preview
---

Custom form controls/inputs are a common pattern in complex front end applications. Its common to want to encapsulate
HTML, CSS and accessibility in a component to make it easier to use in forms throughout the application. Common examples
of this are datepickers, switches, dropdowns, and typeaheads. All of these types of inputs are not native 
HTML inputs. We would like them to easily integrate into Angular's form system to make them easy to use
with other form inputs. 

In this post we will show how to create a switch component (`app-switch`) which is essentially 
a checkbox with additional CSS and markup to get a physical switch effect. This component will easily
integrate into the new Angular 2 Reactive Forms and ngModel. So first lets take a look at what our final
output will look like.

<video src="/assets/video/posts/2016-10-15-angular-custom-form-controls-with-reactive-forms-and-ngmodel/angular-custom-form-control.mp4" autoplay loop controls bp-layout="float-center 4--max" style="border: 2px solid #ccc;"></video>

So our switch component is essentially the behavior of a checkbox. It toggles a boolean value in our forms.
In this component we will use a native checkbox and some HTML and CSS to create the switch effect. In Angular 2
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
  @Input() label = 'switch';
  @Input('value') _value = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() { }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

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

So the first part of our decorator is defining our component template, CSS and selector. The API we are interested in is under providers.
Under providers we are telling the Angular DI to extend the existing `NG_VALUE_ACCESSOR` token and use SwitchComponent when requested. 
We then set multi to true. This mechanism enables `multi providers`. Essentially allowing multiple values for a single DI token. This allows 
easy extensions to existing APIs for devs. This essentially registers our custom component as a custom form control for Angular to
process in our templates. Next lets look at our component class.

<pre class="language-javascript">
<code>
{% raw %}
export class SwitchComponent implements ControlValueAccessor {
  @Input() label = 'switch';
  @Input('value') _value = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() { }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

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

We will go over the purpose of each one of these methods below. Our component takes in a couple of `@Inputs`. One is a label 
value so our component has the appropriate label markup and the second is for setting the component value. 
The `@Input('input')` allows us to take a input value named `input` and map it to the `_input` backing field. We will see the 
role of `onChange` and `onTouched` in a few. Next we have the following getters and setters.

<pre class="language-javascript">
<code>
{% raw %}
get value() {
  return this._value;
}

set value(val) {
  this._value = val;
  this.onChange(val);
  this.onTouched();
}
{% endraw %}
</code>
</pre>

We use getters and setters to set our value on our component in a backing field named `_value`. This allows us to call 
`this.onChange(val)` and `.onTouched()`. 

The next method `registerOnChange` passes in a callback function as a paramter for us to call whenever the value has changed.
We set the property `onChange` to the callback so we can call it whenever our setter on the `value` property is called.
The `registerOnTouched` method passes back a callback to call whenever the custom control has been touched by the user.
When we call this callback it notifies Angular to apply the appropriate CSS classes and validation logic to our control.

<pre class="language-javascript">
<code>
{% raw %}
registerOnChange(fn) {
  this.onChange = fn;
}

registerOnTouched(fn) { 
  this.onTouched = fn;
}

writeValue(value) {
  if (value) {
    this.value = value;
  }
}
{% endraw %}
</code>
</pre>

The last method to implement from the ControlValueAccessor is `writeValue`. This is called by Angular when the 
value of the control is set either by a parent component or form. The final method `switch()` is called on the click 
event triggered from our switch component template. 

## Summary
As a quick summary, custom form controls are simply components that implement the `ControlValueAccessor` interface. 
By implementing this interface our custom controls can now work with `ngModel` and the Reactive Forms API. 
Check out the working demo below which has the cooresponding CSS that creates the toggle animation effect.
