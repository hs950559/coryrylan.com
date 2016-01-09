---
layout: post
title: Javascript JQuery Ajax
description: A short code example of a Javascript Ajax call.
keywords: Cory Rylan, Javascript, Ajax, JSON
tags: javascript, jquery
date: 2012-08-29
permalink: /blog/javascript-ajax
---

This following example is a small snippet of code for a AJAX web service call to
a .NET service with JQuery. We will be sending a email and name to our web service to sign up
for a email subscription.

<pre class="language-javascript">
<code>
 /*JS Email Subscription AJAX web service*/ 
	callService();
	
    function callService() {
		// Here we will create our data object to send. In this example we are 
		// sending a email subscription request. We will send a email address and a name.
		var data = {
            email:  $("#emailTextBox").val(),
            name:   $("#nameTextBox").val()
        };
        
		$.ajax({
			type: "POST",
			url: "/myWebServices.asmx/emailSubscription",
			data: JSON.stringify({ "data": data }),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				if (response.d == true) {
					alert("You have been subscribed");
					//Do any work you want if the web service was successful. 
				}
				else {
					alert("Error");
					//Or throw a error
				}
			},
			error: function (error) {
				alert("error");
				//Or throw a error if service failed
			}
		});
    }
</code>
</pre>