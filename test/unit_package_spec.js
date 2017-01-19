const { initial, Gulp, GulpGroups, GulpGroup, GulpGroupTask, DeployableGulp } = require('../')
const expect = require('chai').expect

describe('Unit::deployable-assets-gulp', function(){

  describe('package imports', function(){

    it('should attach the Gulp class', function(){
      expect( Gulp ).to.be.ok
    })

    it('should attach the Gulp class', function(){
      expect( Gulp.name ).to.equal( 'Gulp' )
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
      expect( initial.constructor.name ).to.equal( 'Gulp' )
    })

    it('should attach the DeployableGulp', function(){
      expect( DeployableGulp ).to.be.ok
      expect( DeployableGulp.name ).to.equal( 'DeployableGulp' )
    })

  })

})
