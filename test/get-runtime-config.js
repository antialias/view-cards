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
        // rimraf(testTmp);
        process.chdir(originalCwd);
    });
    describe('bundle', function () {
        it('should have access to the exported properties of the runtime config', function (done) {
            fs.writeFileSync('card-config.json', JSON.stringify({
                srcRoot: 'foobar'
            }), 'utf8');
            const webpackConfigPath = require.resolve(path.join('..', 'webpack.config'));
            try {delete require.cache[webpackConfigPath];} catch(e) {}
            const webpackConfig = require(webpackConfigPath);
            const testEntryPath = path.join(testTmp, 'test-entry');
            const testBundlePath = path.join(testTmp, 'test-bundle.js');
            fs.writeFileSync(testEntryPath + '.js', "console.log(JSON.stringify(require('../../runtime-config')))");
            const specWebpackConfig = Object.assign({}, webpackConfig, {
                entry: testEntryPath,
                output: {
                    filename: 'test-bundle.js',
                    path: testTmp
                }
            });
            const compiler = webpack(specWebpackConfig);
            compiler.run((err, stats) => {
                if (err) {
                    assert(false, err);
                    return
                }
                assert.equal(JSON.parse(execSync(`node ${testBundlePath}`).toString()).srcRoot, 'foobar');
                done();
            });
        });
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
