'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _dompurify = require('dompurify');

var _dompurify2 = _interopRequireDefault(_dompurify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function searchResultHTML(stores) {
    return stores.map(function (store) {
        return '\n        <a href="/store/' + store.slug + '" class="search__result">\n            <strong>' + store.name + '</strong>\n        </a>\n        ';
    }).join('');
};

function typeAhead(search) {
    if (!search) return;

    var searchInput = search.querySelector('input[name="search"]');
    var searchResults = search.querySelector('.search__results');

    searchInput.on('input', function () {
        var _this = this;

        // if there is no value^quit it!
        if (!this.value) {
            searchResults.style.display = 'none';
            return; // stop!
        }

        // show the search results!
        searchResults.style.display = 'block';

        _axios2.default.get('/api/search?q=' + this.value).then(function (res) {
            if (res.data.length) {
                searchResults.innerHTML = _dompurify2.default.sanitize(searchResultHTML(res.data));
                return;
            } else {
                // tell them nothing came back
                searchResults.innerHTML = _dompurify2.default.sanitize('<div class ="search__result">No results for ' + _this.value + ' found!</div>');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });

    // handle keyboard inputs
    searchInput.on('keyup', function (e) {
        // if they aren't pressing up, down or enter, who cares!
        if (![38, 40, 13].includes(e.keyCode)) {
            return; // skip it!
        }
        var activeClass = 'search__result--active';
        var current = search.querySelector('.' + activeClass);
        var items = search.querySelectorAll('.search__result');
        var next = void 0;
        if (e.keyCode === 40 && current) {
            next = current.nextElementSibling || items[0];
        } else if (e.keyCode === 40) {
            next = items[0];
        } else if (e.keyCode === 38 && current) {
            next = current.previousElementSibling || items[items.length - 1];
        } else if (e.keyCode === 38) {
            next = items[items.length - 1];
        } else if (e.keyCode === 13 && current.href) {
            window.location = current.href;
            return;
        }
        if (current) {
            current.classList.remove(activeClass);
        }
        next.classList.add(activeClass);
    });
};

exports.default = typeAhead;
//# sourceMappingURL=typeAhead.js.map