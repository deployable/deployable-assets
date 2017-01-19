const expect = require('chai').expect
const { DeployableAssets } = require('../')


describe('unit::deployable-assets::DeployableAssets', function(){

  describe('class', function(){

    it('should create an instance', function(){
      expect( new DeployableAssets() ).to.be.ok
    })

  })

})
