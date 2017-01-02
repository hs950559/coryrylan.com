---
layout: post
title: Angular Form Builder and Validation Management
description: Learn about the new FormBuilder and create a custom component to manage form validation in Angular.
keywords: Cory Rylan, Angular, TypeScript, JavaScript
tags: angular typescript
date: 2015-12-30
updated: 2016-12-19
permalink: /blog/angular-form-builder-and-validation-management
demo: http://plnkr.co/edit/WTu5G9db3p4pKzs0WvW6?p=preview
---

{% include ng-version.html %}

Angular 1 has the handy <a href="https://docs.angularjs.org/api/ngMessages/directive/ngMessages" target="_blank">ngMessages</a> modules to help manage error messages and validation in forms.
This post I’ll show how to build a custom messages component in Angular to easily manage validation similar to ng1’s ngMessages.

Angular has a new helper Class called <code>FormBuilder</code>. <code>FormBuilder</code> allows us to explicitly declare forms in our components.
This allows us to also explicitly list each form control’s validators.

In our example we are going to build a small form with three inputs, user name, email and profile description.

    
<img src="/assets/images/posts/2015-12-30-angular-form-builder-and-validation-management/simple-form-1.png" alt="A simple user form." bp-layout="full-width 5--max" />

We will start with looking at our `app.module.ts` file.

<pre class="language-typescript">
<code>
{% raw %}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ControlMessagesComponent } from './control-messages.component';
import { ValidationService } from './validation.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    ControlMessagesComponent,
    AppComponent
  ],
  providers: [ ValidationService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
{% endraw %}
</code>
</pre>

In our `AppModule` we are registering our components and services for our application. Once registered we can bootstrap 
our `AppModule` for our application. For us to use the form features in this post we will use the `ReactiveFormsModule`.
To read more about `@NgModule` check out the [documentation](https://angular.io/docs/ts/latest/guide/ngmodule.html).
Now lets take a look at our `AppComponent`.

<pre class="language-typescript">
<code>
{% raw %}
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/validation.service';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {
  userForm: any;
  
  constructor(private formBuilder: FormBuilder) {
      
    this.userForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'profile': ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  saveUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      alert(`Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`);
    }
  }
}
{% endraw %}
</code>
</pre>

First we import the `FormBuilder` class. We inject it through our App component constructor. 
In our constructor is the following:
    
<pre class="language-typescript">
<code>
{% raw %}
this.userForm = this._formBuilder.group({
  'name': ['', Validators.required],
  'email': ['', [Validators.required, ValidationService.emailValidator]],
  'profile: ['', Validators.required]'
});
{% endraw %}
</code>
</pre>

This creates a new form with our desired controls. The first parameter in the control we leave empty as this
lets you initialize your form control with a value. The second parameter can be a list of Validators.
Angular has some built in Validators such as `required` and `minLength`. In this example we have our own Validation Service
with a few more custom Validators as well. Now that we have our `userForm` created lets take a look at our form.
    
<pre class="language-markup">
<code>
&lt;form [formGroup]=&quot;userForm&quot; (submit)=&quot;saveUser()&quot;&gt;
  &lt;label for=&quot;name&quot;&gt;Name&lt;/label&gt;
  &lt;input formControlName=&quot;name&quot; id=&quot;name&quot; #name=&quot;ngControl&quot; /&gt;
  &lt;div [hidden]=&quot;name.valid&quot;&gt;Required&lt;/div&gt;

  &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;
  &lt;input formControlName=&quot;email&quot; id=&quot;email&quot; #email=&quot;ngControl&quot; /&gt;
  &lt;div [hidden]=&quot;email.valid&quot;&gt;Invalid&lt;/div&gt;

  &lt;label for=&quot;profile&quot;&gt;Profile Description&lt;/label&gt;
  &lt;input formControlName=&quot;email&quot; id=&quot;profile&quot; #profile=&quot;ngControl&quot; /&gt;
  &lt;div [hidden]=&quot;profile.valid&quot;&gt;Invalid&lt;/div&gt;

  &lt;button type=&quot;submit&quot; [disabled]=&quot;!userForm.valid&quot;&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</code>
</pre>

We could do something like this example where we show and hide based on input properties.
We can create template variables with the `#` syntax. This would work fine but what if
our form grows with more controls? Or what if we have multiple validators on our form
controls like our email example? Our template will continue to grow and become more and more complex.

So lets look at building a custom component that helps abstract our validation logic out of our forms.
Here is the same form but with our new component.
    
<pre class="language-markup">
<code>
&lt;form [formGroup]=&quot;userForm&quot; (submit)=&quot;saveUser()&quot;&gt;
  &lt;label for=&quot;name&quot;&gt;Name&lt;/label&gt;
  &lt;input formControlName=&quot;name&quot; id=&quot;name&quot; /&gt;
  &lt;control-messages [control]=&quot;userForm.controls.name&quot;&gt;&lt;/control-messages&gt;

  &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;
  &lt;input formControlName=&quot;email&quot; id=&quot;email&quot; /&gt;
  &lt;control-messages [control]=&quot;userForm.controls.email&quot;&gt;&lt;/control-messages&gt;

  &lt;label for=&quot;profile&quot;&gt;Profile Description&lt;/label&gt;
  &lt;textarea formControlName=&quot;profile&quot; id=&quot;profile&quot;&gt;&lt;/textarea&gt;
  &lt;control-messages [control]=&quot;userForm.controls.profile&quot;&gt;&lt;/control-messages&gt;

  &lt;button type=&quot;submit&quot; [disabled]=&quot;!userForm.valid&quot;&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</code>
</pre>

Here our control-messages component takes in a reference of the control input to check its validation.
This is what the rendered form looks like with our validation.

<img src="/assets/images/posts/2015-12-30-angular-form-builder-and-validation-management/simple-form-2.png" alt="Form with validation triggered" bp-layout="full-width 5--max" />

Here is the example code for our control-messages component.
    
<pre class="language-typescript">
<code>
{% raw %}
import { Component, Input } from &#39;@angular/core&#39;;
import { FormGroup, FormControl } from &#39;@angular/forms&#39;;
import { ValidationService } from &#39;./validation.service&#39;;

@Component({
  selector: &#39;control-messages&#39;,
  template: `&lt;div *ngIf=&quot;errorMessage !== null&quot;&gt;{{errorMessage}}&lt;/div&gt;`
})
export class ControlMessages {
  errorMessage: string;
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) &amp;&amp; this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    
    return null;
  }
}
{% endraw %}
</code>
</pre>

So our control-messages component takes in an input property named control wich passes us a reference to a formControl. 
If an error does exist on the form control it looks for that error in our validation service.
We store what messages we would like to show in a central location in the validation service so all validation messages are consistent application wide.
Our validation service takes in a name of the error and an optional value parameter for more complex error messages.

Here is an example of our validation service:

<pre class="language-typescript">
<code>
{% raw %}
export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
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
{% endraw %}
</code>
</pre>

In our service we have our custom validators and a list of error messages with corresponding text that should
be shown in given use case. 

Our control-messages component can now be used across our application and help prevent us from writing extra markup
and template logic for validation messages.
Read more about Angular forms in the <a href="https://angular.io/docs/ts/latest/guide/forms.html" target="_blank">documentation</a>.