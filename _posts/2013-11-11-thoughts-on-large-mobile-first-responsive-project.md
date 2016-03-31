---
layout: post
title: Thoughts On Large Mobile First Responsive Project
description: My thoughts on a large mobile first responsive design project
keywords: Cory Rylan, Responsive Design
tags: web, rwd
date: 2013-11-11
permalink: /blog/thoughts-on-large-mobile-first-responsive-project
---

These are just some of my thoughts after working on a large mobile first responsive design project. These are some key points or highlights that I feel were most important in the project construction.

## Design

- Ensure a designer or dev with design experience designs features not devs or clients to prevent poor typography and missing design fundamentals
- Include front end engineers with the design aspects to be an advocate for performance but able to contribute to the design
- Wire frame the html and css mobile first then upwards defining your breakpoints
- Build all html and css then pass on to backend dev team to hook up to sever, allows clean markup and eliminated repetitive styles
- Have style guide created with html and css before project begins.
- Do not allow client to make last minute design changes, causes rendering bugs to be introduced unexpectedly

## Styles

- Use SASS, helps keep your code DRY
- Only 1 to 2 people on Styles ( CSS, SASS, LESS) ( issues will duplicate styles and poor render performance ) or Module out your application between designers

## Implementation

- Design mobile first and performance first
- Have a Performance Advocate
- Set performance rules and guidelines and follow thoroughly
- Set support guidelines such as minimum browser requirements for your application
- Be very cautious of browser sniffing as it add code complexity and can bite you later ( Bad sniff ). Feature detection is always better.
- Ensure that your server side framework compliments your front end code and does not work against it. If so then change it.
- Use progressive enhancement to build site resilience to failure such as lack of features or graceful degradation.
- Have no Javascript fall-backs for at least key features. Not just for no js users but for network resilience such as js failed to load because of weak mobile network.