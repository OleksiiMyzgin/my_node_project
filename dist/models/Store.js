'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var slug = require('slugs');

var storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
});

// Define our Indexes
storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.pre('save', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!this.isModified('name')) {
                            _context.next = 4;
                            break;
                        }

                        _context.next = 3;
                        return this.generateSlugFromName(this.name);

                    case 3:
                        this.slug = _context.sent;

                    case 4:

                        next();

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}());

storeSchema.methods.generateSlugFromName = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
        var nameSlugged, slugRegEx, storesWithSlug;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        nameSlugged = slug(name);
                        slugRegEx = new RegExp('^(' + nameSlugged + ')((-[0-9]*$)?)$', 'i');
                        _context2.next = 4;
                        return this.constructor.find({ slug: slugRegEx });

                    case 4:
                        storesWithSlug = _context2.sent;

                        if (storesWithSlug.length > 0) {
                            nameSlugged += '-' + (storesWithSlug.length + 1);
                        }

                        return _context2.abrupt('return', nameSlugged);

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x2) {
        return _ref2.apply(this, arguments);
    };
}();

storeSchema.statics.getTagsList = function () {
    return this.aggregate([{ $unwind: '$tags' }, // $ this is the field in my docs that i want to unwind
    { $group: { _id: '$tags', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
};

module.exports = mongoose.model('Store', storeSchema);
//# sourceMappingURL=Store.js.map