const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')


class GulpGroupTask {

  static init(){

  }

  constructor(name, group){
    this.name = name
    this.group = group
    this.globs = []
    this.Gulp = require('./gulp')
  }

  get dest (){
    if (this._dest === undefined) return this.group.dest
    return this._dest
  }
  set dest (_dest){
    return this._dest = _dest
  }
  setDest(path){
    this.dest = path
    return this
  }

  addSrc(...args){ return this.addGlob(...args) }
  addGlob(path){
    this.globs.push(path)
    return this
  }
  getGlobs(){
    return this.globs
  }

  // Tasks

  addCopyTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  addBabelTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!Gulp.watching) throw err
      }))
      .pipe(babel(babel_options))
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  addBabelSourceMapTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!Gulp.watching) throw err
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(babel_options))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  addSassTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!Gulp.watching) throw err
      }))
      .pipe( gulp.dest(this.dest) )
    })
    return true
  }
  addSassSourceMapTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sourcemaps.init() )
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!Gulp.watching) throw err
      }))
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest(this.dest) )
    })
    return true
  }
  addShellTask(commands){
    gulp.task(`${this.group.name}:${this.name}`, shell.task(commands))
    return true
  }
  addSequence(...args){
    gulp.task(`${this.group.name}:${this.name}`, gulpSequence(...args))
    return true
  }
}

GulpGroupTask.init()

module.exports = { GulpGroupTask }

