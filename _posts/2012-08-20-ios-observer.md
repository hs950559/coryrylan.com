---
layout: post
title: IOS Journey the Observer
description: A short code example of observer object for IOS and Objective C
keywords: Cory Rylan, IOS, Objective C
tags: ios objective-c
date: 2012-08-20
permalink: /blog/ios-observer
---

The NSNotification observer allows you to add a observer which watches for a certain
event to trigger. This is useful if a view come into the display or the app is resumed
from being suspended in the background. This example is setting an observer to the
UIApplicationDidBecomeActiveNotification. When this event occurs the selector of
the method of your choosing will fire. This is useful if the app has been suspended
and need to update its information via web service.

<pre class="language-clike">
<code>
[[NSNotificationCenter defaultCenter] addObserver:self
    selector:@selector(someMethod:)
        name:UIApplicationDidBecomeActiveNotification object:nil];
</code>
</pre>