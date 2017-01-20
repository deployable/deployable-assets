
const { GulpGroup } = require('./gulp_group')
const { GulpDestMixin } = require('./gulp_dest_mixin')
const { flatMap, map, forIn } = require('lodash')

class GulpGroups  extends GulpDestMixin {

  static init(){}

  constructor(name, parent){
    super()
    this.name = name
    this.groups = {}
    this.parent = parent
  }

  addGroup(name){
    return this.groups[name] = new GulpGroup(name, this)
  }
  group(name){
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
