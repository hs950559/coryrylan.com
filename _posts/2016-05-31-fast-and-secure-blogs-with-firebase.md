---
layout: post
title: Fast and Secure Blogs with Firebase
description: Learn how to create your own blog using a static site generator and Firebase
keywords: Cory Rylan, Firebase, Jekyll, Blog, Hosting
tags: Firebase, Jekyll
date: 2016-05-31
permalink: /blog/fast-and-secure-blogs-with-firebase
demo:
---

This post we will cover how to make a blog using a static site generator called [Jekyll](https://jekyllrb.com/) and use 
[Firebase](https://firebase.google.com/) a application backend service from Google. Firebase has many great tools for developers to use.
One of them is their free static CDN hosting. Firebase hosting is a great way to host static files like
JavaScript, CSS and HTML. This is great for single page apps that go well with their other services
such as their real time database. 

We wont get into the details of all of the awesomness of Firebase but we will use the Hosting service. 
with Firebase hosting we can host our blog and even get a SSL certificate to secure our site for free.
Now since our host is for static files it means they are really fast at downloading but it also means 
our site isnt dynamic or has a database. So we will use a static site generator.

Static site generators are great for sites that dont have content that changes often such as blogs.
One of the most popular static site generators is called Jekyll. 
Jekyll is designed specifically for blogs. There are many different static site generators with 
various pros and cons but we will start with Jekyll.

## Installation 

To start we will need to download Jekyll. 

<img src="/assets/images/posts/2016-05-31-fast-and-secure-blogs-with-firebase/firebase-logo.png" 
        alt="Firebase logo" style="background-color: #2d2d2d; width: 100%; max-width: 400px;" class="float-center" />