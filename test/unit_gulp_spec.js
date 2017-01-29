/* global expect */
const { DeployableGulp } = require('../')


describe('unit::deployable-assets::DeployableGulp', function(){

  describe('class', function(){

    let glp = new DeployableGulp()

    beforeEach( function(){
      glp = new DeployableGulp()
      glp.gulp.reset()
    })

    it('should create an instance', function(){
      expect( glp ).to.be.ok
    })

    it('should create a group', function(){
      let group = glp.group('test')
      expect( group ).to.be.ok
    })

    it('should add a new task to group', function(){
      let group = glp.group('test')
      expect( group.task('testTask') ).to.be.ok
    })

    it('should get a src via addSrc', function(){
      let task = glp.group('test').task('testTask')
      expect( task.addSrc('test/fixture/one') ).to.equal(task)
    })

    it('should add a src via addGlob', function(){
      let task = glp.group('test').task('testTask')
      expect( task.addGlob('test/fixture/one') ).to.equal(task)
    })

    it('should add a dest', function(){
      let task = glp.group('test').task('testTask')
      expect( task.setDest('test/fixture/out') ).to.equal(task)
    })

    it('should add a copy task', function(){
      let task = glp.group('test').task('testTask')
      expect( task.createCopyTask() ).to.be.true
    })

    it('should create a string', function(){
      glp.group('test').task('testTask')
      glp.group('testa').task('testTaska')
      let res =`test
test:testTask
testa
testa:testTaska`
      expect( glp.toString() ).to.equal(res)
    })


    it('should add a glob to a task', function(){
      glp.addGlob()
    })

    it('should get the globs for a group', function(){
      glp.groupGlobs()
    })

    it('should create a json object', function(){
      glp.group('test1').task('testTask1')
      glp.group('test2').task('testTask2')
      glp.group('test2').group('test22').task('testTask22')
      expect( glp.toJSON() ).to.eql({
        test1: {
          groups: {},
          name: 'test1',
          tasks: {
            testTask1: {
              dest: undefined,
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
                  dest: undefined,
                  globs: [],
                  group: 'test22',
                  name: 'testTask22',
                }
              }
            }
          },
          tasks: {
            testTask2: {
              dest: undefined,
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
