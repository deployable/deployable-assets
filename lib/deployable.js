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

      default: throw new Error('No group passed in options')
    }

    let tsk = this.group(options.group_name).task('jquery')
      .addGlob(`${options.src_prefix}/jquery/dist/jquery.js`)
      .addGlob(`${options.src_prefix}/jquery/dist/jquery.slim.js`)
      .setDestSuffix(this.dir_vendor)

    if (options.dest) tsk.setDest(options.dest)

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

  setupBootstrap3(group, src_prefix, dest){
    group.task('js')
      .addGlob(`${src_prefix}/bootstrap/dist/js/*.js`)
      .setDest(path.join(dest, 'js'))
      .createCopyTask()
    group.task('fonts')
      .addGlob(`${src_prefix}/bootstrap/dist/fonts/*.*`)
      .setDest(path.join(dest, 'fonts'))
      .createCopyTask()
    group.task('css')
      .addGlob(`${src_prefix}/bootstrap/dist/css/*.css`)
      .setDest(path.join(dest, 'css'))
      .createCopyTask()
    group.sequence()
  }

  createAssetsBootstrap3Bower(dest){
    let grp = this.group('bower').group('bootstrap3')
    this.setupBootstrap3(grp, 'bower_components', dest)
  }

  createAssetsBootstrap3Node(dest){
    let grp = this.group('assets').group('bootstrap3')
    this.setupBootstrap3(grp, 'node_modules', dest)
  }

  // Do all the boostrap 3 things
  setupBootstrap3Sass( group, src_prefix, options = {} ){

    group.task('js')
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
  }

  createAssetsBootstrap3SassBower( options = {} ){
    let grp = this.group('bower').group('bootstrap3-sass')
    if (options.dest) grp.setDest(options.dest)
    this.setupBootstrap3Sass(grp, 'bower_components', options)

  }

  createAssetsBootstrap3SassNode( options = {} ){
    let grp = this.group('assets').group('bootstrap3-sass')
    if (options.dest) grp.setDest(options.dest)
    this.setupBootstrap3Sass(grp, 'node_modules', options)

  }

}

module.exports = { DeployableAssets }

