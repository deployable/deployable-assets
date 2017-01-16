// # Deployable Assets

// ## Class `Deployable Assets` 

module.exports = class DeployableAssets {

  constructor ( options = {} ){
    this.prefix = options.prefix
  }

  js ( path, options = {} ) {
    return `<script src="${this.prefix}/${path}" type="application/javascript"></script>`
  }

  css ( path, options = {} ) {
    return `<link rel="stylesheet" type="text/css" href="${this.prefix}/${path}"/>`
  }
  
  font ( path, options = {} ) {
    return `<font rel="stylesheet" type="text/css" href="${this.prefix}/${path}"/>`
  }

  path ( path ) {
    return `${this.prefix}/${path}` 
  }

}

