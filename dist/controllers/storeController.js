'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var Store = mongoose.model('Store');
var User = mongoose.model('User');
var multer = require('multer');
var jimp = require('jimp');
var uuid = require('uuid');

var multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function fileFilter(req, file, next) {
        var isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed! Please only upload jpg/png/gif' }, false);
        }
    }
};

exports.homePage = function (req, res) {
    res.render('index');
};

exports.addStore = function (req, res) {
    res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var extension, photo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (req.file) {
                            _context.next = 3;
                            break;
                        }

                        next(); // skip to the next middleware
                        return _context.abrupt('return');

                    case 3:
                        extension = req.file.mimetype.split('/')[1];

                        req.body.photo = uuid.v4() + '.' + extension;
                        // now we resize
                        _context.next = 7;
                        return jimp.read(req.file.buffer);

                    case 7:
                        photo = _context.sent;
                        _context.next = 10;
                        return photo.resize(800, jimp.AUTO);

                    case 10:
                        _context.next = 12;
                        return photo.write('./public/uploads/' + req.body.photo);

                    case 12:
                        // once we have written the photo to our filesystem, keep going!
                        next();

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

exports.createStore = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var store;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        req.body.author = req.user._id;
                        _context2.next = 3;
                        return new Store(req.body).save();

                    case 3:
                        store = _context2.sent;

                        req.flash('success', 'Successfully Created ' + store.name + '. Care to leave a review?');
                        res.redirect('/store/' + store.slug);

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

exports.getStores = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var page, limit, skip, storesPromise, countPromise, _ref4, _ref5, stores, count, pages;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        page = req.params.page || 1;
                        limit = 4;
                        skip = page * limit - limit;

                        // 1. Query the database for a list of all stores

                        storesPromise = Store.find().skip(skip).limit(limit).sort({ created: 'desc' });
                        countPromise = Store.count();
                        _context3.next = 7;
                        return Promise.all([storesPromise, countPromise]);

                    case 7:
                        _ref4 = _context3.sent;
                        _ref5 = _slicedToArray(_ref4, 2);
                        stores = _ref5[0];
                        count = _ref5[1];
                        pages = Math.ceil(count / limit);

                        if (!(!stores.length && skip)) {
                            _context3.next = 16;
                            break;
                        }

                        req.flash('info', 'Hey! You asked for page ' + page + '. But that doesn\'t exist. So I put you on page ' + pages);
                        res.redirect('/stores/page/' + pages);
                        return _context3.abrupt('return');

                    case 16:

                        res.render('stores', { title: 'Stores', stores: stores, page: page, pages: pages, count: count });

                    case 17:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
}();

// if we need admin we can implement user.level < 10 where 10 is admin and 20 is user
var confirmOwner = function confirmOwner(store, user) {
    if (!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it!');
    }
};

exports.editStore = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var store;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return Store.findOne({ _id: req.params.id });

                    case 2:
                        store = _context4.sent;

                        // 2. confirm they are the owner of the store
                        confirmOwner(store, req.user);
                        // 3. Render out the edit form so the user can update their store
                        res.render('editStore', { title: 'Edit ' + store.name, store: store });

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x8, _x9) {
        return _ref6.apply(this, arguments);
    };
}();

exports.updateStore = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var store;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        // set the location data to be a point
                        req.body.location.type = 'Point';
                        // find and update store
                        _context5.next = 3;
                        return Store.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, // return the new store instead of the old one
                            runValidators: true }).exec();

                    case 3:
                        store = _context5.sent;

                        req.flash('success', 'Successfully updated <strong>' + store.name + '</strong>. <a href="/stores/' + store.slug + '">View Store =></a>');
                        res.redirect('/stores/' + store._id + '/edit');
                        // Redirect them the store and tell them it worked

                    case 6:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x10, _x11) {
        return _ref7.apply(this, arguments);
    };
}();

exports.getStoreBySlug = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
        var store;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return Store.findOne({ slug: req.params.slug }).populate('author reviews');

                    case 2:
                        store = _context6.sent;

                        if (store) {
                            _context6.next = 5;
                            break;
                        }

                        return _context6.abrupt('return', next());

                    case 5:
                        res.render('store', { store: store, title: store.name });

                    case 6:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x12, _x13, _x14) {
        return _ref8.apply(this, arguments);
    };
}();

exports.getStoreByTag = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
        var tag, tagQuery, tagsPromise, storePromise, _ref10, _ref11, tags, stores;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        tag = req.params.tag;
                        // if there is no tag its just gonna fall back to second query (give me any store that a tag property on it)

                        tagQuery = tag || { $exists: true };
                        tagsPromise = Store.getTagsList();
                        storePromise = Store.find({ tags: tagQuery });
                        _context7.next = 6;
                        return Promise.all([tagsPromise, storePromise]);

                    case 6:
                        _ref10 = _context7.sent;
                        _ref11 = _slicedToArray(_ref10, 2);
                        tags = _ref11[0];
                        stores = _ref11[1];


                        res.render('tag', { tags: tags, title: 'Tags', tag: tag, stores: stores });

                    case 11:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x15, _x16) {
        return _ref9.apply(this, arguments);
    };
}();

exports.searchStores = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
        var stores;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return Store
                        // first find stores that match
                        .find({
                            $text: {
                                $search: req.query.q
                            }
                        }, {
                            score: {
                                $meta: 'textScore'
                            }
                        })
                        // then sort them
                        .sort({
                            score: { $meta: 'textScore' }
                        })
                        // limit to only 5 results
                        .limit(5);

                    case 2:
                        stores = _context8.sent;

                        res.json(stores);

                    case 4:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x17, _x18) {
        return _ref12.apply(this, arguments);
    };
}();

exports.mapStores = function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
        var coordinates, q, stores;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        coordinates = [req.query.lng, req.query.lat].map(parseFloat);
                        q = {
                            location: {
                                $near: {
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: coordinates
                                    },
                                    $maxDistance: 10000 // 10km
                                }
                            }
                        };
                        _context9.next = 4;
                        return Store.find(q).select('slug name description location photo').limit(10);

                    case 4:
                        stores = _context9.sent;

                        res.json(stores);

                    case 6:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x19, _x20) {
        return _ref13.apply(this, arguments);
    };
}();

exports.mapPage = function (req, res) {
    res.render('map', { title: 'Map' });
};

exports.heartStore = function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
        var hearts, operator, user;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        hearts = req.user.hearts.map(function (obj) {
                            return obj.toString();
                        });
                        operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
                        _context10.next = 4;
                        return User.findByIdAndUpdate(req.user._id, _defineProperty({}, operator, { hearts: req.params.id }), { new: true });

                    case 4:
                        user = _context10.sent;

                        res.json(user);

                    case 6:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x21, _x22) {
        return _ref14.apply(this, arguments);
    };
}();

exports.getHearts = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
        var stores;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return Store.find({
                            _id: { $in: req.user.hearts }
                        });

                    case 2:
                        stores = _context11.sent;

                        res.render('stores', { title: 'Hearted Stores', stores: stores });

                    case 4:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined);
    }));

    return function (_x23, _x24) {
        return _ref15.apply(this, arguments);
    };
}();

exports.getTopStores = function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res) {
        var stores;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return Store.getTopStores();

                    case 2:
                        stores = _context12.sent;

                        res.render('topStores', { stores: stores, title: 'Top Stores!' });

                    case 4:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function (_x25, _x26) {
        return _ref16.apply(this, arguments);
    };
}();
//# sourceMappingURL=storeController.js.map