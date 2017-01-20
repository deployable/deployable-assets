
const { GulpGroup } = require('./gulp_group')
const { flatMap, map, forIn } = require('lodash')

class GulpGroups {

  static init(){}

  constructor(name, parent){
    this.name = name
    this.groups = {}
    this.parent = parent
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

  addGroup(name){
    return this.groups[name] = new GulpGroup(name, this)
  }
  getGroup(name){
    if (!this.groups[name]) return this.addGroup(name, this)
    return this.groups[name]
  }

  // All groups and tasks globs
  getGlobs(){
    return flatMap( this.groups, item => item.getGlobs() )
  }

  toJSON(){
    let o = {}
    forIn( this.groups, (grp, key) => o[key] = grp.toJSON() )
    return o
  }

  toString(){
    return map( this.groups, item => item.toString() ).join('\n')
  }

}

GulpGroups.init()

module.exports = { GulpGroups }
