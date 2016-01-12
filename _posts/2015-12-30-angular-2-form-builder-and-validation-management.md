---
layout: post
title: Angular 2 Form Builder and Validation Management
description: Learn about the new FormBuilder and create a custom component to manage form validation in Angular 2.
keywords: Cory Rylan, Angular 2, AngularJS, TypeScript, JavaScript
tags: angular2, typescript
date: 2015-12-30
permalink: /blog/angular-2-form-builder-and-validation-management
---

Angular 1 has the handy <a href="https://docs.angularjs.org/api/ngMessages/directive/ngMessages" target="_blank">ngMessages</a> modules to help manage error messages and validation in forms.
This post I’ll show how to build a custom messages component in Angular 2 to easily manage validation similar to ng1’s ngMessages.

Angular 2 has a new helper Class called <code>FormBuilder</code>. <code>FormBuilder</code> allows us to explicitly declare forms in our components.
This allows us to also explicitly list each form control’s validators.

In our example we are going to build a simple subscription form with two inputs, name and email.

    
<img src="/assets/images/posts/angular-2-form-builder-and-validation-management/form-1.jpg" alt="A simple user form." class="full-width contain--5" />

We will start with creating our Form with the FormBuilder class on our root application component.

<pre class="language-typescript">
<code>
import {Component} from 'angular2/core';
import {FORM_PROVIDERS, FormBuilder, Validators} from 'angular2/common';
import {bootstrap} from 'angular2/platform/browser';
import {ControlMessages} from './control-messages.component';
import {ValidationService} from './validation.service';
     
@Component({
  selector: 'demo-app',
  templateUrl: 'src/app.html',
  directives: [ControlMessages]
})
export class App {
  userForm: any;
  
  constructor(private _formBuilder: FormBuilder) {  
    this.userForm = this._formBuilder.group({
        'name': ['', Validators.required],
        'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])
    });
  }
  
  saveUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      alert(`Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`);
    }
  }
}
bootstrap(App, [
  FORM_PROVIDERS
]);
</code>
</pre>

Here is our root app component. We are importing a few modules we need to be aware of.
First is our `FORM_PROVIDERS`. This allows us to use Angular 2 forms in our templates as
Forms are a separate module from the core library. Next is our `FormBuilder` class.
We inject it through our App component constructor. In our constructor is the following:
    
<pre class="language-typescript">
<code>
this.userForm = this._formBuilder.group({
    'name': ['', Validators.required],
    'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])
});
</code>
</pre>

This creates a new form with our desired controls. The first parameter in the control we leave empty as this
lets you initialize your form control with a value. The second parameter can be a list of Validators.
Angular has some built in Validators such as `required`. In this example we have our own Validation Service
with a few more custom Validators as well. Now that we have our `userForm` created lets take a look at our form.
    
<pre class="language-markup">
<code>
&lt;form [ngFormModel]=&quot;userForm&quot; (submit)=&quot;saveUser()&quot;&gt;
    &lt;label for=&quot;name&quot;&gt;Name&lt;/label&gt;
    &lt;input ngControl=&quot;name&quot; id=&quot;name&quot; #name=&quot;ngForm&quot; /&gt;
    &lt;div [hidden]=&quot;name.valid&quot;&gt;Required&lt;/div&gt;
  
    &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;
    &lt;input ngControl=&quot;email&quot; id=&quot;email&quot; #email=&quot;ngForm&quot; /&gt;
    &lt;div [hidden]=&quot;email.valid&quot;&gt;Invalid&lt;/div&gt;
  
    &lt;button type=&quot;submit&quot; [disabled]=&quot;!userForm.valid&quot;&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</code>
</pre>

We could do something like this example where we show and hide based on input properties.
We can create template variables with the `#` syntax. This would work fine but what if
our form grows with more controls? Or what if we have multiple validators on our form
controls like our email example? Our template will continue to grow and become more and more complex.

So lets look at a custom component that helps abstract our validation logic out of our forms.
Here is the same form but with our new component.
    
<pre class="language-markup">
<code>
&lt;form [ngFormModel]=&quot;userForm&quot; (submit)=&quot;saveUser()&quot;&gt;
    &lt;label for=&quot;name&quot;&gt;Name&lt;/label&gt;
    &lt;input ngControl=&quot;name&quot; id=&quot;name&quot; /&gt;
    &lt;control-messages control=&quot;name&quot;&gt;&lt;/control-messages&gt;
    
    &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;
    &lt;input ngControl=&quot;email&quot; id=&quot;email&quot; /&gt;
    &lt;control-messages control=&quot;email&quot;&gt;&lt;/control-messages&gt;
    
    &lt;button type=&quot;submit&quot; [disabled]=&quot;!userForm.valid&quot;&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</code>
</pre>

Here our control-messages component takes in a name of the control input to check its validation.
This is what the rendered form looks like with our validation.

<img src="/assets/images/posts/angular-2-form-builder-and-validation-management/form-2.jpg" alt="Form with validation triggered" class="full-width contain--5" />

Here is the example code for our control-messages component.
    
<pre class="language-typescript">
<code>
{% raw %}
import {Component, Host} from 'angular2/core';
import {NgFormModel} from 'angular2/common';
import {ValidationService} from './validation.service';
     
@Component({
    selector: 'control-messages',
    inputs: ['controlName: control'],
    template: `&lt;div *ngIf=&quot;errorMessage !== null&quot;&gt;{{errorMessage}}&lt;/div&gt;`
})
export class ControlMessages {
    controlName: string;
    constructor(@Host() private _formDir: NgFormModel) { }
     
    get errorMessage() {
        // Find the control in the Host (Parent) form
        let c = this._formDir.form.find(this.controlName);
     
        for (let propertyName in c.errors) {
	        // If control has a error
            if (c.errors.hasOwnProperty(propertyName) && c.touched) {
 		        // Return the appropriate error message from the Validation Service
                return ValidationService.getValidatorErrorMessage(propertyName);
            }
        }
        
        return null;
    }
}
{% endraw %}
</code>
</pre>

So our control-messages component looks at the form and form controller to determine
if any errors exist on that control. If an error does exist it looks for that error
in our validation service. We store what messages we would like to show in a central
location in the validation service so all validation messages are consistent application wide.

Here is an example of our validation service:

<pre class="language-typescript">
<code>
    export class ValidationService {
     
    static getValidatorErrorMessage(code: string) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.'
        };
        return config[code];
    }

    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }
     
    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }
     
    static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
}
</code>
</pre>

In our service we have our custom validators and a list of error messages with corresponding text that should
be shown in given use case.

Our control-messages component can now be used across our application and help prevent us from writing extra markup
and template logic for validation messages. There is a working demo of this post on <a href="http://plnkr.co/edit/6RkM0eRftf3KQpoDCktz?p=preview" target="_blank">plunkr</a>.
Read more about Angular 2 forms in the <a href="https://angular.io/docs/ts/latest/guide/forms.html" target="_blank">documentation</a>.