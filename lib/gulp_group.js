
const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const { GulpGroupTask } = require('./gulp_group_task')
const { GulpDestMixin } = require('./gulp_dest_mixin')
const { flatMap, map, forIn } = require('lodash')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const { keys, isNil } = require('lodash')


class GulpGroup extends GulpDestMixin {

  static init(){}

  constructor(name, groups){
    super()
    this.name = name
    this.parent = groups
    this.tasks = {}
    this.Gulp = require('./gulp')
  }

  // Our main job is to hold tasks
  task(name){
    return this.tasks[name] = new GulpGroupTask(name, this)
  }

  // All tasks globs
  getGlobs(){
    return flatMap(this.tasks, (item)=> item.getGlobs())
  }

  // Tasks for the group
  sequence(...args){
    gulp.task(`${this.name}`, gulpSequence(...args))
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
