const { buildProjectConfig } = require('../../karma.conf');

module.exports = config => buildProjectConfig(config, 'map-validator', 'libs');
