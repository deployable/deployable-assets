const expect = require('chai').expect
const { GulpGroup } = require('../')


describe('unit::deployable-assets::GulpGroup', function(){

  describe('class', function(){

    let grp = null

    beforeEach( function(){
      grp = new GulpGroup('somegroup')
    })

    it('should create an instance', function(){
      expect( grp ).to.be.ok
    })

    it('should set the dest of a task', function(){
      let tsk = grp.addTask('atsk')
      expect( tsk ).to.be.ok
      expect( tsk.name ).to.equal( 'atsk')
    })

    it('should turn group into string', function(){
      expect( grp.toString() ).to.equal( 'somegroup' )
    })

    it('should turn group with task into string', function(){
      grp.addTask('atsk')
      expect( grp.toString() ).to.equal( `somegroup\nsomegroup:atsk` )
    })

    it('should turn two groups into string', function(){
      grp.addTask('tsk1')
      grp.addTask('tsk2')
      let json = grp.toJSON()
      expect( json ).to.have.keys('name', 'tasks')
      expect( json.name ).to.equal( 'somegroup' )
      expect( json.tasks ).to.have.keys('tsk1', 'tsk2')
    })

  })

})
