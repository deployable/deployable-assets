const { DeployableGulp } = require('./lib')
const { gulp, shell, babel, watch, batch,
  plumber, sourcemaps, gulpSequence, sass } = DeployableGulp


// Global watching state flag so errors
// can exit properly (rc != 0) when using the normal, no watching builds
let watching = false


// ## Bower

gulp.task('bower:install', shell.task(['bower install']) )

gulp.task('bower:jquery', function() {
  gulp.src([
    './bower_components/jquery/dist/jquery.js',
    './bower_components/jquery/dist/jquery.slim.js'
  ])
  .pipe( gulp.dest('./app/assets/vendor') )
})

gulp.task('bower:bootstrap', function() {
  gulp.src([
    'bower_components/bootstrap/dist/js/bootstrap.js'
  ])
  .pipe( gulp.dest('./app/assets/vendor') )
})

gulp.task('bower:bootstrap-sass', function() {
  gulp
    .src(['bower_components/bootstrap-sass/assets/stylesheets/**/*'])
    .pipe( gulp.dest('./app/assets/vendor/bootstrap-sass') )
})


gulp.task('bower:bootstrap-fonts', function() {
  gulp
    .src(['bower_components/bootstrap/dist/fonts/*'])
    .pipe( gulp.dest('./app/public/assets/fonts/bootstrap') )
})

gulp.task('bower', gulpSequence('bower:install', [
    'bower:jquery',
    'bower:bootstrap',
    'bower:bootstrap-sass',
    'bower:bootstrap-fonts'
  ])
)


// ## css

let sass_globs = [
  'app/assets/css/site.scss',
  'app/assets/css/bootstrap.scss'
]
let sass_out = 'app/public/assets/css'

gulp.task('sass', () => {
  return gulp
    .src(sass_globs)
    .pipe( sourcemaps.init() )
    .pipe( sass().on('error', function(err){
      sass.logError.call(this, err)
      if (!watching) throw err
    }))
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest(sass_out) )
})

let css_globs = [ ...sass_globs ]
gulp.task('css', ['sass'])


// ## js

let babel_globs = [ 'app/assets/js/**/*.es6' ]
let babel_out = [ 'app/public/assets/js' ]

gulp.task('babel', () => {
  gulp
    .src(babel_globs)
    .pipe( plumber(err => {
        console.error(err)
        if(!watching) throw err
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(babel_out))
})

let js_globs = [ ...babel_globs ]
gulp.task('js', ['babel'])


// ## Assets

gulp.task('assets', gulpSequence('bower', ['css', 'js']))

gulp.task('assets:watch', function () {
    watching = true
    gulp.start('js')
    gulp.start('css')
    watch(js_globs, batch((events, done) => gulp.start('js', done)))
    watch(css_globs, batch((events, done) => gulp.start('css', done)))
})


// ## Default

gulp.task('default', function() {
  // place code for your default task here
})
