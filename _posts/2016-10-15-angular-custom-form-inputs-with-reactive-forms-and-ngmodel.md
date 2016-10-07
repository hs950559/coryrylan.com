---
layout: post
title: Angular Custom Form Inputs with Reactive Forms and NgModel
description: Learn how to build your own Angular 2 custom form input with reactive forms and ngModel.
keywords: Cory Rylan, Angular 2, Angular, Forms, NgModel
tags: Angular, Angular2
date: 2016-10-15
permalink: /blog/angular-custom-form-inputs-with-reactive-forms-and-ngmodel
demo: http://plnkr.co/edit/Yj93mh5ZnX6ONtaMQPAQ?p=preview
---

Custom form inputs are a common pattern in complex front end applications. Its common to want to encapsulate
HTML, CSS and accessibility in a component to make it easier to use in forms throughout the application. Common examples
of this are datepickers, switches, dropdowns, and typeaheads. All of these types of inputs are not naitive 
HTML inputs. We would like them to easily integrate into Angular's form system to make them easy to use
with other form inputs. 

In this post we will show how to create a switch component which is essentially 
a checkbox with additional CSS and markup to get a physical switch effect. This component will easily
integrate into the new Angular 2 Reactive Forms and ngModel. So first lets take a look at what our final
output will look like.

VIDEO OF SWITCH

So our switch component is essentially the behavior of a checkbox. It toggles a boolean value in our forms.
In this component we will use a naitive checkbox and some HTML and CSS to create the switch effect. In Angular 2
there are two different ways to interact with form controls/inputs. The first recommended default is the 
Reactive Form API and the other is the NgModel. We will use a special API Angular exposes to allow us to 
support both API interactions with our custom switch component.

## Reactive Forms

The Reactive Forms API allows us to explicitly create forms in our TypeScript. This allows us to keep form logic
and validation logic in the TypeScript and our of our templates. 

## NgModel

NgModel allows us to bind to an input with traditional 2 way data binding similar to Angular 1. While not recommended
for forms this is handy for simple interaction such as toggling the visiibility of some UI.

## Summary

