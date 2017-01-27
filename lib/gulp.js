const debug = require('debug')('dply:assets:gulp')

const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const gdebug = require('gulp-debug')

const { ExtendedError } = require('deployable-errors')
const { GulpGroupTask } = require('./gulp_group_task')
const { GulpGroups } = require('./gulp_groups')
const { GulpGroup } = require('./gulp_group')


class DeployableGulpError extends ExtendedError {}


class DeployableGulp {

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
    debug('Class DeployableGulp ran init')
  }

  constructor ( options = {} ) {
    debug('creating instance of DeployableGulp with', options)
    this.gulp = options.gulp || require('gulp')
    this.constructor.gulp = this.gulp

    // Create a group holder
    this._groups = new GulpGroups('', this, this)

    // Debug flag, tasks switch on some debug info if this is set to true
    this.setDebug(options.debug)

    // Watching flag
    this.watching = Boolean(options.watching)

    // Set the initial cwd
    if ( options.cwd ) this.setCwd(options.cwd)
    else this.setInitialCwd()
  }

  get full_name(){
    return ''
  }

  // Sets the debug value for this class.
  // Chaining method.
  // Groups/Tasks default to looking up this `debug` value.
  setDebug(bool){
    this.debug = Boolean(bool)
    debug('Set base debug to %s', this.debug)
    return this
  }


  // DeployableGulp things.

  // Groups/Tasks default to looking up this `dest` value.
  setDest(dest){
    this.dest = dest
    debug('Set base dest to %s', this.dest)
    return this
  }

  // Sets cwd for this class via a chaining method.
  // Groups/Tasks default to looking up this `cwd` value.
  setCwd(cwd){
    this.cwd = cwd
    debug('Set base cwd to %s', this.cwd)
    process.chdir(this.cwd)
    return this
  }
  setInitialCwd(){
    this.cwd = process.cwd()
  }


  // Helpers
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

DeployableGulp.init()

module.exports = { DeployableGulpError, DeployableGulp, GulpGroups, GulpGroup, GulpGroupTask }
