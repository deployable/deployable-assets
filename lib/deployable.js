const debug = require('debug')('dply:assets:deployable_gulp')
const path = require('path')
const { Gulp } = require('./gulp')


class DeployableGulp extends Gulp {

  static setup( options = {} ){

    let dgulp = new DeployableGulp({ gulp: options.gulp })

    // Set the default destination for others to append to
    let dest_path = options.local || 'dist'
    dgulp.setDest(dest_path)

    let public_url = options.public || '/assets'
    dgulp.setPublic(public_url)

    debug('local:%s public:%s', dest_path, public_url)

    // bower

    dgulp.createNodeJquery('dist')
    dgulp.createNodeBootstrap3Sass('dist')

    // `js` tasks

    let js = dgulp.group('js').setDestSuffix('js')

    js.task('babel')
      .addGlob('app/assets/js/*.js')
      .createBabelSourceMapTask({presets: ['es2015']})
      //.createBabelTask({presets: ['es2015']})

    js.task('webpackbabel')
      .addGlob('app/assets/js/*.js')
      .createWebpackTask({sourcemap: true})

    js.sequence('js:babel', 'js:webpackbabel')

    // `css` tasks

    let css = dgulp.group('css').setDestSuffix('css')

    css.task('sass')
      .addGlob('app/assets/css/*.scss')
      .addGlob('app/assets/css/*.sass')
      .createSassSourceMapTask()
      //.createSassTask()

    css.sequence('css:sass')

    // `assets` helper tasks

    let assets = dgulp.group('assets')
    assets.sequence( ['css', 'js'] )
    assets.watch( 'js', 'css' )

    debug('dgulp', dgulp.toJSON())

    return dgulp
  }

  constructor ( options = {} ) {
    super(options)
  }

  createBowerJquery(dest){
    this.group('bower').task('jquery')
      .addGlob('bower_components/jquery/dist/jquery.js')
      .addGlob('bower_components/jquery/dist/jquery.slim.js')
      .setDest(dest)
      .createCopyTask()
  }

  createNodeJquery(dest){
    this.group('assets').task('jquery')
      .addGlob('node_modules/jquery/dist/jquery.js')
      .addGlob('node_modules/jquery/dist/jquery.slim.js')
      .setDest(dest)
      .createCopyTask()
  }

  setupBootstrap3(group, src_prefix, dest){
    group.task('js')
      .addGlob(`${src_prefix}/bootstrap/dist/js/*.js`)
      .setDest(path.join(dest,'js'))
      .createCopyTask()
    group.task('fonts')
      .addGlob(`${src_prefix}/bootstrap/dist/fonts/*.*`)
      .setDest(path.join(dest,'fonts'))
      .createCopyTask()
    group.task('css')
      .addGlob(`${src_prefix}/bootstrap/dist/css/*.css`)
      .setDest(path.join(dest,'css'))
      .createCopyTask()
    group.sequence(['js','fonts','css'])
  }

  createBowerBootstrap3(dest){
    let grp = this.group('bower').group('bootstrap3')
    this.setupBootstrap3(grp, 'bower_components', dest)
  }

  createNodeBootstrap3(dest){
    let grp = this.group('assets').group('bootstrap3')
    this.setupBootstrap3(grp, 'node_modules', dest)
  }

  setupBootstrap3Sass(group, src_prefix, dest){
    group.task('js')
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.js`)
      .addGlob(`${src_prefix}/bootstrap-sass/assets/javascripts/bootstrap.min.js`)
      .setDest(path.join(dest,'js'))
      .createCopyTask()
    group.task('fonts')
      .addGlob(`${src_prefix}/bootstrap-sass/assets/fonts/*`)
      .setDest(path.join(dest,'fonts'))
      .createCopyTask()
    group.task('sass')
      .addGlob(`${src_prefix}/bootstrap-sass/stylesheets/_bootstrap.scss`)
      .addGlob(`${src_prefix}/bootstrap-sass/stylesheets/bootstrap`)
      .setDest(path.join(dest,'sass'))
      .createCopyTask()
    group.sequence(['js','fonts','sass'])
  }

  createBowerBootstrap3Sass(dest){
    let grp = this.group('bower').group('bootstrap3-sass')
    this.setupBootstrap3Sass(grp, 'bower_components', dest)

  }

  createNodeBootstrap3Sass(dest){
    let grp = this.group('assets').group('bootstrap3-sass')
    this.setupBootstrap3Sass(grp, 'node_modules', dest)

  }

}

module.exports = { DeployableGulp }

