
const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const { GulpGroupTask } = require('./gulp_group_task')


class GulpGroup {

  static init(){}

  constructor(name, groups){
    this.name = name
    this.groups = groups
    this.tasks = {}
  }

  // The group `dest` will be used when a task doesn't have
  // one set.
  get dest (){
    if (this._dest === undefined) return this.groups.dest
    return this._dest
  }
  set dest (_dest){
    return this._dest = _dest
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
    _.flatMap(this.tasks, (item)=> item.getGlobs())
  }

  // Tasks for the group
  sequence(...args){
    gulp.task(`${this.name}`, gulpSequence(...args))
  }

  watch(...args){
    gulp.task(`${this.name}:watch`, ()=>{
      Gulp.watching = true
      args.forEach(task => {
        gulp.start(task)
        watch(this.groups.getGroup(task).getGlobs(),
          batch((events, done) => gulp.start(task, done)))
      })
    })
  }
}

GulpGroup.init()

module.exports = { GulpGroup }
