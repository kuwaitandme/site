cachemanMemory     = require 'cacheman-memory'

exports = module.exports = (settings, cache) -> new cachemanMemory
exports['@singleton'] = true