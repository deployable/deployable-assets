const { isNil } = require('lodash')

class GulpDestMixin {

  get dest (){
    if ( ! isNil(this.dest_suffix) ) return `${this.parent.dest}/${this.dest_suffix}`
    if ( isNil(this._dest) ) return (this.parent) ? this.parent.dest : undefined
    return this._dest
  }

  set dest (_dest){
    return this._dest = _dest
  }

  setDest(asset_path){
    this.dest = asset_path
    return this
  }

  setDestSuffix(asset_path){
    this.dest_suffix = asset_path
    return this
  }

}

module.exports = { GulpDestMixin }
