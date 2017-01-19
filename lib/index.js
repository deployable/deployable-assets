const { Gulp, GulpGroups, GulpGroup, GulpGroupTask, GulpError } = require('./gulp')
const { DeployableGulp } = require('./deployable')

const initial = new Gulp()

module.exports = { initial, DeployableGulp, Gulp, GulpGroups, GulpGroup, GulpGroupTask, GulpError }

