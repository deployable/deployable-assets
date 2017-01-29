/* global expect */
const { TestEnv } = require('deployable-test')

const { DeployableGulp } = require('../')


describe('integration::deployable-assets::Asset Destination', function(){

  describe('Inheritence', function(){

    let assets = null

    beforeEach(function(){
      assets = new DeployableGulp()
      assets.setDest('whatever')
      assets.gulp.reset()
    })

    after(function(){
      assets.gulp.reset()
    })

    it('should set the assets default dist path to `whatever`', function(){
      expect(assets.dest).to.equal('whatever')
    })

    it('should have the standard gulp object attached', function(){
      expect( assets.gulp ).to.be.ok
    })

    it('should only have a default task', function(){
      expect( assets.gulp.tasks ).to.eql({})
    })

    it('should append a task destination suffix to the main asset destination', function(){
      let tsk = assets
        .group('destfirst')
        .task('one').setDestSuffix('one')
      expect( tsk.dest ).to.equal( 'whatever/one' )
    })

    it('should overide the default destination with a task destination', function(){
      let tsk = assets
        .group('destfirst')
        .task('one').setDest('one')
      expect( tsk.dest ).to.equal( 'one' )
    })

    it('should overide the default destination with a group destination', function(){
      let tsk = assets
        .group('destfirst').setDest('groupdest')
        .task('one')
      expect( tsk.dest ).to.equal( 'groupdest' )
    })

    it('should overide with group destination and append task', function(){
      let tsk = assets
        .group('destfirst').setDest('groupdest')
        .task('one').setDestSuffix('one')
      expect( tsk.dest ).to.equal( 'groupdest/one' )
    })

    it('should append a group and task destination suffix', function(){
      let tsk = assets
        .group('destfirst').setDestSuffix('groupsuff')
        .task('one').setDestSuffix('one')
      expect( tsk.dest ).to.equal( 'whatever/groupsuff/one' )
    })

    it('should append a group, group and task destination suffix', function(){
      let tsk = assets
        .group('destfirst').setDestSuffix('groupfirst')
        .group('destsecond').setDestSuffix('groupsecond')
        .task('three').setDestSuffix('three')
      expect( tsk.dest ).to.equal( 'whatever/groupfirst/groupsecond/three' )
    })

  })

})
