const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const sass = require('gulp-sass')
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
    this.groups = new GulpGroups('', this)
    this.gulp.task('default', () => console.log(this.groups.toString()))
  }

  setDest(dest){
    this.dest = dest
  }

  addGroup(...args){
    return this.groups.addGroup(...args)
  }

  addGlob( group, name, glob ){
    this.groups.fetchGroup(group).fetchTask(name).addGlob(glob)
  }

  groupGlobs(group) {
    this.groups.getGroup(group).getGlobs()
  }

  toString() {
    return this.groups.toString()
  }

  toJSON(){
    return this.groups.toJSON()
  }
}

Gulp.init()

module.exports = { GulpError, Gulp, GulpGroups, GulpGroup, GulpGroupTask }

