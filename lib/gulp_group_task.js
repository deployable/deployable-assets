const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const {pick} = require('lodash')

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
    if (this._dest === undefined) return (this.group) ? this.group.dest : undefined
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

  toJSON(){
    let o = pick(this, ['name','globs','dest'])
    o.name = this.name
    o.globs = this.globs
    o.dest = this.dest
    if (this.group) o.group = this.group.name
    return o
  }

  toString(){

    return ( this.group )
      ? `${this.group.name}:${this.name}`
      : `${this.name}`
  }

  // ### Tasks

  createCopyTask(){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  createBabelTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(babel(babel_options))
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  createBabelSourceMapTask( babel_options = {presets: ['es2015']} ){
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(babel_options))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(this.dest))
    })
    return true
  }
  createSassTask(){
    let self = this
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( gulp.dest(this.dest) )
    })
    return true
  }
  createSassSourceMapTask(){
    let self = this
    gulp.task(`${this.group.name}:${this.name}`, ()=> {
      gulp
      .src(this.globs)
      .pipe( sourcemaps.init() )
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest(this.dest) )
    })
    return true
  }
  createShellTask(commands){
    gulp.task(`${this.group.name}:${this.name}`, shell.task(commands))
    return true
  }
  createSequence(...args){
    gulp.task(`${this.group.name}:${this.name}`, gulpSequence(...args))
    return true
  }
  createCustom(fn){
    gulp.task(`${this.group.name}:${this.name}`, fn)
    return true
  }
}

GulpGroupTask.init()

module.exports = { GulpGroupTask }

