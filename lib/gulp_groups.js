
const { GulpGroup } = require('./gulp_group')


class GulpGroups {

  static init(){}

  constructor(name){
    this.name = name
    this.groups = {}
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

  addGroup(name){
    return this.groups[name] = new GulpGroup(name, this)
  }
  getGroup(name){
    if (!this.groups[name]) return this.addGroup(name, this)
    return this.groups[name]
  }

  // All groups and tasks globs
  getGlobs(){
    _.flatMap(this.groups, (item)=> item.getGlobs())
  }

}

GulpGroups.init()

module.exports = { GulpGroups }
