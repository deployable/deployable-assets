const expect = require('chai').expect
const { Gulp } = require('../')


describe('unit::deployable-assets::Gulp', function(){

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

    it('should create a string', function(){
      glp.addGroup('test').getTask('testTask')
      glp.addGroup('testa').getTask('testTaska')
      let res =`test
test:testTask
testa
testa:testTaska`
      expect( glp.toString() ).to.equal(res)
    })

    it('should create a json object', function(){
      glp.addGroup('test1').getTask('testTask1')
      glp.addGroup('test2').getTask('testTask2')
      expect( glp.toJSON() ).to.eql({
        test1: { name: 'test1', tasks: {
          testTask1: {
            dest: undefined,
            globs: [],
            group: 'test1',
            name: 'testTask1'
          }
        }},
        test2: { name: 'test2', tasks: {
          testTask2: {
            dest: undefined,
            globs: [],
            group: 'test2',
            name: 'testTask2'
          }
        }}
      })
    })


  })

})
