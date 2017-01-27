import Blah from './lib/blah'

class Deployable {
  whatever ( wat ) {
    return 'yep'
  }
}

window.onload = () => {
  let blah = new Blah()
  let deployable = new Deployable()
  console.log(`Loaded ${blah.test()} ${deployable.whatever()}`)
}

