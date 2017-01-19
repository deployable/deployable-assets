# [deployable-assets](https://github.com/deployable/node-deployable-assets)

Web Asset Builder. Built on  gulp, babel and sass.

## Install

    npm install deployable-assets --save-dev

    yarn add deployable-assets --dev

## Usage

Creating gulp definitions

```javascript

const { Gulp } = require('deployable-assets')

let gulp_def = new Gulp()

let group = gulp_def.addGroup('sitecss')

group.getTask('copyit')
  .addSrc('bower_components/somecss/dist/*.css')
  .setDest('public/css')
  .addCopyTask()

group.getTask('buildit')
  .addSrc('src/sass/*.scss')
  .setDest('public/css')
  .addSassTask()

```

This builds the tasks group `sitecss`. Tasks `copyit` and `buildit` will
be attached to a group. The tasks are available to run as `sitecss:copyit`
and `sitecss:buildit` in gulp.

    gulp sitecss:copyit

The parent `sitecss` task will automatically run all tasks in the
group asynchronously.

    gulp sitecss

Or you can control the [sequence](https://www.npmjs.com/package/gulp-sequence)
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

The package also provides helpers for your apps to build css and js tags with your configure asset paths

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

