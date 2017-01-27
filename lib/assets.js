const debug = require('debug')('dply:assets:gulp')
const path = require('path')

//const _ = require('lodash')
const { ExtendedError } = require('deployable-errors')
const { DeployableGulp } = require('./gulp')


class AssetsError extends ExtendedError {}


class Assets extends DeployableGulp {

  static init () {
    debug('Class Assets ran init')
  }

  constructor ( options = {} ) {
    debug('Creating instance of Assets with', options)
    super(options)

    // Add a default task that lists all the groups/tasks available
    this.gulp.task('default', () => console.log(this._groups.toString()))

    // Defaults
    this.setSourcePath('app/assets')
    this.setDistPath('app/static/assets')
    this.setPublicUrl('/assets')

    // More defaults
    this.setJsDir('js')
    this.setCssDir('css')
    this.setFontsDir('fonts')
    this.setSassDir('sass')
    this.setScssDir('scss')
    this.setVendorDir('vendor')


  }

  // Paths

  setSourcePath(path){
    this.dir_source = path
    return this
  }
  getSourcePath(...paths){
    return path.join(this.dir_source, ...paths)
  }

  setDistPath(path){
    this.dir_dist = path
    this.dest = path
    return this
  }
  getDistPath(...paths){
    return path.join(this.dir_dist, ...paths)
  }

  setPublicUrl(url){
    this.public_url = url
  }
  getPublicUrl(...paths){
    return path.join(this.public_url, ...paths)
  }

  // Dirs

  setJsDir(dir){
    this.dir_js = dir
    return this
  }
  getJsDir(dir){
    this.dir_js = dir
    return this
  }
  setCssDir(dir){
    this.dir_css = dir
    return this
  }
  setFontsDir(dir){
    this.dir_fonts = dir
    return this
  }
  setSassDir(dir){
    this.dir_sass = dir
    return this
  }
  setScssDir(dir){
    this.dir_scss = dir
    return this
  }
  setVendorDir(dir){
    this.dir_vendor = dir
    return this
  }

}

Assets.init()

module.exports = { AssetsError, Assets }
