'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var mongoose = require('mongoose');

// Make sure we are running node 7.6+

var _process$versions$nod = process.versions.node.split('.').map(parseFloat),
    _process$versions$nod2 = _slicedToArray(_process$versions$nod, 2),
    major = _process$versions$nod2[0],
    minor = _process$versions$nod2[1];

if (major < 7 || major === 7 && minor <= 5) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', function (err) {
  console.error('\uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \u2192 ' + err.message);
});

// READY?! Let's go!

// import all of our models
require('./models/Store');
require('./models/User');
require('./models/Review');

// Start our app!
var app = require('./app');
app.set('port', process.env.PORT || 7777);
var server = app.listen(app.get('port'), function () {
  console.log('Express running \u2192 PORT ' + server.address().port);
});
//# sourceMappingURL=start.js.map