---
layout: post
title: The Performance Advocate
description: The Performance Advocate, web performance
keywords: Cory Rylan, Web Performance
tags: perfmatters, web
date: 2013-03-19
permalink: /blog/the-performance-advocate
---

I wanted to write this after working on a large mobile first responsive redesign.
Our project goal was to redesign a static desktop site to become a clean fast
responsive website to allow all devices to access our website.

Often our design process was interrupted will feature implementation and last minute changes.
A feature or design was added in all good intent but was never questioned about how this could
effect the site performance. Note to clarify I will refer site performance to front end
performance and not server side performance. Most of your site speed will be on client
side based on load, render and script performances.

We had multiple developers implementing multiple featured and page modifications.
Front end performance may not be your teams strong suit but should always be top priority
in you implementations. Not everyone knows the pitfalls with with client browsers.
To resolve this teams should always have a Performance Advocate.
This person should always question performance with any design or feature implementation.
Even if the idea seems solid, question it. Test it on multiple devices and networks.
Find the pitfalls and issues that could arise. Your Performance Advocate could commonly
fall under the job title as a Front End Engineer or Front End Dev Ops, ect.


The Performance Advocate should focus on these three main issues with every decision:

- Render Performance ( Perceived Load Time / Jank )
- Page Load Weight
- Script Performance

There should be strict performance standards in projects and the Performance
Advocate should help enforce these standards. These standards could be the following:

- Maximum Page load with no cache will not exceed 500kb anything else will be deferred
- All Javascript will be deferred after onload
- No inline JS
- CSS should never be more than 3 selectors deep or exceed 30kb total
- All static resources are minified and Gziped into single files on a CDN
- Our maximum onload requests is 5 everything else is deferred.

These are just a handful of example standards the team should establish.
Define them in the beginning of the project. They should become part of code reviews and testing.
Project performance standards should never get in the way of emergency bug fixes.
Performance guidelines should be at the project level. Some projects may require more
lenient or strict rules.  The advocate should check these standards with every feature.
If the feature breaks a rule then the team must meet to determine how the feature can be
implemented while meeting the guidelines. Without the advocate the end result could be a
slow product. If the advocate challenges this before code is even touched we can keep the
performance in the design from the beginning creating a fluid and fast application.


For features or systems already in place that did not meet the standards the development
team should set time or budget to fix these issues. The advocate or anyone should submit
issues, pull request or cases to fix the issues. Make it aware that your team is delivering
a sub par product by not fixing these problems. The idea of the performance advocate is NOT
that only one person should worry about performance, the ENTIRE TEAM should always focus on
performance. The advocate is a assigned role to ensure and enforce the performance standards of the project.

<br />
The breakdown
<br />
Design > Question > Implement > Test > Reflect
<br />

1. Design your feature or application
1. Question the performance issues and address the issues
1. Implement the code and correct any performance issues
1. Test, test your audience, mobile, low end devices, mobile networks, ect.
1. Reflect, did we meet the budgets and performance guidelines? If not back to the drawing board to come up with improvements.