const express = require('express');
const config = require('./runtime-config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const favicon = require('serve-favicon');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const open = require('openurl').open;
const getPort = require('get-port');
const path = require('path');
const compiler = webpack(webpackConfig);
const app = express();
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.set('views', __dirname);
app.set('view engine', 'ejs');
if (config.publicDir) {
    app.use(express.static(path.join(process.cwd(), config.publicDir)));
}
app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
app.use(webpackHotMiddleware(compiler));
app.get('/', (req, res) => res.render('template', {
    stylesheets: config.stylesheets
}));
getPort().then(port => app.listen(port, () => open(`http://localhost:${port}`)));
