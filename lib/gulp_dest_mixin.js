const debug = require('debug')('dply:assets:gulp_dest_mixin')
const { isNil, isUndefined } = require('lodash')

// ## class GulpDestMixin

// `dest` and `src_dest` variables for groups, group, and task

// If a suffix is set for either `dest` or `src_dest`, it does some
// magic to apply the suffix to a parent destination.

class GulpDestMixin {


  // ### Compile/Static asset destination
  // Assets that are ready for the public to consume

  get dest (){
    if ( ! isNil(this.dest_suffix) ) return `${this.parent.dest}/${this.dest_suffix}`
    if ( isNil(this._dest) ) return (this.parent) ? this.parent.dest : undefined
    return this._dest
  }

  set dest (_dest){
    return this._dest = _dest
  }

  // Sets a destination for this class
  setDest(asset_path){
    if (this.dest_suffix) this.dest_suffix = undefined
    this._dest = asset_path
    debug('%s destination set to %s', this.full_name, this.dest)
    return this
  }

  // Sets a destination suffix that appends to a parent destination
  setDestSuffix(asset_path){
    if (this._dest) throw new Error(`Can't set both the destination suffix and destination`)
    this.dest_suffix = asset_path
    debug('%s destination suffix set to %s', this.full_name, this.dest)
    return this
  }


  // ### Source Asset Destination
  // Assets that need some work before ending up in dest

  // get src_dest (){
  //   if ( ! isNil(this.src_dest_suffix) ) return `${this.parent.src_dest}/${this.src_dest_suffix}`
  //   if ( isNil(this._src_dest) ) return (this.parent) ? this.parent.src_dest : undefined
  //   return this._src_dest
  // }

  // set src_dest (_dest){
  //   return this._src_dest = _dest
  // }

  // // Sets a source destination for this class
  // setSrcDest(dest){
  //   this._src_dest = dest
  //   return this
  // }

  // // Sets a destination suffix that appends to a parent destination
  // setSrcDestSuffix(asset_path){
  //   this.src_dest_suffix = asset_path
  //   return this
  // }


  // ### Other

  // `cwd` can be inherited from parents if not set
  set cwd(_cwd){
    return this._cwd = _cwd
  }
  get cwd(){
    if (this._cwd) return this._cwd
    return this.parent.cwd
  }

  // Sets cwd for this class via a chaining method
  setCwd(cwd){
    this.cwd = cwd
    debug('%s cwd set to %s', this.full_name, this.cwd)
    return this
  }

  // `debug` can be inherited from parents if not set
  get debug(){
    if ( isUndefined(this._debug) ) return this.parent.debug
    return this._debug
  }
  set debug(bool){
    return this._debug = Boolean(bool)
  }

  // Sets debug for this class via a chaining method
  setDebug(bool = true){
    this.debug = bool
    debug('%s debug set to %s', this.full_name, this.debug)
    return this
  }

}

module.exports = { GulpDestMixin }
