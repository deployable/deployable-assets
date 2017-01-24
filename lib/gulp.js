const debug = require('debug')('dply:assets:gulp')
const path = require('path')

const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const gdebug = require('gulp-debug')

const _ = require('lodash')
const { ExtendedError } = require('deployable-errors')
const { GulpGroupTask } = require('./gulp_group_task')
const { GulpGroups } = require('./gulp_groups')
const { GulpGroup } = require('./gulp_group')


class GulpError extends ExtendedError {}


class Gulp {

  static init () {
    // Not a nice way to track if we are watching or not :/
    // Error handling should exit when the task is run, and continue
    // when the using a long running `watch`
    this.watching = false

    // Export the gulp-* modules being used
    this.gulp = require('gulp')
    this.shell = shell
    this.babel = babel
    this.watch = watch
    this.batch = batch
    this.plumber = plumber
    this.sourcemaps = sourcemaps
    this.gulpSequence = gulpSequence
    this.gdebug = gdebug

  }

  constructor ( options = {} ) {

    this.gulp = options.gulp || require('gulp')
    this.constructor.gulp = this.gulp

    // Create a group holder
    this._groups = new GulpGroups('', this, this)

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

    // Debug flag, tasks switch on some debug info if this is set to true
    this.debug = Boolean(options.debug)

    // Watching flag
    this.watching = Boolean(options.watching)

  }

  get full_name(){
    return ''
  }

  setDebug(bool){
    this.debug = Boolean(bool)
    return this
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

  // Gulp things

  setDest(dest){
    this.dest = dest
    return this
  }

  group(...args){
    return this._groups.group(...args)
  }

  addGlob( groupname, taskname, glob ){
    this._groups.group(groupname).task(taskname).addGlob(glob)
  }

  groupGlobs(groupname) {
    this._groups.group(groupname).getGlobs()
  }

  toString() {
    return this._groups.toString()
  }

  toJSON(){
    return this._groups.toJSON()
  }

}

Gulp.init()

module.exports = { GulpError, Gulp, GulpGroups, GulpGroup, GulpGroupTask }
