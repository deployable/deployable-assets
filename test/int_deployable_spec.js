/* global expect */
const { TestEnv } = require('deployable-test')
const path = require('path')

const { DeployableAssets } = require('../')


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

    beforeEach(function(){
      dassets.gulp.reset()
    })

    it('should create an instance', function(){
      expect( dassets ).to.be.ok
    })

    it('should have a gulp object attached', function(){
      expect( dassets.gulp ).to.be.ok
    })

    it('should create jquery assets task from node', function(){
      expect( dassets.createAssetsJquery({ source: 'node' }) ).to.be.ok
    })

    it('should create jquery assets task from bower', function(){
      expect( dassets.createAssetsJquery({ source: 'bower' }) ).to.be.ok
    })

    it('should create jquery assets task from bower', function(){
      expect( dassets.createAssetsJqueryBower() ).to.be.ok
    })

    it('should create jquery assets task with a custom destination', function(){
      expect( dassets.gulp.tasks['assets:jquery'] ).to.be.undefined
      expect( dassets.createAssetsJquery({ source: 'node', dest: 'other' }) ).to.be.ok
      expect( dassets.gulp.tasks['assets:jquery'] ).to.be.ok
      expect( dassets.group('assets').task('jquery').dest ).to.equal( 'other' )
    })

    it('should fail create jquery asset task with no options', function(){
      let fn = () => dassets.createAssetsJquery()
      expect( fn ).to.throw(/No source passed in options/)
    })

    it('should create bootstrap assets task from node', function(){
      expect( dassets.createAssetsBootstrap3Bower() ).to.be.ok
    })

    it('should create bootstrap assets task from node', function(){
      expect( dassets.createAssetsBootstrap3Node() ).to.be.ok
    })

    it('should create bootstrap3 assets task from node with destination', function(){
      expect( dassets.createAssetsBootstrap3Node({ dest: 'other' }) ).to.be.ok
    })

    it('should create bootstrap3 sass assets task from node', function(){
      expect( dassets.createAssetsBootstrap3SassNode() ).to.be.ok
    })

    it('should create bootstrap3 sass assets task from node with a destination', function(){
      expect( dassets.createAssetsBootstrap3SassNode({ dest: 'other' }) ).to.be.ok
    })

    it('should create bootstrap3 sass assets task from bower', function(){
      expect( dassets.createAssetsBootstrap3SassBower() ).to.be.ok
    })

    it('should create bootstrap3 sass assets task from bower with a destination', function(){
      expect( dassets.createAssetsBootstrap3SassBower({ dest: 'other' }) ).to.be.ok
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
        expect( dir ).to.be.a.directory().with.files([
          'bower.json',
          'gulpfile.js',
          'package.json'
        ])

        expect( path.join(dir,'app','assets','vendor','bootstrap-sass') )
          .to.be.a.directory().with.files([
            '_bootstrap.scss'
          ])

        expect( path.join(dir,'app','static','assets','css') )
          .to.be.a.directory().with.files([
            'site.css',
            'site.css.map'
          ])

        expect( path.join(dir,'app','static','assets','fonts') )
          .to.be.a.directory().with.files([
            'glyphicons-halflings-regular.ttf'
          ])

        expect( path.join(dir,'app','static','assets','js') )
          .to.be.a.directory().with.files([
            'site.pack.js',
            'site.pack.js.map',
            'site.js',
            'site.js.map'
          ])

        expect( path.join(dir,'app','static','assets','vendor') )
          .to.be.a.directory().with.files([
            'bootstrap.js',
            'bootstrap.min.js',
            'jquery.js',
            'jquery.slim.js',
          ])

        done()
      })
      gulp.start([`${task}-test`])
    })


  })

})
