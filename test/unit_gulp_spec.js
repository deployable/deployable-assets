const expect = require('chai').expect
const { Gulp } = require('../')


describe('Unit::Gulp', function(){

  describe('class', function(){

    let glp = new Gulp()

    beforeEach( function(){
      glp = new Gulp()
    })

    it('should create an instance', function(){
      expect( glp ).to.be.ok
    })

    it('should create a group', function(){
      let group = glp.addGroup('test')
      expect( group ).to.be.ok
    })

    it('should add a new task to group', function(){
      let group = glp.addGroup('test')
      expect( group.getTask('testTask') ).to.be.ok
    })

    it('should get a src via addSrc', function(){
      let task = glp.addGroup('test').getTask('testTask')
      expect( task.addSrc('test/fixture/one') ).to.equal(task)
    })

    it('should add a src via addGlob', function(){
      let task = glp.addGroup('test').getTask('testTask')
      expect( task.addGlob('test/fixture/one') ).to.equal(task)
    })

    it('should add a dest', function(){
      let task = glp.addGroup('test').getTask('testTask')
      expect( task.setDest('test/fixture/out') ).to.equal(task)
    })

    it('should add a copy task', function(){
      let task = glp.addGroup('test').getTask('testTask')
      expect( task.addCopyTask() ).to.be.true
    })

  })

})
