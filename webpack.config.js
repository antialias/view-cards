const escapeString = require('js-string-escape');
const escapeRegex = require('escape-string-regexp');
const jsonfn = require('json-fn');
const path = require('path');
const flow = require('lodash.flow');
const pick = require('lodash.pick');
const configBuilders = require('webpack-config-builders');
const config = require('./runtime-config');
const webpack = require('webpack');
const addExtension = configBuilders.addExtension;
const addPlugin = configBuilders.addPlugin;
const configExports = [
    'srcRoot',
    'cardPattern'
];
module.exports = flow(
    addExtension('.js'),
    config.transformWebpackConfig,
    addPlugin(new webpack.HotModuleReplacementPlugin())
)({
    entry: {
        "devboard.js": [require.resolve('./entry.js'), require.resolve('webpack-hot-middleware/client')]
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'public/js'),
        publicPath: '/js/'
    },
    devtool: 'eval',
    recordsPath: path.join(__dirname, 'hmr.json'),
    devServer: {
        publicPath: "/js/",
        stats: {
            chunks: false
        }
    },
    node: {
        __dirname: true,
        process: true
    },
    module: {
        rules: [{
            test: /\.json$/,
            use: require.resolve('json-loader')
        }, {
            test: new RegExp(`^${escapeRegex(require.resolve('./entry'))}$`),
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            {
                                search: '__PATH_TO_CARDS',
                                replace: JSON.stringify(path.join(path.relative(__dirname, process.cwd()), config.srcRoot)),
                            }, {
                                search: '__CARD_PATTERN',
                                replace: config.cardPattern.toString(),
                            }
                        ]
                    }
                }
            ]
        }]
    },
});
console.log(JSON.stringify(module.exports))
