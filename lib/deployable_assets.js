// # Deployable Assets

// ## Class `Deployable Assets`

class DeployableAssets {

  static createInstance(options){
    let defaults = { prefix: 'assets' }
    let opts = Object.assign({}, defaults, options)
    return this.instance = new DeployableAssets(opts)
  }

  constructor ( options = {} ){
    this.prefix = options.prefix
  }

  // Create a js script tag from the asset path
  js ( file_path ) {
    return `<script src="${this.path(file_path)}" type="application/javascript"></script>`
  }

  // Create a css link tag from the asset path
  css ( file_path ) {
    return `<link rel="stylesheet" type="text/css" href="${this.path(file_path)}"/>`
  }

  // Create a html font tag from the asset path
  font ( name, file_path, options = {} ) {
    let defaults = {
      local_name: name,
      style:      'normal',
      weight:     '400',
      format:     'woff2'
    }
    let opts = Object.assign({}, defaults, options)
    let css = `<style type="text/css">
  @font-face {
    font-family: '${name}';
    font-style: ${opts.style};
    font-weight: ${opts.weight};
    src: local('${opts.local_name}'), local('${opts.local_name}'), url(${this.path(file_path)}) format('${opts.format}');
  }
</style>`
    return css
  }

  // Use a google font
  googleFont ( name ) {
    let css = `<link href="https://fonts.googleapis.com/css?family=${name}" rel="stylesheet">`
    return css
  }

  // Generate a path, can take an array
  path ( file_path ) {
    if (file_path.join) return `${this.prefix}/${file_path.join('/')}`
    return `${this.prefix}/${file_path}`
  }





}

module.exports = { DeployableAssets }
