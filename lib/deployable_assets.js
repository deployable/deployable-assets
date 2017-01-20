// # Deployable Assets

// ## Class `Deployable Assets`

class DeployableAssets {

  constructor ( options = {} ){
    this.prefix = options.prefix
  }

  // Create a js script tag from the asset path
  js ( path ) {
    return `<script src="${this.prefix}/${path}" type="application/javascript"></script>`
  }

  // Create a css link tag from the asset path
  css ( path ) {
    return `<link rel="stylesheet" type="text/css" href="${this.prefix}/${path}"/>`
  }

  // Create a html font tag from the asset path
  font ( name, path, options = {} ) {
    let local_name = ( options.local_name ) ? options.local_name : name
    let style = ( options.style ) ? options.style : 'normal'
    let weight = ( options.weight ) ? options.weight : 'normal'
    let format = ( options.format ) ? options.format : 'normal'
    let css = `@font-face {
  font-family: '${name}';
  font-style: ${style};
  font-weight: ${weight};
  src: local('${local_name}'), local('${local_name}'), url(${this.prefix}/${path}) format('${format}');
}`
    return css
  }

  // Generate a path
  path ( path ) {
    if (path.join) return `${this.prefix}/${path.join('/')}`
    return `${this.prefix}/${path}`
  }





}

module.exports = { DeployableAssets }
