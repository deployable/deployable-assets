# [Deployable Assets](https://github.com/deployable/node-deployable-assets)

Web Asset Builder. Built on [gulp](https://gulpjs.com). Supports [babel](https://babeljs.io/), [sass](https://sass-lang.com/) and `$ shell` out of the box.

Organises gulp tasks into `groupname:taskname`

Watches can be added to groups, or tasks and source files will be automatically 
populated. No need to write extra tasks for the watch. 

Async sequences can be applied to a group to run sub tasks in order.

## Install

    npm install deployable-assets --save-dev

    yarn add deployable-assets --dev

## Usage

### Creating a gulp definition

gulpfile.js

```javascript

const { Gulp } = require('deployable-assets')
const { gulp } = Gulp

let gulp_def = new Gulp()

let group = gulp_def.addGroup('sitecss')

// Run a command
group.getTask('runit')
  .addShellTask(['bower install'])

// Copy files
group.getTask('copyit')
  .addSrc('bower_components/somecss/dist/*.css')
  .setDest('public/css')
  .addCopyTask()

// Sass
group.getTask('buildit')
  .addSrc('src/sass/*.scss')
  .setDest('public/css')
  .addSassTask()

// Custom task, still in a group
let task = group.getTask('custom')
task
  .addSrc('src/sass/*.scss')
  .setDest('public/css')
  .addCustom(()=>{
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

The package provides the Deployable gulp setup as a class which includes jquery, bootstrap, bootstrap-sass, babel
and the tasks to build sources into assets.

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

The package also provides a helper class to use in your application to refernce assets.
All references to your asset paths should be replaced by the helper so assets can be served
from any location, including the possibiilty of moving them to a CDN.

```javascript

const { DeployableAssets }  = require('deployable-assets')

DeployableAssets.js('js/test.js') // =>
DeployableAssets.css('css/test.css') // =>
DeployableAssets.path('fonts/arial.webf') // =>

```

## API

    let glp = new Gulp()

    let group = glp.addGroup('sitecss')

    group.getTask('testTask')
      .addSrc('bower_components/jquery/dist/*.js')
      .setDest('public/js')
      .addCopyTask()


## License

deployable-assetsis released under the MIT license.
Copyright 2016 Matt Hoyle - code aatt deployable.co

https://github.com/deployable/node-deployable-assets

