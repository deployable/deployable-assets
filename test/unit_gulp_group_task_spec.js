const expect = require('chai').expect
const { GulpGroupTask } = require('../')


describe('unit::deployable-assets::GulpGroupTask', function(){

  describe('class', function(){

    let tsk = null

    beforeEach( function(){
      let group = { name: 'tgroup', dest: 'parentdest', full_name: 'tgroup' }
      let rootgulp = { gulp: require('gulp') }
      rootgulp.gulp.reset()
      tsk = new GulpGroupTask('sometask', group, rootgulp)
    })

    it('should create an instance', function(){
      expect( tsk ).to.be.ok
    })

    it('should set the dest of a task', function(){
      let dst = tsk.setDest('dest')
      expect( dst ).to.be.ok
      expect( tsk.dest ).to.equal( 'dest')
    })

    it('should add a src to a task', function(){
      let src = tsk.addSrc('src')
      expect( src ).to.be.ok
      expect( tsk.globs ).to.eql(['src'])
    })

    it('should add a glob to a task', function(){
      let glb = tsk.addGlob('glb')
      expect( glb ).to.be.ok
      expect( tsk.globs ).to.eql(['glb'])
    })

    it('should add a glob to a task', function(){
      expect( tsk.addGlob('glb') ).to.equal( tsk )
      expect( tsk.getGlobs() ).to.eql(['glb'])
    })

    it('should set debug on the task', function(){
      expect( tsk.setDebug(true) ).to.equal( tsk )
      expect( tsk.debug ).to.be.true
    })

    it('should set the cwd of the task', function(){
      tsk.setCwd('something')
      expect( tsk.cwd ).to.equal('something')
    })

    it('should turn the task into a json object', function(){
      tsk.addSrc('src')
      tsk.setDest('dest')
      expect( tsk.toJSON() ).to.eql({
        name: 'sometask',
        globs: ['src'],
        group: 'tgroup',
        dest: 'dest'
      })
    })

    it('shoould turn the task into a json string', function(){
      expect( JSON.stringify(tsk) ).to.match(/^\{/)
    })

    it('should turn the task into a string', function(){
      tsk.addSrc('src')
      tsk.setDest('dest')
      expect( tsk.toString() ).to.eql('tgroup:sometask')
    })

  })

  describe('class with parent', function(){

    let tsk = null

    beforeEach( function(){
      // mock
      let rgu = { gulp: require('gulp') }
      let grp = { full_name: 'tgroup', name: 'tgroup', dest: 'abc', debug: false, cwd: 'twhatever'}
      // class
      tsk = new GulpGroupTask('sometask', grp, rgu)
    })

    it('should append suffix to parents dest', function(){
      tsk.setDestSuffix('cde')
      expect( tsk.dest ).to.equal( 'abc/cde' )
    })

    it('createBabelTask', function(){
      expect( tsk.createBabelTask() ).to.equal( true )
    })

    it('should pick up the parent cwd', function(){
      expect( tsk.cwd ).to.equal( 'twhatever' )
    })

    it('should pick up the parent debug', function(){
      expect( tsk.debug ).to.equal( false )
    })

    it('should override the parent debug', function(){
      expect( tsk.setDebug() ).to.equal( tsk )
      expect( tsk.debug ).to.equal( true )
    })

    it('should override the parent debug', function(){
      expect( tsk.setDebug(true) ).to.equal( tsk )
      expect( tsk.debug ).to.equal( true )
    })

    it('createBabelSourceMapTask', function(){
      expect( tsk.createBabelSourceMapTask() ).to.equal( true )
    })
    it('createSassTask', function(){
      expect( tsk.createSassTask() ).to.equal( true )
    })
    it('createSassSourceMapTask', function(){
      expect( tsk.createSassSourceMapTask() ).to.equal( true )
    })
    it('createShellTask', function(){
      expect( tsk.createShellTask() ).to.equal( true )
    })
    it('run', function(){
      expect( tsk.run() ).to.equal( true )
    })
    it('createSequence', function(){
      expect( tsk.createSequence(['test']) ).to.equal( true )
    })
    it('createCustom', function(){
      expect( tsk.createCustom() ).to.equal( true )
    })

  })

})
