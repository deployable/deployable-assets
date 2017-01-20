const expect = require('chai').expect
const { DeployableAssets } = require('../')


describe('unit::deployable-assets::DeployableAssets', function(){

  describe('class', function(){

    it('should return an instance', function(){
      DeployableAssets.createInstance({prefix: '/wakka'})
      expect( DeployableAssets.path('a') ).to.equal( '/wakka/a' )
    })

  })

  describe('instance', function(){

    let ass = null

    beforeEach(function(){
      ass = new DeployableAssets({prefix: 'https://cdn.io'})
    })

    it('should create an instance', function(){
      expect( ass ).to.be.ok
    })

    it('should create google font linked css', function(){
      expect( ass.path('file.test') ).to.equal( 'https://cdn.io/file.test' )
    })

    it('should create google font linked css', function(){
      expect( ass.path(['js','file.test']) ).to.equal( 'https://cdn.io/js/file.test' )
    })

    it('should create a js script', function(){
      expect( ass.js('js/some.js') ).to.equal( '<script src="https://cdn.io/js/some.js" type="application/javascript"></script>' )
    })

    it('should create a css link tag', function(){
      expect( ass.css('css/some.css') ).to.equal( '<link rel="stylesheet" type="text/css" href="https://cdn.io/css/some.css"/>' )
    })

    it('should create font css', function(){
      let re = /^<style type="text\/css">\n  @font-face \{[\s\S]+\}\n<\/style>$/
      expect( ass.font('Wingdings', 'font/wd.woff') ).to.match( re )
    })

    it('should create font css with url', function(){
      let re = new RegExp('https://cdn.io/font/arial.woff')
      expect( ass.font('Arial', 'font/arial.woff') ).to.match( re )
    })

    it('should create google font linked css', function(){
      expect( ass.googleFont('Arial') ).to.equal( '<link href="https://fonts.googleapis.com/css?family=Arial" rel="stylesheet">' )
    })

  })

})
