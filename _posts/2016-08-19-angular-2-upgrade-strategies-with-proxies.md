---
layout: post
title: Angular 2 Upgrade Strategies with Proxies
description: A overview of how to upgrade a large scale web application to Angular 2 with server side proxies.
keywords: Cory Rylan, Angular 2, ANgular 2 upgrade, Angular CLI, Proxies
tags: Angular2
date: 2016-08-19
permalink: /blog/angular-2-upgrade-strategies-with-proxies
demo:
---

Angular 2 is almost upon us and many are already starting to convert their existing apps to Angular 2. 
This post we are going to cover some ideas and techniques for upgrading a traditional server side application like ASP.NET, 
PHP, or Rails. The following techniques we at [Vintage Software](https://vintagesoftware.com) have used in production
with great success. These techniques are not just for Angular apps but can be applied to any web technology stack.
If you are looking to convert a existing Angular 1.x project I recommend 
looking at [ngUpgrade](https://angular.io/docs/ts/latest/guide/upgrade.html).

## Why JavaScript?

Many web applications are traditional server rendered pages. While reliable and simple it is difficult
to build polished high performing web apps without some use of JavaScript. Newer frameworks/libraries like Angular and React 
can use a combination of client and [server side rendering](https://universal.angular.io). This can offer us great user experiences but can be challenging 
to use in large existing projects.

Older types of traditional server render only apps are commonly difficult to integrate
with front end frameworks like Angular. With large projects and teams, mixing technologies and getting
them to work together can cause significant context shifting and overhead. 

## A solution?

What if we could make two separate projects, a pure Angular 2 application and keep our existing server application?
There could be some significant technical advantages. So how would we go about doing this? This can be achieved with
what is called proxies. A proxy is server that can retrieve assets and data from another server on the 
clients behalf.

<img src="/assets/images/posts/2016-08-19-angular-2-upgrade-strategies-with-reverse-proxies/proxy.svg" class="full-width col-7--max float-center" alt="Server Proxy" />

For our use case we want a particular type a of proxy called a reverse proxy. A reverse proxy allows us to have a proxy 
that can take in requests and route them to several different web applications. Example: `https://example.com/feature-1` 
can route to our traditional web application and `https://example.com/feature-2` can be routed to a new feature or converted feature
in our Angular 2 application. The client/browser stays on the same URL/Domain without ever knowing the proxy is requesting from
multiple servers/projects. So our server set up would look similar to this:

<img src="/assets/images/posts/2016-08-19-angular-2-upgrade-strategies-with-reverse-proxies/reverse-proxy.svg" class="full-width col-7--max float-center" alt="Reverse Server Proxy"/>

### Benefits

This set up has some great advantages and some disadvantages. The first advantage is that our projects are separated
so we don't have conflicting technology stacks which means less overhead. Webforms/MVC mixed with Angular 2? No thanks. 
Second, one of the biggest advantages, is that we can convert feature by feature and update URLs in our app as needed. 
This allows us to continually ship our app without a big rewrite. We can convert a old feature to Angular 2 and keep the 
original in production. If the new Angular 2 feature is shipped and stable in production we can then delete the old
version. We also have more flexibility and can now independently deploy each separate project as needed.

### Downsides

There are some downsides to this technique. One being common UI components may be duplicated across tech stacks. Ex: headers,
footers, and common UI elements like date pickers and modals. While there will be a period of duplication this does allow the
easier integration of technologies. Another downside is managing CSS between projects. We use Sass for managing our CSS which allows
us to pull common CSS into a common Sass directory. This allows each separate project can import the CSS that it needs without
having to duplicate the CSS in each project.

### Summary

At [Vintage Software](https://vintagesoftware.com) we have used these techniques to be able to divide a large monolithic
UI web app into three smaller micro UI web apps. We have used this breaking our large app into three smaller independently deployable apps 
consisting of ASP.NET, Angular 1.x and now Angular 2. This has allowed us to continue to iterate and ship while upgrading
our UI tech stack. We use .NET and IIS (Internet Information Services) to achieve this set up. 
Most backend technologies support this type of proxy setup. To read more of how to set this up with .NET check out
[this article](http://www.iis.net/learn/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing).