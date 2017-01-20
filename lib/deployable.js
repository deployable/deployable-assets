const { GulpError, Gulp } = require('./gulp')

class DeployableGulp extends Gulp {

  static create(){
    let dgulp = new DeployableGulp()
    dgulp.setDest('app/assets')

    let bower = dgulp.groups.getGroup('bower')
    let js = dgulp.groups.getGroup('js')
    let css = dgulp.groups.getGroup('css')
    let assets = dgulp.groups.addGroup('assets')

    // bower
    bower.task('install')
      .createShellTask(['bower install'])

    bower.task('jquery')
      .addGlob('bower_components/jquery/dist/jquery.js')
      .addGlob('bower_components/jquery/dist/jquery.slim.js')
      .setDest('app/assets/vendor')
      .createCopyTask()

    bower.task('bootstrap')
      .addGlob('bower_components/bootstrap/dist/js/bootstrap.js')
      .setDest('app/assets/vendor')
      .createCopyTask()

    bower.task('bootstrap-sass')
      .addGlob('bower_components/bootstrap-sass/assets/stylesheets/**/*')
      .setDest('app/assets/vendor/bootstrap-sass')
      .createCopyTask()

    bower.task('bootstrap-fonts')
      .addGlob(['bower_components/bootstrap/dist/fonts/*'])
      .setDest( 'app/public/assets/fonts/bootstrap')
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
      .setDest('app/public/assets/js')
      .createBabelSourceMapTask({presets: ['es2015']})

    js.sequence('babel')

    // `css`

    css.task('sass')
      .addGlob('app/assets/css/site.scss')
      .addGlob('app/assets/css/bootstrap.scss')
      .setDest('app/public/assets/css')
      .createSassSourceMapTask()

    css.sequence('sass')


    // `assets` helper tasks

    assets.sequence( 'bower', ['css', 'js'] )
    //assets.watch( 'js', 'css' )
    assets.watch( 'js', 'css' )

    return dgulp
  }

  constructor ( options = {} ) {
    super(options)
  }

}

module.exports = { DeployableGulp }

