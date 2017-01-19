const expect = require('chai').expect
const { DeployableGulp } = require('../')


describe('unit::deployable-assets::DeployableGulp', function(){

  describe('class', function(){

    it('should create an instance', function(){
      expect( new DeployableGulp() ).to.be.ok
    })

  })

})
