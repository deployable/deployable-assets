const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const sass = require('gulp-sass')
const _ = require('lodash')
const { ExtendedError } = require('deployable-errors')

// Globalish var to control errors when watching.
const watching = false


class GulpError extends ExtendedError {}


class GulpGroups {
  constructor(name){
    this.name = name
    this.groups = {}
  }
  addGroup(name){
    return this.groups[name] = new GulpGroup(name)
  }
  getGroup(name){
    if (!this.groups[name]) return this.addGroup(name)
    return this.groups[name]
  }
  getGlobs(){
    _.flatMap(this.groups, (item)=> item.getGlobs())
  }
}


class GulpGroup {
  constructor(name){
    this.name = name
    this.tasks = {}
  }
  addTask(name){
    return this.tasks[name] = new GulpGroupTask(name, this)
  }
  getTask(name){
    if (!this.tasks[name]) return this.addTask(name)
    return this.tasks[name]
  }
  getGlobs(){
    _.flatMap(this.tasks, (item)=> item.getGlobs())
  }
  sequence(...args){
    gulp.task(`${this.name}`, gulpSequence(...args))
  }
}


class GulpGroupTask {
  constructor(name, group){
    this.name = name
    this.group = group
    this.globs = []
    this.dest = ''
  }
  addGlob(path){
    this.globs.push(path)
    return this
  }
  getGlobs(){
    return this.globs
  }
  addDest(path){
    this.dest = path
    return this
  }
  addCopyTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe(gulp.dest(this.dest))
    })
  }
  addBabelTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!watching) throw err
      }))
      .pipe(babel(babel_options))
      .pipe(gulp.dest(this.dest))
    })
  }
  addBabelSourceMapTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!watching) throw err
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(babel_options))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(this.dest))
    })
  }
  addSassTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!watching) throw err
      }))
      .pipe( gulp.dest(this.dest) )
    })
  }
  addSassSourceMapTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sourcemaps.init() )
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!watching) throw err
      }))
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest(this.dest) )
    })
  }
  addShellTask(commands){
    gulp.task(`${this.group.name}:${this.name}`, shell.task(commands))
  }
  addSequence(...args){
    gulp.task(`${this.group.name}:${this.name}`, gulpSequence(...args))
  }
}


class Gulp {

  static init () {
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
    this.groups = new GulpGroups()
    let js = this.groups.addGroup('js')
    let css = this.groups.addGroup('css')

    // js
    let babel = js.addTask('babel')
    babel.addGlob('app/assets/js/**/*.es6')

    // css
    let sass = css.addTask('sass')
    sass.addGlob('app/assets/css/site.scss')
    sass.addGlob('app/assets/css/bootstrap.scss')

  }

  addGlob( group, name, glob ){
    this.groups.fetchGroup(group).fetchTask(name).addGlob(glob)
  }

  get js_globs() {
    return this.getGroup('js').getGlobs()
  }

  get css_globs() {
    return this.getGroup('css').getGlobs()
  }

}

Gulp.init()

module.exports = { GulpError, Gulp, GulpGroups, GulpGroup, GulpGroupTask }

