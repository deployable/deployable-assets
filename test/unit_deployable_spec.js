const expect = require('chai').expect
const { DeployableGulp } = require('../')


describe('Unit::DeployableGulp', function(){

  describe('class', function(){

    it('should create an instance', function(){
      expect( new DeployableGulp() ).to.be.ok
    })

  })

})
