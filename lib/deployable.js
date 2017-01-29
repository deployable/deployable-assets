const debug = require('debug')('dply:assets:deployable_gulp')
const path = require('path')
const { Assets } = require('./assets')


class DeployableAssets extends Assets {

  static setup( options = {} ){

    let dgulp = new DeployableAssets({ gulp: options.gulp, cwd: options.cwd, debug: options.debug })

    // Set the default destination for others to append to
    let src_path = options.src || 'app/assets'
    dgulp.setSourcePath(src_path)

    let dest_path = options.dest || 'app/static/assets'
    dgulp.setDest(dest_path)

    let public_url = options.public || '/assets'
    dgulp.setPublicUrl(public_url)

    debug('src:%s dest:%s public:%s', src_path, dest_path, public_url)

    // `assets` sourcing

    dgulp.createAssetsJqueryNode(dest_path)
    dgulp.createAssetsBootstrap3SassNode(src_path, dest_path)
    dgulp.group('assets').sequence()

    // `js` tasks, go in dest/js

    let js = dgulp.group('js').setDestSuffix('js')

    js.task('babel')
      .addGlob('app/assets/js/*.js')
      .createBabelSourceMapTask({presets: ['es2015']})
      //.createBabelTask({presets: ['es2015']})

    js.task('webpackbabel')
      .addGlob('app/assets/js/*.js')
      .createWebpackTask({sourcemap: true})

    js.sequence('js:babel', 'js:webpackbabel')

    // `css` tasks, go in dest/css

    let css = dgulp.group('css').setDestSuffix('css')

    css.task('sass')
      .addGlob('app/assets/css/*.scss')
      .addGlob('app/assets/css/*.sass')
      .createSassSourceMapTask()
      //.createSassTask()

    css.sequence('css:sass')

    // `build` helper tasks

    let build = dgulp.group('build')
    build.sequence( 'assets', [ 'css', 'js' ] )
    build.watch( 'css', 'js' )

    debug('dgulp', dgulp.toJSON())

    return dgulp
  }

  constructor ( options = {} ) {
    super(options)
  }

  createAssetsJqueryBower(dest){
    this.group('bower').task('jquery')
      .addGlob('bower_components/jquery/dist/jquery.js')
      .addGlob('bower_components/jquery/dist/jquery.slim.js')
      .setDest(path.join(dest,'js'))
      .createCopyTask()
  }

  createAssetsJqueryNode(dest){
    this.group('assets').task('jquery')
      .addGlob('node_modules/jquery/dist/jquery.js')
      .addGlob('node_modules/jquery/dist/jquery.slim.js')
      .setDest(path.join(dest,'js'))
      .createCopyTask()
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

  setupBootstrap3Sass(group, src_prefix){

    group.task('js')
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.js`)
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.min.js`)
      .setDestSuffix(this.dir_js)
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

  createAssetsBootstrap3SassBower(dest){
    let grp = this.group('bower').group('bootstrap3-sass').setDest(dest)
    this.setupBootstrap3Sass(grp, 'bower_components', dest)

  }

  createAssetsBootstrap3SassNode(dest){
    let grp = this.group('assets').group('bootstrap3-sass').setDest(dest)
    this.setupBootstrap3Sass(grp, 'node_modules', dest)

  }

}

module.exports = { DeployableAssets }

