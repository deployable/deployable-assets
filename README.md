# [deployable-assets](https://github.com/deployable/deployable-assets)

Web Asset Handlers

Provide helpers for html snippets for assets with a configured path, like
[connect-assets](https://github.com/adunkman/connect-assets) does but serving
precompiled assets instead.

### Install

    npm install deployable-assets --save

    yarn add deployable-assets

### Usage

```javascript

const DeployableAssets = require('deployable-assets')
const assets = new DeployableAssets({ prefix: '/some_url' })
assets.js('path/name.js') // => <script src="/some_url/path/name.js" type="application/javascript"></script>
assets.css('name.css') // => <link rel="stylesheet" type="text/css" href="/some_url/name.css"/>
assets.path('img/upload.png') //=> /some_url/img/upload.png

```

### License

deployable-assets is released under the MIT license.
Copyright 2016 Matt Hoyle - code at deployable.co

https://github.com/deployable/deployable-assets
