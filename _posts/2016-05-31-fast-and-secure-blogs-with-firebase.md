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

<img src="/assets/images/posts/2016-05-31-fast-and-secure-blogs-with-firebase/firebase-logo.png" 
        alt="Firebase logo" style="background-color: #2d2d2d; width: 100%; max-width: 400px;" class="float-center" />

We wont get into the details of all of the awesomness of Firebase but we will use the Hosting service. 
With Firebase hosting we can host our blog and even get a SSL certificate to secure our site for free.
Now since our host is for static files it means they are really fast at downloading but it also means 
our site isnt dynamic or has a database. So we will use a static site generator.

Static site generators are great for sites that dont have content that changes often such as blogs.
One of the most popular static site generators is called Jekyll. 
Jekyll is designed specifically for blogs. There are many different static site generators with 
various pros and cons but we will start with Jekyll.

## Installation Jekyll

To start we will need to download Jekyll. To install and create a new project run the following commands:
If you are running windows there is a little more installation work you can read about [here](https://jekyllrb.com/docs/windows/).
<pre class="language-javascript">
<code>
{% raw %}
gem install jekyll
jekyll new my-awesome-site
cd my-awesome-site
jekyll serve
{% endraw %}
</code>
</pre>

Now that we have created our site lets run it locally by running <code>jekyll serve</code>. Now you should see something similar to this:

<img src="/assets/images/posts/2016-05-31-fast-and-secure-blogs-with-firebase/jekyll-site.png" 
        alt="Example Jekyll Site" class="float-center col-8--max" />
        
Jekyll has a built-in templating system that allows us to create reusable templates and use markdown files for our blog posts. 
I won't go into the details of how Jekyll all works but I recommend checking out the getting started page
on the [Jekyll docs](https://jekyllrb.com/docs/home/). To prepare our blog for deployment we will run one last command
<code>jekyll build</code>. This will generate our site and place it into the <code>_site</code> directory. Note, any static site generator 
will work great with Firebase Hosting.

## Deploying with Firebase

Jekyll is commonly used with Github but using Firebase Hosting we get some added benefits such as SSL certificates, fast CDN, and URL redirect support.
So now that we have our blog built and it's ready to go live lets set up a new Firebase app.

If you don't already have an account sign up for a free Firebase account at [firebase.google.com](https://firebase.google.com/). Once you are signed up
head over to the [app console](https://console.firebase.google.com/).

<img src="/assets/images/posts/2016-05-31-fast-and-secure-blogs-with-firebase/firebase-console.png" 
        alt="Firebase Console" class="float-center col-8--max" />
        
Select "Create New Project". Once created click the "Hosting" tab on the left and then select the "Get Started" button. To deploy we will need 
to install the Firebase CLI tool. To install make sure to have the latest [NodeJS](https://nodejs.org) installed and then run <code>npm install -g firebase-tools</code>.