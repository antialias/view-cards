var path = require('path');
var config = require('./runtime-config');
var context = require.context(__PATH_TO_CARDS, true, __CARD_PATTERN);
context.keys().map(context);
if (module.hot) {
    module.hot.accept();
}
