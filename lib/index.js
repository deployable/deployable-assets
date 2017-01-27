const { DeployableGulp, GulpGroups, GulpGroup, GulpGroupTask, GulpError } = require('./gulp')
const { Assets } = require('./assets')
const { DeployableAssets } = require('./deployable')

const initial = new DeployableGulp()
const VERSION = require('../package.json').version

module.exports = { initial, Assets, DeployableAssets, DeployableGulp, GulpGroups, GulpGroup, GulpGroupTask, GulpError, VERSION }

