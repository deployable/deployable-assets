const { TestEnv } = require('deployable-test')
const expect = require('chai').expect
const { DeployableAssets } = require('../')
const path = require('path')
require('chai').use(require('chai-fs'))


describe('integration::deployable-assets::DeployableAssets::', function(){


  describe('Class setup', function(){

    let dassets = null

    before(function(){
      dassets = DeployableAssets.setup()
    })

    it('should create an instance of DeployableAssets', function(){
      expect( dassets ).to.be.ok
    })

    it('should have a standard gulp object attached', function(){
      expect( dassets.gulp ).to.be.ok
    })

    it('should have standard gulp tasks', function(){
      expect( dassets.gulp.tasks ).to.have.keys(
        'assets',
        'assets:bootstrap3-sass',
        'assets:bootstrap3-sass:fonts',
        'assets:bootstrap3-sass:js',
        'assets:bootstrap3-sass:sass',
        'assets:jquery',
        'build',
        'build:watch',
        'css',
        'css:sass',
        'js',
        'js:babel',
        'js:webpackbabel',
        'default'
      )
    })

  })


  describe('class instance', function(){

    let dassets = null

    before(function(){
      dassets = new DeployableAssets()
    })

    it('should create an instance', function(){
      expect( dassets ).to.be.ok
    })

    it('should have a gulp object attached', function(){
      expect( dassets.gulp ).to.be.ok
    })

  })


  describe('running the `build` task', function(){

    let dassets = null
    let gulp = null
    let dir = null
    let task = 'build'

    before(function(){
      return TestEnv.copyFixtureToTmpOutputAsync('module').then(res => {
        dir = res
        dassets = DeployableAssets.setup({cwd:dir})
        dassets.setDebug(true)
        gulp = dassets.gulp
      })
    })

    after(function(){
      TestEnv.cleanOutputAsync('build')
      gulp.reset()
    })

    it('should have the required build task', function(){
      expect( gulp.tasks[task] ).to.be.ok
    })

    it('should run the build task via dummy', function(done){
      gulp.task(`${task}-test`, [task], () => {
        expect( dir ).to.be.a.directory().with.files(['bower.json','gulpfile.js','package.json'])
        expect( path.join(dir,'app','assets','vendor','bootstrap-sass') )
          .to.be.a.directory().with.files(['_bootstrap.scss'])
        expect( path.join(dir,'app','static','assets','css') )
          .to.be.a.directory().with.files(['site.css', 'site.css.map'])
        expect( path.join(dir,'app','static','assets','js') )
          .to.be.a.directory().with.files(['site.pack.js', 'site.pack.js.map', 'bootstrap.js', 'bootstrap.js.map', 'bootstrap.min.js', 'bootstrap.min.js.map', 'jquery.js', 'jquery.slim.js', 'site.js', 'site.js.map'])
        done()
      })
      gulp.start([`${task}-test`])
    })


  })

})
