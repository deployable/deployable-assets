const expect = require('chai').expect
const { GulpGroups } = require('../')


describe('unit::deployable-assets::GulpGroups', function(){

  describe('class', function(){

    let grps = null

    beforeEach( function(){
      grps = new GulpGroups()
    })

    it('should create an instance', function(){
      expect( grps ).to.be.ok
    })

    it('should set the dest of a task', function(){
      let grp = grps.addGroup('grp')
      expect( grp ).to.be.ok
      expect( grp.name ).to.equal( 'grp')
    })

    it('should turn an empty groups into string', function(){
      expect( grps.toString() ).to.equal( '' )
    })

    it('should turn one group into string', function(){
      grps.addGroup('grp')
      expect( grps.toString() ).to.equal( `Group:grp` )
    })

    it('should turn two groups into string', function(){
      grps.addGroup('grp1')
      grps.addGroup('grp2')
      expect( grps.toString() ).to.equal( `Group:grp1\nGroup:grp2` )
    })

    it('should turn two groups into string', function(){
      grps.addGroup('grp1')
      grps.addGroup('grp2')
      expect( grps.toJSON() ).to.have.keys('grp1', 'grp2')
    })


  })

})
