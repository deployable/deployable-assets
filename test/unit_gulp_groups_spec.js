const expect = require('chai').expect
const { GulpGroups } = require('../')


describe('unit::deployable-assets::GulpGroups', function(){

  describe('class', function(){

    let grps = null

    beforeEach( function(){
      let rgu = { fullName: ()=> '', gulp: require('gulp') }
      grps = new GulpGroups('', rgu, rgu)
    })

    it('should create an instance', function(){
      expect( grps ).to.be.ok
    })

    it('should set the dest of a task', function(){
      let grp = grps.group('grp')
      expect( grp ).to.be.ok
      expect( grp.name ).to.equal( 'grp')
    })

    it('should turn an empty groups into string', function(){
      expect( grps.toString() ).to.equal( '' )
    })

    it('should turn one group into string', function(){
      grps.group('grp')
      expect( grps.toString() ).to.equal( `grp` )
    })

    it('should turn two groups into string', function(){
      grps.group('grp1')
      grps.group('grp2')
      expect( grps.toString() ).to.equal( `grp1\ngrp2` )
    })

    it('should turn two groups into string', function(){
      grps.group('grp1')
      grps.group('grp2')
      expect( grps.toJSON() ).to.have.keys('grp1', 'grp2')
    })

    it('should set a group dest', function(){
      grps.setDest('test')
      expect( grps.dest ).to.eql( 'test' )
    })

    it('should set a group suffix', function(){
      expect( grps.setDestSuffix('test') ).to.be.ok
      expect( grps.dest_suffix ).to.equal('test')
    })

    it('should set a group dest', function(){
      let grp = grps.group('grp1')
      expect( grp ).to.eql( grps.group('grp1') )
    })

    it('should get globs for groups', function(){
      expect( grps.getGlobs() ).to.eql( [] )
    })

    it('should get globs for groups', function(){
      grps.group('test').task('test').addGlob('wakka').addGlob('pakka')
      expect( grps.getGlobs() ).to.eql( ['wakka','pakka'] )
    })

  })

})
