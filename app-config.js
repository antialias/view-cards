'use strict';
const path = require('path');
const unresolvedPath = path.join(process.cwd(), 'card-config');
let appConfigPath;
try {
    appConfigPath = require.resolve(unresolvedPath);
} catch(e) {}
if (appConfigPath) {
    module.exports = require(appConfigPath);
}
