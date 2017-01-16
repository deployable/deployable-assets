const DeployableAssets = require('../')

describe('Unit::deployable-assets', function(){

  describe('Something does something', function(){
  
    let assets = null

    beforeEach(function(){
      assets = new DeployableAssets({ prefix: '/some_url' })
    })
 
    it('should do something with module', function(){
      expect( assets ).to.be.ok
    })

    it('should do js', function(){
      expect( assets.js('something.js') ).to.equal( '<script src="/some_url/something.js" type="application/javascript"></script>' )
    })

    it('should do css', function(){
      expect( assets.css('otherthing.css') ).to.equal( '<link rel="stylesheet" type="text/css" href="/some_url/otherthing.css"/>' )
    })
 
    it('should return a plain path', function(){
      expect( assets.path('img/upload.png') ).to.equal('/some_url/img/upload.png')
    })

  })

})
