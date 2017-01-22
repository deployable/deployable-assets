const debug = require('debug')('dply:assets:deployable_gulp')
const { Gulp } = require('./gulp')

class DeployableGulp extends Gulp {

  static setup( options = {} ){

    let dest_path = options.local || 'app/public/assets'
    let public_url = options.public || '/assets'

    debug('local:%s public:%s', dest_path, public_url)
    let dgulp = new DeployableGulp()

    // Set the default destination for others to append to
    dgulp.setDest(dest_path)
    dgulp.setPublic(public_url)

    let bower = dgulp.group('bower')
    let js = dgulp.group('js').setDestSuffix('js')
    let css = dgulp.group('css').setDestSuffix('css')
    let assets = dgulp.group('assets')

    // bower
    bower.task('install')
      .createShellTask(['bower install'])

    bower.task('jquery')
      .addGlob('bower_components/jquery/dist/jquery.js')
      .addGlob('bower_components/jquery/dist/jquery.slim.js')
      .setDestSuffix('vendor')
      .createCopyTask()

    bower.task('bootstrap')
      .addGlob('bower_components/bootstrap/dist/js/bootstrap.js')
      .setDestSuffix('vendor')
      .createCopyTask()

    bower.task('bootstrap-fonts')
      .addGlob('bower_components/bootstrap/dist/fonts/*')
      .setDestSuffix('fonts/bootstrap')
      .createCopyTask()

    // Copy bootstrap sass to src area for use in our asset build
    bower.task('bootstrap-sass')
      .addGlob('bower_components/bootstrap-sass/assets/stylesheets/**/*')
      .setDest('app/assets/vendor/bootstrap-sass')
      .createCopyTask()

    // Default group gulp-sequence
    bower.sequence('bower:install', [
      'bower:jquery',
      'bower:bootstrap',
      'bower:bootstrap-sass',
      'bower:bootstrap-fonts'
    ])

    // `js` tasks

    js.task('babel')
      .addGlob('app/assets/js/**/*.es6')
      .setDestSuffix('js')
      //.createBabelSourceMapTask({presets: ['es2015']})
      .createBabelTask({presets: ['es2015']})

    js.sequence('js:babel')

    // `css` tasks

    css.task('sass')
      .addGlob('app/assets/css/*.scss')
      .addGlob('app/assets/css/*.sass')
      .setDestSuffix('css')
      //.createSassSourceMapTask()
      .createSassTask()

    css.sequence('css:sass')


    // `assets` helper tasks

    assets.sequence( 'bower', ['css', 'js'] )
    //assets.watch( 'js', 'css' )
    assets.watch( 'js', 'css' )

    debug('dgulp', dgulp.toJSON())

    return dgulp
  }

  constructor ( options = {} ) {
    super(options)
  }

}

module.exports = { DeployableGulp }

