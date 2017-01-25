const expect = require('chai').expect
const { TestEnv } = require('deployable-test')

const { Gulp } = require('../')


describe('integration::deployable-assets:: Asset Destination', function(){

  describe('inheritence', function(){

    let assets = null

    before(function(){
      assets = new Gulp()
    })

    it('should set the assets default dist path to `whatever`', function(){
      assets.setDistPath('whatever')
      expect(assets.dest).to.equal('whatever')
    })

    it('should have the standard gulp object attached', function(){
      expect( assets.gulp ).to.be.ok
    })

    it('should only have a default task', function(){
      expect( assets.gulp.tasks ).to.have.keys( 'default' )
    })

    it('should append a destination suffix', function(){
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
