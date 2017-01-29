const debug = require('debug')('dply:assets:deployable_gulp')
const path = require('path')
const { Assets } = require('./assets')


class DeployableAssets extends Assets {

  static setup( options = {} ){

    let dassets = new DeployableAssets({ gulp: options.gulp, cwd: options.cwd, debug: options.debug })

    // Set the default destination for others to append to
    let src_path = options.src || 'app/assets'
    dassets.setSourcePath(src_path)

    let dest_path = options.dest || 'app/static/assets'
    dassets.setDest(dest_path)

    let public_url = options.public || '/assets'
    dassets.setPublicUrl(public_url)

    debug('src:%s dest:%s public:%s', src_path, dest_path, public_url)

    // `assets` sourcing

    dassets.createAssetsJqueryNode()
    dassets.createAssetsBootstrap3SassNode(src_path, dest_path)
    dassets.group('assets').sequence()

    // `js` tasks, go in dest/js

    let js = dassets.group('js').setDestSuffix('js')

    js.task('babel')
      .addGlob('app/assets/js/*.js')
      .createBabelSourceMapTask({presets: ['es2015']})
      //.createBabelTask({presets: ['es2015']})

    js.task('webpackbabel')
      .addGlob('app/assets/js/*.js')
      .createWebpackTask({sourcemap: true})

    js.sequence('js:babel', 'js:webpackbabel')

    // `css` tasks, go in dest/css

    let css = dassets.group('css').setDestSuffix('css')

    css.task('sass')
      .addGlob('app/assets/css/*.scss')
      .addGlob('app/assets/css/*.sass')
      .createSassSourceMapTask()
      //.createSassTask()

    css.sequence('css:sass')

    // `build` helper tasks

    let build = dassets.group('build')
    build.sequence( 'assets', [ 'css', 'js' ] )
    build.watch( 'css', 'js' )

    debug('dassets', dassets.toJSON())

    return dassets
  }

  constructor ( options = {} ) {
    super(options)
  }

  createAssetsJquery( options = {} ){
    switch (options.source) {
      case 'bower':
        options.src_prefix = 'bower_components'
        options.group_name = 'bower'
        break
      case 'node':
        options.src_prefix = 'node_modules'
        options.group_name = 'assets'
        break

      default: throw new Error('No source passed in options')
    }

    let tsk = this.group(options.group_name).task('jquery')
      .addGlob(`${options.src_prefix}/jquery/dist/jquery.js`)
      .addGlob(`${options.src_prefix}/jquery/dist/jquery.slim.js`)

    if (options.dest) {
      tsk.setDest(options.dest)
    } else {
      tsk.setDestSuffix(this.dir_vendor)
    }

    tsk.createCopyTask()
    return this
  }

  createAssetsJqueryBower( options = {} ){
    options.source = 'bower'
    return this.createAssetsJquery(options)
  }

  createAssetsJqueryNode( options = {} ){
    options.source = 'node'
    return this.createAssetsJquery(options)
  }

  setupBootstrap3( group, options = {} ){

    if (!options.src_prefix) options.src_prefix = 'node_modules'

    let tsk_js = group.task('js')
    tsk_js.addGlob(`${options.src_prefix}/bootstrap/dist/js/*.js`)
    if (options.dest) tsk_js.setDest(path.join(options.dest, 'js'))
    else tsk_js.setDestSuffix(this.dir_vendor)
    tsk_js.createCopyTask()

    let tsk_font = group.task('fonts')
    tsk_font.addGlob(`${options.src_prefix}/bootstrap/dist/fonts/*.*`)
    if (options.dest) tsk_font.setDest(path.join(options.dest, 'font'))
    else tsk_font.setDestSuffix(this.dir_vendor)
    tsk_font.createCopyTask()

    let tsk_css = group.task('css')
    tsk_css.addGlob(`${options.src_prefix}/bootstrap/dist/css/*.css`)
    if (options.dest) tsk_css.setDest(path.join(options.dest, 'css'))
    else tsk_css.setDestSuffix(this.dir_vendor)
    tsk_css.createCopyTask()

    group.sequence()

    return group
  }

  createAssetsBootstrap3Bower( options = {} ){
    let grp = this.group('bower').group('bootstrap3')
    return this.setupBootstrap3(grp, { src_prefix: 'bower_components', dest: options.dest})
  }

  createAssetsBootstrap3Node( options = {} ){
    let grp = this.group('assets').group('bootstrap3')
    return this.setupBootstrap3(grp, { src_prefix: 'node_modules', dest: options.dest })
  }


  // Do all the boostrap sass 3 things

  setupBootstrap3Sass( group, src_prefix, options = {} ){

    let task_js = group.task('js')
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.js`)
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.min.js`)
      .setDestSuffix(this.dir_vendor)
      .createCopyTask()

    group.task('fonts')
      .addGlob(`${src_prefix}/bootstrap-sass/assets/fonts/bootstrap/*`)
      .setDestSuffix(this.dir_font)
      .createCopyTask()

    // The scss is a little different, it goes with our sources as it needs
    // to be compiled by a subsequent task
    group.task('sass')
      //.addGlob(`${src_prefix}/bootstrap-sass/assets/stylesheets/_bootstrap.scss`)
      .addGlob(`${src_prefix}/bootstrap-sass/assets/stylesheets/**/*.scss`)
      .setDest(this.getSourcePath(this.dir_vendor, 'bootstrap-sass'))
      .createCopyTask()

    // Run everything in the group by default
    group.sequence()

    return group
  }

  createAssetsBootstrap3SassBower( options = {} ){
    let grp = this.group('bower').group('bootstrap3-sass')
    return this.setupBootstrap3Sass(grp, 'bower_components', options)
  }

  createAssetsBootstrap3SassNode( options = {} ){
    let grp = this.group('assets').group('bootstrap3-sass')
    return this.setupBootstrap3Sass(grp, 'node_modules', options)
  }

}

module.exports = { DeployableAssets }

