---
layout: post
title: IOS Web Service
description: A short code example of a web service for IOS and Objective C
keywords: Cory Rylan, IOS, Objective C
tags: ios, programming
date: 2012-08-08
permalink: /blog/ios-web-service
---

This following example is a small snippet of code I found to call a simple web service
and return it to a NSURL string. You will need to use a XML parser to parse your
web services data. This web service sends the request information in the url.

<pre class="language-clike">
<code>
-(BOOL)CallService:(NSString *)value
{
    // Call web service to verify a session object or string
    BOOL result = YES;
    
    // Create the objects for calling the web service
    NSString *buildURL = [NSString stringWithFormat:@@"http://www.splintercode.com/web-services/MyWebServices.asmx/myServiceCheck?IDReceived=%@@", ID];
    NSURL *url = [NSURL URLWithString:buildURL];
    
    //Call the request
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:url;
	cachePolicy:NSURLRequestReturnCacheDataElseLoad
    timeoutInterval:1];
    
    // Create the objects for parsing the xml data returned by web service
    NSData *data;
    NSURLResponse *response;
    NSError *error;
    
    // Call the web service
    xmlData = [NSURLConnection sendSynchronousRequest:urlRequest returningResponse:&response error:&error];
    
    NSXMLParser *parser = [[NSXMLParser alloc] initWithData:data];
    
    [parser setDelegate:self]; // You can create a parser method to remove any whitespaces or apending chars if needed
    
    reply = [[NSMutableString alloc]init];
    
    // Read the xml data returned by the web service
    [parser parse];
    if([reply isEqualToString:@@"yourErrorResponse"]) //If your service returned ect do this 
    {
        ErrorMessage = @@"Error";
        return NO;
    }
    
    if([reply isEqualToString:@@""] || reply == NULL) // Else if no reply do that, or use error object
    {
        //No reply from web service
        ErrorMessage = @@"Connection Error";
        return NO;
    }
    return result;	//Else return the result or error
}
//XML PARSER 
-(NSString)parser:(NSXMLParser *)parser foundCharacters:(NSString *)string
{
    reply = [NSString stringWithString:string];
    return reply;
}
</code>
</pre>