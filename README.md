# [deployable-assets](https://github.com/deployable/deployable-assets)

Web Asset Handlers

### Install
 
    npm install deployable-assets --save

    yarn add deployable-assets

### Usage

```javascript

const DeployableAssets = require('deployable-assets')
const assets = new DeployableAssets({ prefix: '/some_url' })
assets.js('path/name.js') // => <script src="/wat/something" type="application/javascript"></script>
assets.css('name.css') // => <link rel="stylesheet" type="text/css" href="/wat/otherthing"/>

```

### License

deployable-assets is released under the MIT license.
Copyright 2016 Matt Hoyle <code at deployable.co>

https://github.com/deployable/deployable-assets

