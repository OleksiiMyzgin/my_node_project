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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define our Indexes
storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.index({ location: '2dsphere' });

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

storeSchema.statics.getTopStores = function () {
    return this.aggregate([
    // Lookup Stores and populate their reviews
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
    // filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true } } },
    // Add the average reviews field
    { $addFields: {
            averageRating: { $avg: '$reviews.rating' }
        } },
    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 } },
    // limit to ar most 10
    { $limit: 10 }]);
};

// find reviews where the store _id property === reviews store property
storeSchema.virtual('reviews', {
    ref: 'Review', // what model to link?
    localField: '_id', // which field on the store?
    foreignField: 'store' // which field on the review?
});

function autopopulate(next) {
    this.populate('reviews');
    next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);
//# sourceMappingURL=Store.js.map