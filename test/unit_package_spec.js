const DeployableAssets = require('../')

describe('Unit::deployable-assets', function(){

  describe('Something does something', function(){
  
    let assets = null

    beforeEach(function(){
      assets = new DeployableAssets({ prefix: '/wat' })
    })
 
    it('should do something with module', function(){
      expect( assets ).to.be.ok
    })

    it('should do js', function(){
      expect( assets.js('something') ).to.equal( '<script src="/wat/something" type="application/javascript"></script>' )
    })

    it('should do css', function(){
      expect( assets.css('otherthing') ).to.equal( '<link rel="stylesheet" type="text/css" href="/wat/otherthing"/>' )
    })

  })

})
