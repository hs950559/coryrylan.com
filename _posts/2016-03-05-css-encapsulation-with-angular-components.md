---
layout: post
title: CSS Encapsulation with Angular Components
description: A intro on how to better encapsulate your CSS in Angular components. Also learn the different encapsulation techniques and CSS best practices.
keywords: Cory Rylan, Angular, CSS
tags: css angular
date: 2016-03-05
updated: 2016-12-19
permalink: /blog/css-encapsulation-with-angular-components
demo: https://embed.plnkr.co/JYbmizTKUd29zfmmMmLc/
---

{% include ng-version.html %}

CSS encapsulation has always been something developers have wanted in their web applications. The ability to scope CSS to a specific component without affecting other components 
has been difficult to achieve. This post we will cover how to use Angular components to encapsulate our CSS and learn the pros and cons to each technique.

In our Angular app we will have three components. First is our App component, it will have two child components `FirstComponent` and `SecondComponent`.

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/rendered-output.png" 
    alt="Rendered output of Angular CSS encapsulation" 
    bp-layout="float-center full-width 6--max" />

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    &lt;h3&gt;CSS Encapsulation with Angular&lt;/h3&gt;
    &lt;div class=&quot;cmp&quot;&gt;
      App Component
      &lt;first-cmp&gt;&lt;/first-cmp&gt;
      &lt;second-cmp&gt;&lt;/second-cmp&gt;
    &lt;/div&gt;
  `
})
export class App {
  constructor() { }
}
{% endraw %}
</code>
</pre>

We link a separate style sheet into our `index.html` that has a  single global style rule that will be applied to any element with the CSS class of `cmp`.

<pre class="language-css">
<code>
{% raw %}
.cmp {
  padding: 6px;
  margin: 6px;
  border: 2px solid red;
}
{% endraw %}
</code>
</pre>


<h2>Style Techniques</h2>
Now lets take a look at our `FirstComponent` and `SecondComponent` and see the options we have to style these components.

<pre class="language-javascript">
<code>
{% raw %}
import { Component } from '@angular/core';

@Component({
  selector: 'first-cmp',
  template: `
    &lt;div class=&quot;cmp&quot;&gt;First Component&lt;/div&gt;
    &lt;style&gt;.cmp { border: blue 2px solid; }&lt;/style&gt;`
})
export class FirstComponent {
  constructor() { }
}

@Component({
  selector: 'second-cmp',
  template: `&lt;div class=&quot;cmp&quot;&gt;Second Component&lt;/div&gt;`,
  styles: ['.cmp { border: green 2px solid; }']
})
export class SecondComponent {
  constructor() { }
}
{% endraw %}
</code>
</pre>

So looking at our two components there are two different ways to apply styles to them. In `FirstComponent` we have a style tag in out template while in the `SecondComponent` we
can use a styles property on our component decorator. Both will have the same outcome when rendering to the screen. 

<h2>View Encapsulation</h2>
Angular by default encapsulates component CSS. So lets take a look at the rendered output of our code so far.

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/rendered-output.png" 
    alt="Rendered output of Angular CSS encapsulation" 
    bp-layout="float-center full-width 6--max" />
    
So we can see that each components corresponding `.cmp` CSS class is scoped to it's own template. The default CSS behavior multiple `.cmp` classes would of caused global name collisions
with our styles. So lets look at the Chrome dev tools and see what the rendered HTML and CSS looks like.

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/rendered-html.png" 
    alt="Rendered output of Angular CSS encapsulation" 
    bp-layout="float-center full-width 8--max" />
    
By default Angular generates attributes to help scope our CSS class names to our given component. So you can see here all elements inherit the `.cmp` CSS. Each 
component's CSS is scoped and overrides our base border color. The attributes generated by Angular should **NOT** be used to target elments with CSS. These attributes
are automatically generated can can change.


<h3>Native CSS encapsulation with Shadow DOM</h3>
Angular has some additional CSS rendering options. The first is we can use Native CSS encapsulation. Turning on this feature will force browsers to use 
the <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM" target="_blank">Shadow DOM</a>. For browsers that understand the Shadow DOM this creates a new rendering context for a given element that is completely isolated from the rest of the DOM.
This is true native CSS encapsulation but is not enabled by default in Angular. So lets look at the code and the generated output.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'second-cmp',
  template: `&lt;div class=&quot;cmp&quot;&gt;Second Component&lt;/div&gt;`,
  styles: ['.cmp { border: green 2px solid; }'],
  encapsulation: ViewEncapsulation.Native  // Use the native Shadow DOM to encapsulate our CSS
})
export class SecondComponent {
  constructor() { }
}
{% endraw %}
</code>
</pre>

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/native-output-html.png" 
    alt="Rendered output of Angular CSS Native encapsulation" 
    bp-layout="float-center full-width 8--max" />

 So here we can see a shadow root element being created which isolates our `SecondComponent` from the rest of our application.
 One thing to note this behavior is slightly different than the default behavior. This isolates the component completely 
 so we do not inherit the global `.cmp` styles with that had our padding and margin.
 

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/native-output-view.png" 
    alt="Rendered output of Angular CSS Native encapsulation" 
    bp-layout="float-center full-width 6--max" />
    
If we want the default global CSS to apply to elements in the shadow DOM we must use a special CSS selector.

<pre class="language-css">
<code>
{% raw %}
::shadow .cmp {
  padding: 6px;
  margin: 6px;
}
{% endraw %}
</code>
</pre>  

<h3>Disable CSS Encapsulation</h3>

Sometimes although rare, there are occasions where we would like a component's CSS to not be encapsulated and apply globally to our application. 
Angular offers an easy way to disable CSS encapsulation. So lets disable this on our `SecondComponent`.

<pre class="language-javascript">
<code>
{% raw %}
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'second-cmp',
  template: `&lt;div class=&quot;cmp&quot;&gt;Second Component&lt;/div&gt;`,
  styles: ['.cmp { border: green 2px solid; }'],
  encapsulation: ViewEncapsulation.None  // Use to disable CSS Encapsulation for this component
})
export class SecondComponent {
  constructor() { }
}
{% endraw %}
</code>
</pre>

Now that we disabled our CSS/View Encapsulation lets look at how our app is rendered. 

<img src="/assets/images/posts/2016-03-06-css-encapsulation-with-angular-components/disabled-encapsulation-view.png" 
    alt="Rendered output of Angular disabled CSS encapsulation" 
    bp-layout="float-center full-width 6--max" />
    
So we can see in our `SecondComponent` the `.cmp` CSS class set the border to green. Since encapsulation is disabled it is now applied globally.
This overrides the default global of red making our root app component have a green border. Notice our `FirstComponent` still has a blue border. This
is because our `FrstComponent` still has the default View Encapsulation. If CSS is needed to be shared across 
components create global utility classes and do not copy the CSS over and over between components. 

With Angular Components we have far more control with our CSS styles. Check out the full working demo in the link below.