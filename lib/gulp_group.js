const debug = require('debug')('dply:assets:gulp_group')

const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const { GulpGroupTask } = require('./gulp_group_task')
const { GulpDestMixin } = require('./gulp_dest_mixin')
const { flatMap, map, forIn } = require('lodash')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const { keys, isEmpty } = require('lodash')


class GulpGroup extends GulpDestMixin {

  static init(){}

  constructor(name, groups, rootgulp){
    super()
    this.name = name
    this.parent = groups
    this.root = rootgulp
    this.tasks = {}
    this.groups = new (require('./gulp_groups').GulpGroups)('', this, this.root)
    this.Gulp = require('./gulp')
  }

  get full_name(){
    let name_prefix = this.parent.full_name
    if ( name_prefix === '' ) return this.name
    return `${name_prefix}:${this.name}`
  }

  // Our main job is to hold tasks
  task(name){
    if ( this.groups.hasGroup(name) )
      throw new Error(`Group already has a group named ${name}`)

    return this.tasks[name] = new GulpGroupTask(name, this, this.root)
  }

  // and possibly groups
  group(name, ...args){
    if ( this.tasks[name] )
      throw new Error(`Group already has a task named ${name}`)

    return this.groups.group(name, ...args)
  }

  // All tasks globs
  getGlobs(){
    return flatMap(this.tasks, (item)=> item.getGlobs())
  }

  // Tasks for the group
  sequence(...args){
    if ( isEmpty(args) ) {
      let tasks = map( this.tasks, task => task.full_name )
      let groups = map( this.groups.groups, group => group.full_name )
      args = [ ...tasks, ...groups ]
      debug('sequence generate args', args)
    }
    gulp.task(`${this.full_name}`, gulpSequence(...args))
    return true
  }

  // Default to all tasks.
  // Supply each task name to overrride
  watch(...args){
    if ( args.length === 0 ) args = keys(this.tasks)
    /* istanbul ignore next */
    let watch_fn = () =>{
      this.Gulp.watching = true
      args.forEach(task => {
        gulp.start(task)
        watch(this.getTask(task).getGlobs(),
          batch((events, done) => gulp.start(task, done)))
      })
    }
    this.task('watch').createCustom(watch_fn)
    return true
  }

  toJSON(){
    let o = {}
    o.name = this.name
    if ( this.groups ) o.groups = this.groups.toJSON()
    o.tasks = {}
    forIn( this.tasks, (task, key) => o.tasks[key] = task.toJSON() )
    return o
  }

  toString(){
    let str = `${this.full_name}`
    let task_strs = map(this.tasks, item => item.toString())
    let group_strs = map(this.groups.groups, item => item.toString())
    if ( task_strs.length === 0 && group_strs.length === 0 ) return str
    return `${str}\n${[...task_strs, ...group_strs ].join('\n')}`
  }


}

GulpGroup.init()

module.exports = { GulpGroup }
