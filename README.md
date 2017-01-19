# [deployable-assets](https://github.com/deployable/node-deployable-assets)

Web Asset Builder. Built on  gulp, babel and sass.

## Install
 
    npm install deployable-assets --save-dev

    yarn add deployable-assets --dev

## Usage

The package provides the Deployable gulp setup as a class which includes jquery, bootstrap, bootstrap-sass, babel
and the tasks to build sources into assets. 

```javascript

const { DeployableGulp } = require('deployable-assets')

```

You can also use, or extend the plain `Gulp` class to include you own flavour of  gulp usage

```javascript

const { Gulp } = require('deployable-assets')

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

## License

deployable-assetsis released under the MIT license.
Copyright 2016 Matt Hoyle - code aatt deployable.co

https://github.com/deployable/node-deployable-assets

