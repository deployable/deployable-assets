const expect = require('chai').expect
const { DeployableGulp } = require('../')


describe('unit::deployable-assets::DeployableGulp', function(){

  describe('Class setup', function(){

    let dgulp = null

    before(function(){
      dgulp = DeployableGulp.setup()
    })

    it('should create an instance of DeployableGulp', function(){
      expect( dgulp ).to.be.ok
    })

    it('should have a standard gulp object attached', function(){
      expect( dgulp.gulp ).to.be.ok
    })

    it('should have standard gulp tasks', function(){
      expect( dgulp.gulp.tasks ).to.have.keys(
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

    let dgulp = null

    before(function(){
      dgulp = new DeployableGulp()
    })

    it('should create an instance', function(){
      expect( dgulp ).to.be.ok
    })

    it('should have a gulp object attached', function(){
      expect( dgulp.gulp ).to.be.ok
    })

  })

})
