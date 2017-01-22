const debug = require('debug')('dply:assets:gulp_group_task')

const gulp = require('gulp')
const shell = require('gulp-shell')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const {pick} = require('lodash')
const { GulpDestMixin } = require('./gulp_dest_mixin')

class GulpGroupTask extends GulpDestMixin {

  static init(){

  }

  constructor(name, group){
    super(name, group)
    this.name = name
    this.parent = group
    this.globs = []
    this.Gulp = require('./gulp')
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
    if (this.parent) o.group = this.parent.name
    return o
  }

  toString(){
    return ( this.parent )
      ? `${this.parent.name}:${this.name}`
      : `${this.name}`
  }


  // ### Tasks

  // Copy src files to dest
  createCopyTask(){

    /* istanbul ignore next */
    let copy_fn = () => {
      gulp.src(this.globs)
      .pipe(gulp.dest(this.dest))
    }

    gulp.task(`${this.parent.name}:${this.name}`, copy_fn)

    return true
  }

  // Babel
  createBabelTask( babel_options = {presets: ['es2015']} ){

    /* istanbul ignore next */
    let babel_fn = () => {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(babel(babel_options))
      .pipe(gulp.dest(this.dest))
    }

    gulp.task(`${this.parent.name}:${this.name}`, babel_fn)

    return true
  }

  // Babel with sourcemaps
  createBabelSourceMapTask( babel_options = {presets: ['es2015']} ){

    /* istanbul ignore next */
    let babel_smap_fn = () => {
      gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(babel_options))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(this.dest))
    }

    gulp.task(`${this.parent.name}:${this.name}`, babel_smap_fn)
    return true
  }

  // Sass
  createSassTask(){
    let self = this

    /* istanbul ignore next */
    let sass_fn = ()=> {
      gulp
      .src(this.globs)
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( gulp.dest(this.dest) )
    }

    gulp.task(`${this.parent.name}:${this.name}`, sass_fn)

    return true
  }

  // Sass with sourcemaps
  createSassSourceMapTask(){
    let self = this

    /* istanbul ignore next */
    let sass_smap_fn = ()=> {
      gulp
      .src(this.globs)
      .pipe( sourcemaps.init() )
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest(this.dest) )
    }

    let tsk = gulp.task(`${this.parent.name}:${this.name}`, sass_smap_fn)
    debug('added gulp task', tsk)
    return true
  }

  // Run something in the shell
  run(commands){ return this.createShellTask(commands) }
  createShellTask(commands){
    gulp.task(`${this.parent.name}:${this.name}`, shell.task(commands))
    return true
  }

  // Run a gulp-sequence of tasks
  createSequence(...args){
    gulp.task(`${this.parent.name}:${this.name}`, gulpSequence(...args))
    return true
  }

  // Define a custom gulp task. Just pass the callback function
  // you would to `gulp.task()`.
  // Use `()=>{}` if you want `this` to refer to your gulp definition
  createCustom(fn){
    gulp.task(`${this.parent.name}:${this.name}`, fn)
    return true
  }

}

GulpGroupTask.init()

module.exports = { GulpGroupTask }

