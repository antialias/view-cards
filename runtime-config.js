var defaults = require('./config-defaults');
var appConfig = require('./app-config');
module.exports = Object.assign({},
    defaults,
    appConfig
);
