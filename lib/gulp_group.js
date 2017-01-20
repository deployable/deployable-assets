
const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const { GulpGroupTask } = require('./gulp_group_task')
const { flatMap, map, forIn } = require('lodash')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const { keys } = require('lodash')

class GulpGroup {

  static init(){}

  constructor(name, groups){
    this.name = name
    this.parent = groups
    this.tasks = {}
    this.Gulp = require('./gulp')
  }

  // The group `dest` will be used when a task doesn't have
  // one set.
  get dest (){
    if (this._dest === undefined) return (this.parent) ? this.parent.dest : undefined
    return this._dest
  }
  set dest (_dest){
    return this._dest = _dest
  }

  setDest( dest ){
    return this.dest = dest
  }

  setSuffix( suffix ){
    return this.suffix = suffix
  }

  // Our main job is to hold tasks
  addTask(name){
    return this.tasks[name] = new GulpGroupTask(name, this)
  }
  getTask(name){
    if (!this.tasks[name]) return this.addTask(name)
    return this.tasks[name]
  }

  // All tasks globs
  getGlobs(){
    flatMap(this.tasks, (item)=> item.getGlobs())
  }

  // Tasks for the group
  sequence(...args){
    gulp.task(`${this.name}`, gulpSequence(...args))
  }

  // Default to all tasks.
  // Supply each task name to overrride
  watch(...args){
    if ( args.length === 0 ) args = keys(this.tasks)
    this.addTask('watch').createCustom(()=>{
      this.Gulp.watching = true
      args.forEach(task => {
        gulp.start(task)
        watch(this.getTask(task).getGlobs(),
          batch((events, done) => gulp.start(task, done)))
      })
    })
  }

  toJSON(){
    let o = {}
    o.name = this.name
    //if (this.groups) o.groups = this.groups.name
    o.tasks = {}
    forIn( this.tasks, (task, key) => o.tasks[key] = task.toJSON() )
    return o
  }

  toString(){
    let str = `${this.name}`
    let task_strs = map(this.tasks, item => item.toString())
    if ( task_strs.length === 0 ) return str
    return `${str}\n${task_strs.join('\n')}`
  }


}

GulpGroup.init()

module.exports = { GulpGroup }
