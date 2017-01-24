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

    // `assets` sourcing

    dgulp.createAssetsJqueryNode('dist')
    dgulp.createAssetsBootstrap3SassNode('dist')
    dgulp.group('assets').sequence(['assets:jquery', 'assets:bootstrap3-sass'])
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
    group.sequence()
  }

  createAssetsBootstrap3SassBower(dest){
    let grp = this.group('bower').group('bootstrap3-sass')
    this.setupBootstrap3Sass(grp, 'bower_components', dest)

  }

  createAssetsBootstrap3SassNode(dest){
    let grp = this.group('assets').group('bootstrap3-sass')
    this.setupBootstrap3Sass(grp, 'node_modules', dest)

  }

}

module.exports = { DeployableGulp }

