---
layout: post
title: Introduction To Web Components
description: A intro to the new web component spec by building a simple tab component.
keywords: Cory Rylan, Web, HTML5, JavaScript, Software Development, Web Components, Shadow DOM
tags: html5, javascript, webcomponents
date: 2015-05-26
permalink: /blog/introduction-to-web-components
---

The web has had a long history of different ways to create components for our websites and web applications. Gone are the days where websites were
created of "pages". Websites and web application are more demanding than ever. Using components to create reusable code has
been goal that we haven't quite achieved. We have seen components like jQuery's plug-in api, Angular Directives, React components and more. They all
try to accomplish the same goal but do it in different ways. We need a common browser API standard.

One of the main issues in our components today are style conflicts. This is when our CSS or the imported component breaks CSS somewhere else.
Another is lack of native templating of HTML. Storing HTML templates on a page have only been possible by using script tags or other hacks.
The current component structures lack of semantic meaning. We end up with a big pile of div's that have little meaning.
Angular has tried to help this with its custom element directives.

The new HTML5 Web Component Specification is a collection of specifications that
when combined create a powerful web standard for creating reusable components.

<figure bp-layout="8--max float-center text-center">
    <img src="/assets/images/posts/2015-05-26-introduction-to-web-components/div-soup.jpg" alt="div soup" bp-layout="full-width" />
    <figcaption>Gmail's div soup</figcaption>
</figure>

### Custom Elements

So lets start digging into the new web component spec that will help solve some of these issues.
First is the custom elements spec. The HTML5 spec says custom elements can be used if the contain a hyphen.
This will prevent custom elements ever having a name collision with new native HTML elements.

<pre class="language-markup">
<code>
&lt;!-- Valid Custom Name --&gt;
&lt;my-component&gt;&lt;/my-component&gt;
         
&lt;!-- Invalid Name --&gt;
&lt;myComponent&gt;&lt;/myComponent&gt;
</code>
</pre>

Wouldn't it be great if we could see markup like this for something like a tab component?

<pre class="language-markup">
<code>
&lt;!-- Makes me happy :D --&gt;
&lt;ui-tabs&gt;
    &lt;ui-tab&gt;Tab 1&lt;/ui-tab&gt;
    &lt;ui-tab&gt;Tab 2&lt;/ui-tab&gt;
    &lt;ui-tab&gt;Tab 3&lt;/ui-tab&gt;
&lt;/ui-tabs&gt;
         
&lt;!-- Makes me sad :( --&gt;
&lt;div class=&quot;ui-tabs&quot;&gt;
    &lt;div class=&quot;ui-tab&quot;&gt;Tab 1&lt;/div&gt;
    &lt;div class=&quot;ui-tab&quot;&gt;Tab 2&lt;/div&gt;
    &lt;div class=&quot;ui-tab&quot;&gt;Tab 3&lt;/div&gt;
&lt;/div&gt;
</code>
</pre>

### Templates

Next is the new `<template>` tag. The `<template>` tag simply allows us to store any HTML or JavaScript
and have it completely ignored by the browser. This means the HTML will not render nor will any JavaScript execute.

<pre class="language-markup">
<code>
&lt;template&gt;
    &lt;div&gt;The browser does not show this&lt;/div&gt;
    &lt;script&gt;console.log('The browser will not run this.');&lt;/script&gt;
&lt;/template&gt;
</code>
</pre>

Inline templates can help us easily store HTML to clone into our components. Next is understanding the Shadow DOM.

### The Shadow DOM

Now the shadow DOM sounds like some cool cutting edge tech but really the idea has been around for a while.
The shadow DOM api helps encapsulate and hide the implementation of a given element. Let take a look at the video tag for an example.

<video controls style="height: 41px; width: 400px;"></video>

<pre class="language-markup">
<code>
&lt;video src=&quot;videofile.mp4&quot; controls&gt;&lt;/video&gt;
</code>
</pre>

The video tag is rather complex out of the box. We have multiple elements within it. There are buttons, ranges and some default styles.
If you go to Chrome's dev tool settings you can turn on "Show user agent shadow DOM" to be able to inspect the shadow DOM of the video element.

<img src="/assets/images/posts/2015-05-26-introduction-to-web-components/video-tag.jpg" alt="Inspection of the video element shadow DOM" bp-layout="8--max float-center text-center" />

As you can see the video tag is not just a single element but composed of its own HTML and CSS that is isolated and hidden
using the shadow DOM. Inspecting further you can see a input of type range that has its own shadow DOM composed of even more
elements. This is a very powerful concept that will allow us to encapsulate the implementation of a given custom element.

Shadow DOM also encapsulates CSS. This can be very helpful from preventing components having CSS collisions. Now the Shadow DOM can be pierced
and styled with a few special selectors. We will cover these special selectors later in our example component. The "light DOM" would be any
DOM that is not inside a existing shadow DOM.

### Tab Component Example Tutorial

Note this tutorial will use some of the newer ES6 JavaScript syntax features as they compliment well with Web Components.

So now that we have some of the basic down lets get into the specific api code. We are going to make a simple tab component. First we will
start with the basic markup structure.

<pre class="language-markup">
<code>
&lt;ui-tabs&gt;
    &lt;ui-tab tab-name=&quot;Tab 1&quot; visible=&quot;true&quot;&gt;
    Tab Content 1
    &lt;/ui-tab&gt;
    &lt;ui-tab tab-name=&quot;Tab 2&quot;&gt;
    Tab Content 2
    &lt;/ui-tab&gt;
    &lt;ui-tab tab-name=&quot;Tab 3&quot;&gt;
    Tab Content 3
    &lt;/ui-tab&gt;
&lt;/ui-tabs&gt;
</code>
</pre>

We would like a set of tabs and be able to easily insert our content into the component. The first step is to
create and register our custom elements. First lets start with `ui-tabs`. Web components encapsulate
the HTML and CSS but <strong>NOT</strong> the JavaScript of our component. So we will need to create a IIFE (Immediately Invoked Function Expression)
to encapsulate our JavaScript.

<pre class="language-javascript">
<code>
// ui-tabs register
(function() {
    'use strict';
    // Using a inline template instead of a template tag for brevity
	let template = `
        &lt;style&gt;&lt;/style&gt;
        &lt;content select="button"&gt;&lt;/content&gt;
        &lt;content select="ui-tab"&gt;&lt;/content&gt;
	`;
  
    // Create a HTML Element
    let UITabsProto = Object.create(HTMLElement.prototype);
         
    // Created Callback is called whenever a new element is created
    UITabsProto.createdCallback = function() {
        // Create a new Shadow Root and insert into our element
        let root = this.createShadowRoot();
        root.innerHTML = template;
    };
         
    // Register our new element
    document.registerElement('ui-tabs', {
        prototype: UITabsProto
    });
}());
</code>
</pre>

Here we are using the new Shadow DOM API to create a custom element and register it to the document. Instead of importing
a Template node we are just in-lining our template into our component. The `&lt;content&gt;&lt;/content&gt;` tag
allows us to create insertion points for our component. This is hepful for displaying content in our custom tags where we desire.
DOM nodes in our element are not directly styled by the web component. The content tag simply displays the DOM from the "light DOM" inside
our shadow DOM of our component. Next lets register our `ui-tab` element.

<pre class="language-javascript">
<code>
// ui-tab register
(function() {
    'use strict';
    let template = `
        &lt;style&gt;&lt;/style&gt;
        &lt;section role="tabpanel"&gt;
            &lt;content>&lt;/content&gt;
        &lt;/section&gt;
    `;
  
    let UITabProto = Object.create(HTMLElement.prototype);
         
    UITabProto.createdCallback = function() {
        let root = this.createShadowRoot();
        root.innerHTML = template;
    };
         
    document.registerElement('ui-tab', {
        prototype: UITabProto
    });
}());
</code>
</pre>

For now our templates wont contain any CSS we will get back to that later. Now lets add some dynamic HTML to create our tab buttons
based on how many tabs we have. For code brevity we will add our dynamic HTML and click events using jQuery. You can write this
is any DOM abstraction desired or just pure JavaScript. jQuery is <strong>NOT</strong> required. Ideally you would want your web 
components to not have to rely on third party libraries if possible.

<pre class="language-javascript">
<code>
// ui-tabs component events
(function() {
    'use strict';
    // Create tab buttons for each ui-tab
    $('ui-tabs').each(function() {
        $(this).find('ui-tab').each(function() {
            let buttonClassName = $(this).attr('visible') ? 'selected' : '';
      
            $(this).parent().append(`
                &lt;type="button" role="tab" data-target="${$(this).attr('tab-name')}" class="${buttonClassName}"&gt;
		            ${$(this).attr('tab-name')}
	            &lt;/button&gt;
	        `);
        });
    });
  
    // Bind click events for tab buttons
    $('ui-tabs > button').click(function(e) {
        e.preventDefault();
        let $selectedTab = $('[tab-name="' + $(this).data('target') + '"]');
    
        $(this).siblings('ui-tab').attr('visible', 'false');
        $(this).siblings('ui-tab').removeClass('selected');
    
        $(this).siblings('button').removeClass('selected');
        $(this).addClass('selected');
    
        $selectedTab.attr('visible', 'true');
    });
}());
</code>
</pre>

Now that we have our tabs dynamically created and click events registered we should have something similar looking to this.

<img src="/assets/images/posts/2015-05-26-introduction-to-web-components/tab-no-css.jpg" bp-layout="7--max float-center text-center" />

### Component Styles and CSS

No our component does not look very pretty but if you inspect the DOM you will see our shadow roots and click events all hooked up.
So now we can dig into the new CSS selectors for styling our web components. First we will style our `ui-tabs` element.

<pre class="language-javascript">
<code>
// ui-tabs register
(function() {
    'use strict';
    // Using a inline template instead of a template tag for brevity
	let template = `
        &lt;style&gt;
        :host {                    
            display: block;
			margin-bottom: 24px;
        }
    
        :host(.red) {
            border: 1px solid red;
        }
    
        ::content > button {
            background-color: #fff;
			border: 1px solid #fff;
            border: 0;
			padding: 3px 6px;
        }
		    
        ::content > button.selected {
			border: 1px solid #ccc;
			border-bottom: 1px solid #fff;
			padding: 5px 6px 4px 6px;
			margin-bottom: -1px;
		}
    
        ::content ui-tab {    
            display: block;
        }
        &lt;/style&gt;
        &lt;content select="button"&gt;&lt;/content&gt;
        &lt;content select="ui-tab"&gt;&lt;/content&gt;
	`;
  
    // Create a HTML Element
    let UITabsProto = Object.create(HTMLElement.prototype);
         
    // Created Callback is called whenever a new element is created
    UITabsProto.createdCallback = function() {
        // Create a new Shadow Root and insert into our element
        let root = this.createShadowRoot();
        root.innerHTML = template;
    };
         
    // Register our new element
    document.registerElement('ui-tabs', {
        prototype: UITabsProto
    });
}());
</code>
</pre>

Looking at the CSS here it may look very different from anything else you may have seen before.
The first selector `:host` styles the outer most element of our component.
In this case it is `<ui-tabs>`. The second selector `:host(.red)` is a extension onto our `:host`
selector. By passing in an argument selector we can style the host dependent if it contains a `.red` class. This is especially useful for theming
our components. Example we could have a `:host(.dark-theme)` or `:host(.light-theme)`.

The next selector is the `::content` selector. The `::content` selector allows us to style elements that are
displayed in our element. So in the `<ui-tabs>` we use `::content > button` to style the buttons. Next
here is our CSS for the `<ui-tab>` element.

<pre class="language-javascript">
<code>
// ui-tab register
(function() {
    'use strict';
    let template = `
        &lt;style&gt;
            :host section {
            display: none;
            padding: 10px 8px;
            border: 1px solid #ccc;
        }
    
        :host([visible="true"]) section {
            display: block;
        }
    
        ::content h3 {
            margin: 0 0 18px 0;
        }
        &lt;/style&gt;
        &lt;section role="tabpanel"&gt;
            &lt;content>&lt;/content&gt;
        &lt;/section&gt;
    `;
  
    let UITabProto = Object.create(HTMLElement.prototype);
         
    UITabProto.createdCallback = function() {
        let root = this.createShadowRoot();
        root.innerHTML = template;
    };
         
    document.registerElement('ui-tab', {
        prototype: UITabProto
    });
}());
</code>
</pre>

### The Result

Now our component should be styled and functional.

<img src="/assets/images/posts/2015-05-26-introduction-to-web-components/tab-with-css.jpg" class="col-7 float-center text-center" />

Our final component syntax in the HTML

<pre class="language-markup">
<code>
&lt;ui-tabs&gt;
    &lt;ui-tab tab-name=&quot;Tab 1&quot; visible=&quot;true&quot;&gt;
    Tab Content 1
    &lt;/ui-tab&gt;
    &lt;ui-tab tab-name=&quot;Tab 2&quot;&gt;
    Tab Content 2
    &lt;/ui-tab&gt;
    &lt;ui-tab tab-name=&quot;Tab 3&quot;&gt;
    Tab Content 3
    &lt;/ui-tab&gt;
&lt;/ui-tabs&gt;
</code>
</pre>

### HTML Imports

HTML Imports is the last peice of the Web Components. Imports allow us to import a component into a page. This loads the component and any dependencies
into the document. A HTML import would look similar to this.

<pre class="language-markup">
<code>
&lt;link rel="import" href="tab-component.html"&gt;
</code>
</pre>

HTML Imports allow us to load in our components without the need of JavaScript. Unfortunately Mozilla has
decided to not implement HTML Imports in Firefox. Mozilla currently wants to wait and see how ES6 modules play into web components
as they may fulfill the needs HTML imports are trying to solve. For now you can use pollyfills to solve this or use
JavaScript ES6 modules to manage your web components.

This introduction only scratches the surface of the Web Component API.You can find a working demo of the tab component on <a href="http://codepen.io/coryrylan/pen/LVZwWW" target="_blank">codepen.io</a>.
Check out <a href="http://webcomponents.org/" target="_blank">http://webcomponents.org/</a>
for the latest on web components and deep dive tutorials. Also check out Google's <a href="https://www.polymer-project.org" target="_blank">Polymer</a> project. Polymer
adds some syntactic sugar, pollyfills and pre-built components.
Web components will help bring the developers and JavaScript libraries together to use a common API and language.