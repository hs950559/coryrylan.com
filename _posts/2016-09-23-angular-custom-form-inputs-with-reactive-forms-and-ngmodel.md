---
layout: post
title: Angular Custom Form Inputs with Reactive Forms and NgModel
description: Learn how to build your own Angular 2 custom form input with reactive forms and ngModel.
keywords: Cory Rylan, Angular 2, Angular, Forms, NgModel
tags: Angular, Angular2
date: 2016-09-23
permalink: /blog/angular-custom-form-inputs-with-reactive-forms-and-ngmodel
demo: http://plnkr.co/edit/Yj93mh5ZnX6ONtaMQPAQ?p=preview
---

Custom form inputs are a common pattern in complex front end applications. Its common to want to encapsulate
layout and CSS in a component to make it easier to use in forms throughout the application. Common examples
of this are datepickers, switches, dropdowns, and typeaheads. All of these types of inputs are not naitive 
HTML inputs. We would like them to easily integrate into Angular's form system to make them easy to use
with other form inputs. 

In this post we will show how to create a switch component which is essentially 
a checkbox with additional CSS and markup to get a physical switch effect. This component will easily
integrate into the new Angular 2 Reactive Forms and ngModel. So first lets take a look at what our final
output will look like.

VIDEO OF SWITCH

