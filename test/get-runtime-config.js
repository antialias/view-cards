// const getRuntimeConfig = require('../get-runtime-config');
const execSync = require('child_process').execSync;
const update = require('update-object');
const webpack = require('webpack');
const assert = require('assert');
const fs = require('fs');
const mkdirp = require('mkdirp').sync;
const rimraf = require('rimraf').sync;
const path = require('path');
const testTmp = path.join(__dirname, 'test-tmp');
const originalCwd = process.cwd();
const defaults = require('../config-defaults');
describe('runtime-config', function () {
    beforeEach(function () {
        mkdirp(testTmp);
        process.chdir(testTmp);
    });
    afterEach(function () {
        rimraf(testTmp);
        process.chdir(originalCwd);
    });
    describe('defaults', function () {
        beforeEach(function () {
            delete require.cache[require.resolve('../runtime-config')];
            delete require.cache[require.resolve(path.join(testTmp, 'card-config.json'))];
        })
        it('should use the config when present', function () {
            fs.writeFileSync('card-config.json', JSON.stringify({
                srcRoot: 'foobar'
            }), 'utf8');
            assert.equal(require('../runtime-config').srcRoot, 'foobar');
        });
        // require cache isn't clearing
        it.skip('should use the default config propertiues when config is present but the property is not set', function () {
            fs.writeFileSync('card-config.json', JSON.stringify({}), 'utf8');
            assert.equal(require('../runtime-config').srcRoot, defaults.srcRoot);
        });
        // require cache isn't clearing
        it.skip('should use the defaults when config is not present', function () {
            assert(defaults.srcRoot);
            assert.equal(require('../runtime-config').srcRoot, defaults.srcRoot);
        });
    });
    describe('webpack config transform', function () {
        it('should be identity by default', function () {
            const config = require('../runtime-config');
            const x = {foo: 'bar'};
            assert.deepEqual(config.transformWebpackConfig(x), x);
        });
    });
});
