const debug = require('debug')('dply:assets:gulp_group_task')
const path = require('path')

const shell = require('gulp-shell')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const gulpSequence = require('gulp-sequence')
const webpackstream = require('webpack-stream')
const { pick, each, isNil } = require('lodash')
const { GulpDestMixin } = require('./gulp_dest_mixin')


class GulpGroupTask extends GulpDestMixin {

  static init(){

  }

  constructor(name, group, rootgulp){
    super(name, group)
    this.name = name
    this.parent = group
    this.root = rootgulp
    this.globs = []
    this.gulp = this.root.gulp
  }

  fullName(){
    return `${this.parent.fullName()}:${this.name}`
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
      this.gulp.src(this.globs)
      .pipe(this.gulp.dest(this.dest))
    }

    this.gulp.task(`${this.fullName()}`, copy_fn)

    return true
  }

  // WebPack + Babel
  createWebpackTask( options = {}, webpack_config ){

    if ( webpack_config ) throw new Error('Not supported yet')

    // Create the webpack config object
    webpack_config = {}

    // Create the webpack.entry object
    let src = ( isNil(options.src) ) ? 'app/assets/js/*.js' : options.src
    let files = require('glob').sync(src, { cwd: process.cwd() })
    if ( files.length === 0 ) console.log(`No webpack files matched for src ${src}`)
    debug('found files', files)
    options.entries = {}
    each( files, filepath => {
      let filename = path.basename(filepath, path.extname(filepath))
      options.entries[filename] = path.join(process.cwd(), filepath)
    })

    // Add the source files as entry points
    webpack_config.entry = options.entries

    // Add the output info
    let dest_default = path.join( process.cwd(), 'apps', 'public', 'assets', 'js' )
    let dest = ( isNil(options.dest) ) ? dest_default : options.dest
    webpack_config.output = {
        path: dest,
        filename: options.destname || '[name].pack.js'
      },

    // Webpack modules

    webpack_config.module = { loaders: [] }

    if ( options.babel ) {
      let test = ( options.babel.test ) ? options.babel.test : /\.js?x$/
      webpack_config.module.loaders.push({
        test: test,
        loader: 'babel-loader'
      })
    }

    if ( options.sourcemap ) webpack_config.devtool = 'source-map'

    // Webpack plugins

    webpack_config.plugins = []

    if ( options.uglify ) {
      webpack_config.plugins.push( new require('webpack').optimize.UglifyJsPlugin({
          compress: { warnings: false },
          output: { comments: false }
        })
      )
    }

    debug('webpack_config', webpack_config)

    /* istanbul ignore next */
    let webpack_fn = () => {
      this.gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe( webpackstream(webpack_config) )
      .pipe( this.gulp.dest(this.dest) )
    }

    debug('wbpack dest', this.dest)

    this.gulp.task(`${this.fullName()}`, webpack_fn)

    return true
  }

  // Babel
  createBabelTask( babel_options = {presets: ['es2015']} ){

    /* istanbul ignore next */
    let babel_fn = () => {
      this.gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(babel(babel_options))
      .pipe(this.gulp.dest(this.dest))
    }

    debug('babel dest', this.dest)

    this.gulp.task(`${this.fullName()}`, babel_fn)

    return true
  }

  // Babel with sourcemaps
  createBabelSourceMapTask( babel_options = {presets: ['es2015']} ){

    /* istanbul ignore next */
    let babel_smap_fn = () => {
      this.gulp.src(this.globs)
      .pipe( plumber(err => {
          console.error(err)
          if(!this.Gulp.watching) throw err
      }))
      .pipe(sourcemaps.init())
      .pipe(babel(babel_options))
      .pipe(sourcemaps.write('.'))
      .pipe(this.gulp.dest(this.dest))
    }

    debug('babel smap dest', this.dest)

    this.gulp.task(`${this.fullName()}`, babel_smap_fn)
    return true
  }

  // Sass
  createSassTask(){
    let self = this

    /* istanbul ignore next */
    let sass_fn = ()=> {
      this.gulp
      .src(this.globs)
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( this.gulp.dest(this.dest) )
    }

    debug('sass dest', this.dest)

    this.gulp.task(`${this.fullName()}`, sass_fn)

    return true
  }

  // Sass with sourcemaps
  createSassSourceMapTask(){
    let self = this

    /* istanbul ignore next */
    let sass_smap_fn = ()=> {
      this.gulp
      .src(this.globs)
      .pipe( sourcemaps.init() )
      .pipe( sass().on('error', function(err){
        sass.logError.call(this, err)
        if (!self.Gulp.watching) throw err
      }))
      .pipe( sourcemaps.write('.') )
      .pipe( this.gulp.dest(this.dest) )
    }

    debug('sass smap dest', this.dest)

    let tsk = this.gulp.task(`${this.fullName()}`, sass_smap_fn)
    debug('added gulp task', tsk.name)
    return true
  }

  // Run something in the shell
  run(commands){ return this.createShellTask(commands) }
  createShellTask(commands){
    this.gulp.task(`${this.fullName()}`, shell.task(commands))
    return true
  }

  // Run a gulp-sequence of tasks
  createSequence(...args){
    this.gulp.task(`${this.fullName()}`, gulpSequence(...args))
    return true
  }

  // Define a custom gulp task. Just pass the callback function
  // you would to `gulp.task()`.
  // Use `()=>{}` if you want `this` to refer to your gulp definition
  createCustom(fn){
    this.gulp.task(`${this.fullName()}`, fn)
    return true
  }

}

GulpGroupTask.init()

module.exports = { GulpGroupTask }

