---
layout: post
title: IOS Journey Load Multi-Threading
description: A short code example of multi-threading for IOS and Objective C
keywords: Cory Rylan, IOS, Objective C
tags: ios objective-c
date: 2012-08-20
permalink: /blog/ios-multi-threading
---

This following example is a small snippet of code I found to create a separate thread
from the main thread. This allows you to process information without holding the
main thread. For example if a web service is taking a while to load or respond if
on the main thread the application may shut down because it believes the application
has locked up. This allows the user interface to be usable while loading.

<pre class="language-clike">
<code>
// For asynchronous threading use the following and place code within brackets.
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,(unsigned long)NULL), ^(void) {
    // Example Thread separate until view loaded then push
    [self.navigationController pushViewController:myViewController animated:YES];
});

// For a separate thread place your method call in the following selector.
[NSThread detachNewThreadSelector: @selector(MyMethod) toTarget:self
withObject:nil];
// To break out of the current thread and process something on the main use the following:
[self performSelectorOnMainThread:@selector(yourMethod) withObject:nil waitUntilDone:YES];
</code>
</pre>