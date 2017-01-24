const expect = require('chai').expect
const { DeployableGulp } = require('../')


describe('unit::deployable-assets::DeployableGulp', function(){

  describe('class', function(){

    let dgulp = null

    before(function(){
      dgulp = DeployableGulp.setup()
    })

    it('should create an instance', function(){
      expect( dgulp ).to.be.ok
    })

    it('should create an instance', function(){
      expect( dgulp.gulp ).to.be.ok
    })

  })

  describe('instance', function(){

    let dgulp = null

    before(function(){
      dgulp = new DeployableGulp()
    })

    it('should create an instance', function(){
      expect( dgulp ).to.be.ok
    })

    it('should create an instance', function(){
      expect( dgulp.gulp ).to.be.ok
    })

  })

})
