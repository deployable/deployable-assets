# [Deployable Assets](https://github.com/deployable/node-deployable-assets)

## Web Asset Builder.

Built on [gulp](https://gulpjs.com). Supports [babel](https://babeljs.io/), [webpack](https://webpack.github.io/),
 [sass](https://sass-lang.com/) and `shell` commands out of the box.

Organises your gulp tasks into groups of tasks, `groupname:taskname`

Group destination can filter down to tasks if you don't override it.

Group sources filter up so you can access all group sources programatically.

A `:watch` task can be added to groups, or tasks. This will monitor the src files
and build as needed.

Async sequences can be applied to a group to run sub tasks in order.

## Install

    npm install @deployable/assets --save-dev
    npm install @deployable/asset --save

    yarn add @deployable/assets --dev
    yarn add @deployable/asset

## Usage

### Creating a gulp definition

gulpfile.js

*Note*: Adding the type of gulp task must always be the last step of a task chain. This
step builds a gulp task from the previously set varaibles.

```javascript

const { Gulp } = require('@deployable/assets')
const { gulp } = Gulp

let gulp_def = new Gulp()

let group = gulp_def.addGroup('sitecss')

// Run a command
group.task('runit')
  .createShellTask(['bower install'])

// Copy files
group.task('copyit')
  .addSrc('bower_components/somecss/dist/*.css')
  .setDest('public/css')
  .createCopyTask()

// Sass
group.task('buildit')
  .addSrc('src/sass/*.scss')
  .setDest('public/css')
  .createSassTask()

// Custom task, still in a group
let task = group.task('custom')
task
  .addSrc('src/sass/*.scss')
  .setDest('public/css')
  .createCustom(()=>{
    gulp.src(task.src)
      .pipe(whatever())
      .pipe(dest(task.dest))
  })

// Add a group task so `gulp sitecss` works
group.sequence('sitecss:runit', ['sitecss:copyit', 'sitecss:buildit'], 'sitecss:custom')

```


### Running gulp tasks

This builds the tasks group `sitecss`. Tasks `copyit` and `buildit` will
be attached to a group. The tasks are available to run as `sitecss:copyit`
and `sitecss:buildit` in gulp.

    gulp sitecss:copyit

The parent `sitecss` task will automatically run all tasks in the
group asynchronously.

    gulp sitecss


### Asynchronouse Sequence control

You can control the [sequence](https://www.npmjs.com/package/gulp-sequence)
of events with `.sequence()`

```javascript
group.sequence( 'copyit', 'buildit', 'otherthing' )
```

```javascript
group.sequence( 'copyit', [ 'buildit', 'otherthing' ] )
```


### Deployable Gulp

The package provides the Deployable Assets gulp setup as a class which includes jquery, bootstrap, bootstrap-sass, babel
and the pre defined tasks to build sources into assets.

```javascript

const { DeployableGulp } = require('deployable-assets')
let gulp_def = new DeployableGulp()

```

The following tasks are provided

```bash
gulp bower        # bower + copy

gulp js           # babel
gulp js:babel

gulp css          # sass
gulp css:sass     # sass

gulp assets       # bower + js + css
gulp assets:watch # long running wathcing build

```


### Asset Helpers

The [@deployable/asset](https://github.com/deployable/node-deployable-asset)
package provides helper functionsto use in your application to refernce assets.
All references to your asset paths should be replaced by the helper so assets
can be served from any location, including the possibiilty of moving them to a CDN.

```javascript

const assetHelpers  = require('@deployable/asset')({ prefix: 'https://cdn.com/3e4a6' })

assetHelpers.js('js/test.js') // => https://cdn.com/3e4a6/js/test.js
assetHelpers.css('css/test.css') // => https://cdn.com/3e4a6/css/test.css
assetHelpers.path('fonts/arial.webf') // => https://cdn.com/3e4a6/fonts/arial.webf

```

## API

    let glp = new Gulp()

    let group = glp.addGroup('sitecss')

    group.task('testTask')
      .addSrc('bower_components/jquery/dist/*.js')
      .setDest('public/js')
      .addCopyTask()


## About

deployable-assets is released under the MIT license.

Copyright 2016 Matt Hoyle - code aatt deployable.co

https://github.com/deployable/node-deployable-assets
https://deployable.co/code/node-deployable-assets

