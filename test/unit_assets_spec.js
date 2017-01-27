const expect = require('chai').expect
const { Assets } = require('../')


describe('unit::deployable-assets::Assets::', function(){

  describe('class', function(){

    let ass = new Assets()

    beforeEach( function(){
      ass = new Assets()
      ass.gulp.reset()
    })

    it('should create an instance', function(){
      expect( ass ).to.be.ok
    })

    it('should create a group', function(){
      let group = ass.group('test')
      expect( group ).to.be.ok
    })

    it('should add a new task to group', function(){
      let group = ass.group('test')
      expect( group.task('testTask') ).to.be.ok
    })

    it('should get a src via addSrc', function(){
      let task = ass.group('test').task('testTask')
      expect( task.addSrc('test/fixture/one') ).to.equal(task)
    })

    it('should add a src via addGlob', function(){
      let task = ass.group('test').task('testTask')
      expect( task.addGlob('test/fixture/one') ).to.equal(task)
    })

    it('should add a dest', function(){
      let task = ass.group('test').task('testTask')
      expect( task.setDest('test/fixture/out') ).to.equal(task)
    })

    it('should add a copy task', function(){
      let task = ass.group('test').task('testTask')
      expect( task.createCopyTask() ).to.be.true
    })

    it('should create a string', function(){
      ass.group('test').task('testTask')
      ass.group('testa').task('testTaska')
      let res =`test
test:testTask
testa
testa:testTaska`
      expect( ass.toString() ).to.equal(res)
    })


    it('should add a glob to a task', function(){
      ass.addGlob()
    })

    it('should get the globs for a group', function(){
      ass.groupGlobs()
    })

    it('should create a json object', function(){
      ass.group('test1').task('testTask1')
      ass.group('test2').task('testTask2')
      ass.group('test2').group('test22').task('testTask22')
      expect( ass.toJSON() ).to.eql({
        test1: {
          groups: {},
          name: 'test1',
          tasks: {
            testTask1: {
              dest: 'app/static/assets',
              globs: [],
              group: 'test1',
              name: 'testTask1'
            }
          }
        },
        test2: {
          name: 'test2',
          groups: {
            'test22': {
              groups: {},
              name: 'test22',
              tasks: {
                testTask22: {
                  dest: 'app/static/assets',
                  globs: [],
                  group: 'test22',
                  name: 'testTask22'
                }
              }
            }
          },
          tasks: {
            testTask2: {
              dest: 'app/static/assets',
              globs: [],
              group: 'test2',
              name: 'testTask2'
            }
          }
        }
      })
    })


  })

})
