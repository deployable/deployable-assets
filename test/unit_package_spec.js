const { initial, DeployableGulp, GulpGroups, GulpGroup, GulpGroupTask, DeployableAssets } = require('../')
const expect = require('chai').expect

describe('unit::deployable-assets', function(){

  describe('package imports', function(){

    it('should attach the Gulp class', function(){
      expect( DeployableGulp ).to.be.ok
    })

    it('should attach the DeployableGulp class', function(){
      expect( DeployableGulp.name ).to.equal( 'DeployableGulp' )
    })

    it('should attach the GulpGroups class', function(){
      expect( GulpGroups ).to.be.ok
    })

    it('should attach the GulpGroup task', function(){
      expect( GulpGroup ).to.be.ok
    })

    it('should attach the GulpGroupTask', function(){
      expect( GulpGroupTask ).to.be.ok
    })

    it('should attach an initial instance', function(){
      expect( initial ).to.be.ok
      expect( initial.constructor.name ).to.equal( 'DeployableGulp' )
    })

    it('should attach the DeployableAssets', function(){
      expect( DeployableAssets ).to.be.ok
      expect( DeployableAssets.name ).to.equal( 'DeployableAssets' )
    })

  })

})
