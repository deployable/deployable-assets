const expect = require('chai').expect
const { DeployableAssets } = require('../')


describe('unit::deployable-assets::DeployableAssets', function(){

  describe('class', function(){

    let ass = null

    beforeEach(function(){
      ass = new DeployableAssets({prefix: 'https://cdn.site/assets'})
    })

    it('should create an instance', function(){
      expect( ass ).to.be.ok
    })

    it('should create a js script', function(){
      expect( ass.js('js/some.js') ).to.equal( '<script src="https://cdn.site/assets/js/some.js" type="application/javascript"></script>' )
    })

    it('should create a css link tag', function(){
      expect( ass.css('css/some.css') ).to.equal( '<link rel="stylesheet" type="text/css" href="https://cdn.site/assets/css/some.css"/>' )
    })

    it('should create font css', function(){
      expect( ass.font('Wingdings', 'font/wd.woff') ).to.match( /^@font-face \{[\s\S]+\}$/ )
    })

    it('should create font css with url', function(){
      let re = new RegExp('https://cdn.site/assets/font/arial.woff')
      expect( ass.font('Arial', 'font/arial.woff') ).to.match( re )
    })

  })

})
