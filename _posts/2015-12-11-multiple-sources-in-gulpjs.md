---
layout: post
title: Multiple Sources in GulpJS
description: How to build a GulpJS setup for large scale projects with multiple source support.
keywords: Cory Rylan, Web, GulpJS, JavaScript, automation
tags: gulpjs, javascript
date: 2015-12-11
permalink: /blog/multiple-sources-in-gulpjs
---

Gulp is a fantastic tool to have as a front end web developer. Gulp is a task runner that can manage repetitive
tasks such as minification, linting or compiling front end resources. This post I'll talk about a more advanced
topic in Gulp of how to handle multiple Gulp sources and configs in a single project.

First let’s review the purpose of a `gulp.config.js` It’s common to abstract path logic our to a `gulp.config.js` file.
This allows us to reuse the `gulpfile.js` in multiple projects. The `gulpfile.js` has all of our tasks but no knowledge
of where the files are located. It receives the paths to our assets via our `gulp.config.js`. So here is a simple config with just a
single task and a config file with some extra info about our project.

<pre class="language-javascript">
<code>
let gulp = require('gulp');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
let gulpUtil = require('gulp-util');
const config = require('./gulp.config');
 
gulp.task('styles', () => {
    return gulp.src(config.sass.src)
        .pipe(isProd() ? sass({ outputStyle: 'compressed' }) : sass())
         .on('error', error => console.log(error))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest(config.buildLocations.css));
});
 
function isProd() {
    return gulpUtil.env.type === 'production';
}
</code>
</pre>

This Gulp file compiles the Sass files and if it’s running in the production
environment then it also minifies the CSS. It gets our path information from our Gulp config file.

<pre class="language-javascript">
<code>
module.exports = {
    app: { baseName: 'app' },
    sass: {
        src: ['./app/styles/**/*.scss']
    },
    buildLocations: {
        css: './build/app/styles/',
    }
}
</code>
</pre>

Our Gulp file is reusable and can be dropped into another project. Just create a config to specify
that projects folder/path structure. These examples are simplified as there would be many
more tasks and paths in a moderately large project.

## Project Complexity

So now what if our project is a little more complex? Say we have a few different bundles we would like to generate.
We would like a public bundle and account bundle with our assets for when the user is logged in behind a account wall.
For performance reasons we wouldn't want to send our JavaScript or CSS related to our account section if they are
only on the public facing side of the site. So ideally our build output after our Gulp tasks runs would ideally
look something like this:

<pre>
    -> build/
        -> public
            -> CSS
            -> JS
            -> HTML
        -> account
            -> CSS
            -> JS
            -> HTML
</pre>

So how would we accomplish this with our Gulp tasks? We could create additional Gulp tasks.
Maybe a `styles.account` and `styles.public` Gulp task. Each task takes in the files for that specific area.
This would work but then our tasks aren’t DRY. We can’t reuse them or use our gulpfile in another project. It’s now specific to this project.

## Multi Config Support

Ideally we would like a `gulp.config.public.js` and a `gulp.config.account.js`. Each config specifies what assets
we need for that area of our project. One config for all of the public facing assets then the other for our account section.
Our config files would look something like this:
    
<pre class="language-javascript">
<code>
// gulp.config.public.js
module.exports = {
    app: { baseName: 'public' },
    sass: {
        src: ['./styles/base.scss']
    },
    buildLocations: {
        css: './build/public/styles/'
    }
}
  
// gulp.config.account.js
module.exports = {
    app: { baseName: 'account' },
    sass: {
        src: ['./styles/base.scss', './styles/account.scss']
    },
    buildLocations: {
        css: './build/account/styles/'
    }
}
</code>
</pre>

So in our gulpfile.js we will import each one of our config files.

<pre class="language-javascript">
<code>
const CONFIGS = [require('./gulp.public.config'), require('./gulp.account.config')];
</code>
</pre>

Gulp uses streams to manage data and files efficiently. This means we can pipe multiple tasks and apply it to a single
file without having to write to disk. All the tasks are processed in memory making them very fast.
We can leverage streams to help us manage our more complex project.

Gulp streams work fine with Node streams. So in our styles task what if we said for each config process the Sass files?
We can treat each config as a separate Node stream then once all are completed return a single merged stream back to Gulp.

<pre class="language-javascript">
<code>
let gulp = require('gulp');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
let gulpUtil = require('gulp-util');
let merge = require('merge-stream');
 
const CONFIGS = [require('./gulp.public.config'), require('./gulp.account.config')];
 
gulp.task('styles', () => {
    let tasks = CONFIGS.map(config => {
        return gulp.src(config.sass.src)
            .pipe(isProd() ? sass({ outputStyle: 'compressed' }) : sass())
            .on('error', error => console.log(error))
            .pipe(rename('app.min.css'))
            .pipe(gulp.dest(config.buildLocations.css));
    });
 
    return merge(tasks);
});
 
function isProd() {
    return gulpUtil.env.type === 'production';
}
</code>
</pre>

So our gulpfile now can support one to any number of config files in a given project while keeping the task DRY and reusable.

## Watch Task Performance

So what happens as our project grows in size? Well our build time will slowly get longer and longer yes but how can we optimize
our watch task? For example when I watch the project every time a file changes I want it to run through the tasks whether
that’s compiling Sass or linting JavaScript. We wouldn't want all these tasks running every time a single Sass file changed.
This would make our watch tasks painfully slow over time. So to optimize our watch we watch and compile based on the file types.
    
<pre class="language-javascript">
<code>
gulp.task('watch',  () => {
    gulpUtil.env.type = 'development';
    let sassSrc = [];
    let htmlSrc = [];
    let typescriptSrc = [];
 
    CONFIGS.forEach(config => {
        sassSrc.push(config.sass.src);
        htmlSrc.push(config.html.src);
        typescriptSrc.push(config.typescript.src);
    });
 
    gulp.watch(sassSrc, () => runSequence('_build.sass', '_update.version', '_sass-lint'));
    gulp.watch(htmlSrc, () => runSequence('_build.html', '_update.template-version',   '_update.version'));
    gulp.watch(typescriptSrc, () => runSequence('_build.typescript', '_update.template-version', '_update.version',  '_ts-lint'));
});
</code>
</pre>

So here is the optimized watch task. To counter the effects of long build times only run the task associated with the given file type.
First the task gets a list of all the config sources. Then the task starts up a watch for each list of files.
If any file in that list changes then run the associated task. If I change a Sass file then only the Sass for the
project will recompile. If I update a TypeScript file only the TypeScript will compile.

Gulp can be a powerful tool but like any codebase can become unwieldy if not careful.
To see a full gulpfile I personally use you can look at this <a href="https://github.com/splintercode/gulp-start-up" target="_blank">repo on GitHub</a>.
It includes a example gulpfile and two area config files.