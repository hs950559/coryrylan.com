---
layout: post
title: IOS Journey Load Animation
description: A short code example of a load animation for IOS and Objective C
keywords: Cory Rylan, IOS, Objective C
tags: ios, programming
date: 2012-08-20
permalink: /blog/ios-load-animation
---

This following example is a small snippet of code to create a small loading animation
for your IOS apps in Objective C.

<pre class="language-clike">
<code>
UIActivityIndicatorView *loadAnimation = [[UIActivityIndicatorView alloc] 
                                        
initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    
loadAnimation.center = CGPointMake(160, 220);
    
loadAnimation.hidesWhenStopped = YES;
   
[self.view addSubview:loadAnimation];
   
[loadAnimation startAnimating];
</code>
</pre>