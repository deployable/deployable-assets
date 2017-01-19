// # Deployable Assets

// ## Class `Deployable Assets` 

class DeployableAssets {

  constructor ( options = {} ){
    this.prefix = options.prefix
  }

  // Create a js script tag from the asset path
  js ( path, options = {} ) {
    return `<script src="${this.prefix}/${path}" type="application/javascript"></script>`
  }

  // Create a css link tag from the asset path
  css ( path, options = {} ) {
    return `<link rel="stylesheet" type="text/css" href="${this.prefix}/${path}"/>`
  }

  // Create a html font tag from the asset path
  font ( path, options = {} ) {
    return `<font rel="stylesheet" type="text/css" href="${this.prefix}/${path}"/>`
  }

  // Generate a path 
  path ( path ) {
    if (path.join) return `${this.prefix}/${path.join('/')}`
    return `${this.prefix}/${path}`
  }

}

module.exports = { DeployableAssets }

