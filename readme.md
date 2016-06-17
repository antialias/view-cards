`view-cards` combines webpack dev server, hot module replacement, and devboard to show your devcards with minimal configuration. Just place files called `card.js`, or `*.card.js` in your project and they will be included on the devboard.

# installation

npm install -g view-cards

# usage

Run `view-cards` in the root of the project for which you would like to view cards.

# configuration

`card-config.js` goes in your project root. It can export the following:

## `transformWebpackConfig`

This is a function that takes as input the webpack config that view-cards uses and can transform it into a new config that works with your devcards. This is where you can add loader configurations, resolve.extensions, and any necessary plugins.

[`webpack-config-builders`](https://www.npmjs.com/package/webpack-config-builders) and [`lodash.flow`](https://www.npmjs.com/package/lodash.flow) work well to help you build and combine functions that can transform the webpack config.

Defaults to `x => x`

## `srcRoot`

The directory that contains all your devcards. Defaults to `.`

## `cardPattern`

A regular expression that is used to match your card file names. Defaults to `/[\.\/^]card\.jsx?$/`

## `stylesheets`

An array of URIs to stylesheets that will be added to `<head>` in the the template rendered by express.

## `publicDir`

A path relative to `process.cwd()` that will be the public assets directory for the devcard server.
