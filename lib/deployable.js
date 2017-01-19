const { GulpError, Gulp } = require('./gulp')

class DeployableGulp extends Gulp {

  constructor ( options = {} ) {
    super(options)

    let bower = this.groups.getGroup('bower')
    let js = this.groups.getGroup('js')
    let css = this.groups.getGroup('css')

    // bower
    bower.getTask('install')
      .addShellTask(['bower install'])

    bower.getTask('jquery')
      .addGlob('bower_components/jquery/dist/jquery.js')
      .addGlob('bower_components/jquery/dist/jquery.slim.js')
      .addDest('app/assets/vendor')
      .addCopyTask()

    bower.getTask('bootstrap')
      .addGlob('bower_components/bootstrap/dist/js/bootstrap.js')
      .addDest('app/assets/vendor')
      .addCopyTask()

    bower.getTask('sass')
      .addGlob('bower_components/bootstrap-sass/assets/stylesheets/**/*')
      .addDest('app/assets/vendor/bootstrap-sass')
      .addCopyTask()

    bower.getTask('fonts')
      .addGlob(['bower_components/bootstrap/dist/fonts/*'])
      .addDest( './app/public/assets/fonts/bootstrap')
      .addCopyTask()

    // Default group gulp-sequence
    bower.sequence('bower:install', [
      'bower:jquery',
      'bower:bootstrap',
      'bower:bootstrap-sass',
      'bower:bootstrap-fonts'
    ])

    // js
    js.getTask('babel')
      .addGlob('app/assets/js/**/*.es6')
      .addDest('app/public/assets/js')
      .addBabelSourceMapTask({presets: ['es2015']})

    js.sequence('babel')

    // css
    css.getTask('sass')
      .addGlob('app/assets/css/site.scss')
      .addGlob('app/assets/css/bootstrap.scss')
      .addDest('app/public/assets/css')
      .addSassSourceMapTask()

    css.sequence('sass')

  }

}

module.exports = { DeployableGulp }

