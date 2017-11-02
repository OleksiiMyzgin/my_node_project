'use strict';

var deleteData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('😢😢 Goodbye Data...');
            _context.next = 3;
            return Store.remove();

          case 3:
            _context.next = 5;
            return Review.remove();

          case 5:
            _context.next = 7;
            return User.remove();

          case 7:
            console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
            process.exit();

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function deleteData() {
    return _ref.apply(this, arguments);
  };
}();

var loadData = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Store.insertMany(stores);

          case 3:
            _context2.next = 5;
            return Review.insertMany(reviews);

          case 5:
            _context2.next = 7;
            return User.insertMany(users);

          case 7:
            console.log('👍👍👍👍👍👍👍👍 Done!');
            process.exit();
            _context2.next = 16;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](0);

            console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
            console.log(_context2.t0);
            process.exit();

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 11]]);
  }));

  return function loadData() {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config({ path: __dirname + '/../variables.env' });
var fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
var Store = require('../models/Store');
var Review = require('../models/Review');
var User = require('../models/User');

var stores = JSON.parse(fs.readFileSync(__dirname + '/stores.json', 'utf-8'));
var reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));
var users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
//# sourceMappingURL=load-sample-data.js.map