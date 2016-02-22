---
layout: post
title: Better UX CSS Hover Navigation
description: Improve CSS hover based navigations with CSS transforms and Pseudo-elements
keywords: Cory Rylan, CSS, Sass
tags: ux, css
date: 2016-02-21
permalink: /blog/better-ux-css-hover-navigation
demo: http://codepen.io/splintercode/pen/rxQbzg
---

The CSS hover based drop down nav has been a common option when organizing our website's navigation. Simple and easy to build with decent user experience the 
drop down can seem like reasonable choice. With a small bit of JavaScript we can also get good touch support. Often though when using hover effects to open drop downs users run into something like this:

<video src="/assets/video/posts/2016-02-19-better-ux-css-hover-navigation/hover.mp4" autoplay loop controls class="float-center col-5--max"></video>

The user saw the bottom link in the sub nav and tried to click it. Because our nav displays on hover, when the cursor leaves the element the
hover is no longer applied. This in turn the causes our nav to no longer display. Using Pseudo-elements and CSS transforms we can 
create additional elements to allow the hover area to be larger. Doing this creates a buffer area that will allow the user's mouse to veer off of the menu. 
So we will have something like this:

<img src="/assets/images/posts/2016-02-19-better-ux-css-hover-navigation/hover.png" class="float-center full-width col-4--max" />

Below is a snippet example from
our <a href="http://codepen.io/splintercode/pen/rxQbzg" target="_blank">demo</a> of how this would look. 

<pre class="language-css">
<code>
{% raw %}
// Don't worry to much about the details but just look and see how we are using
// the :after selector to create a new Pseudo-element.

// Sub nav that is displayed when a nav button is hovered
.nav__sub-nav__btn.has-sub-nav:after {
    content: '';
    display: none;
    width: 68px;
    height: 139px;
    position: absolute;
    right: -19px;
    top: 4px;
    transform: rotate(-41deg);
    z-index: 99;
}

// On hover of our nav we show our Pseudo-element that we created above.
.has-sub-nav:hover:after {
    display: block;
}

// On hover of our extra Pseudo-element we show the sub nav
.has-sub-nav:after:hover > .nav__sub-nav {
    display: block;
    top: 0;
    left: 238px;
    z-index: 100;
}
{% endraw %}
</code>
</pre>

The extra element allows our hover state to continue while the user moves their mouse outside of the parent menu button.
Using `z-index` we place our new element between the nav and the sub nav to get the final result:

<video src="/assets/video/posts/2016-02-19-better-ux-css-hover-navigation/hover2.mp4" autoplay loop controls class="float-center col-5--max"></video>

This is not a perfect solution. There is still a chance of the users mouse venturing out too far but this does provide a better user experience with only a little 
more code. Check out a full working demo on Codepen below with included JavaScript for touch support.