'use strict';
const proxyquire = require('proxyquire');
const cheerio = require('cheerio');
const request = require('request');
const assert = require('assert');
const fs = require('fs');
const mkdirp = require('mkdirp').sync;
const rimraf = require('rimraf').sync;
const path = require('path');
const testTmp = path.join(__dirname, 'test-tmp');
const originalCwd = process.cwd();
const publicAssetBody = 'this is a public asset';
describe('view-cards server', function () {
    let cardsUrl;
    before(function (done) {
        mkdirp(testTmp);
        process.chdir(testTmp);
        try {delete require.cache[require.resolve('../app-config')];} catch (e) {}
        try {delete require.cache[require.resolve('../runtime-config')];} catch (e) {}
        try {delete require.cache[require.resolve(path.join(testTmp, 'card-config.json'))];} catch (e) {}
        mkdirp('test-public');
        fs.writeFileSync('test-public/test-public-asset.txt', publicAssetBody);
        fs.writeFileSync('card-config.json', JSON.stringify({
            srcRoot: '.',
            publicDir: 'test-public',
            stylesheets: ['/my/stylesheet']
        }), 'utf8');
        proxyquire('../start', {
            openurl: {
                open: function (_cardsUrl) {
                    cardsUrl = _cardsUrl;
                    done();
                }
            }
        });
    });
    beforeEach(function () {
    });
    afterEach(function () {
        rimraf(testTmp);
        process.chdir(originalCwd);
    });
    it('should expose a public directory according to the config', function (done) {
        request(`${cardsUrl}/test-public-asset.txt`, function (error, response, body) {
            assert(!error);
            assert.equal(response.statusCode, 200);
            assert.equal(body, publicAssetBody);
            done();
        });
    });
    it('should link to config.stylesheets', function (done) {
        request(cardsUrl, function (error, response, body) {
            assert(!error);
            assert.equal(response.statusCode, 200);
            assert.equal(cheerio.load(body)('head > link[href="/my/stylesheet"]').length, 1);
            done();
        });
    });
});
