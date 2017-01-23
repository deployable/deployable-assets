const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
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
    this.gulp = gulp
    this.shell = shell
    this.babel = babel
    this.watch = watch
    this.batch = batch
    this.plumber = plumber
    this.sourcemaps = sourcemaps
    this.gulpSequence = gulpSequence
    this.sass = sass
    this._ = _
  }

  constructor () {
    this.gulp = gulp
    this._groups = new GulpGroups('', this)

    // Add a default task that lists all the groups/tasks available
    this.gulp.task('default', () => console.log(this._groups.toString()))
  }

  setPublic(url){
    this.public = url
  }

  setDest(dest){
    this.dest = dest
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

