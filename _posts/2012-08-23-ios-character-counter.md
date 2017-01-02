---
layout: post
title: IOS Character Counter
description: A short code example of a character counter for IOS and Objective C
keywords: Cory Rylan, IOS, Objective C
tags: ios objective-c
date: 2012-08-23
permalink: /blog/ios-character-counter
---

This following example is a small character counter that can keep track of the number
of characters in a text view that needs to be limited to a maximum amount of characters.

<pre class="language-clike">
<code>
//Only check if text field has been altered
-(void)textViewDidChange:(UITextView *)textView{
    //500 chars max 
    if([[textView text] length] > 500){
        //If max reached close keypad        
        [textView resignFirstResponder];
        //Append off extra chars       
        textView.text = [textView.text substringToIndex:500];
    }
    //Count and display amount of chars left
    CounterBoxLabel.text = [NSString stringWithFormat:@"Characters left: (%i)", 500 - [[textView text] length]]; 
}
</code>
</pre>