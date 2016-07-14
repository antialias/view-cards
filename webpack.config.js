const escapeString = require('js-string-escape');
const escapeRegex = require('escape-string-regexp');
const jsonfn = require('json-fn');
const path = require('path');
const flow = require('lodash.flow');
const pick = require('lodash.pick');
const configBuilders = require('webpack-config-builders');
const config = require('./runtime-config');
const webpack = require('webpack');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const addExtension = configBuilders.addExtension;
const addPlugin = configBuilders.addPlugin;
const configExports = [
    'srcRoot',
    'cardPattern'
];
module.exports = flow(
    addExtension('.js'),
    config.transformWebpackConfig,
    addExtension(''),
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
        loaders: [{
            test: /\.json$/,
            loader: require.resolve('json-loader')
        }, {
            test: new RegExp(`^${escapeRegex(require.resolve('./entry'))}$`),
            loader: StringReplacePlugin.replace({
                replacements: [
                    {
                        pattern: /__PATH_TO_CARDS/,
                        replacement: () => `"${escapeString(path.join(path.relative(__dirname, process.cwd()), config.srcRoot))}"`
                    }, {
                        pattern: /__CARD_PATTERN/,
                        replacement: () => config.cardPattern.toString()
                    }
                ]
            })
        }]
    },
    plugins: [
        new StringReplacePlugin()
    ]
});
