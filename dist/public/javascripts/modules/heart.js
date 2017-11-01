'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bling = require('./bling');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ajaxHeart(e) {
    var _this = this;

    e.preventDefault();
    _axios2.default.post(this.action).then(function (res) {
        var isHearted = _this.heart.classList.toggle('heart__button--hearted');
        (0, _bling.$)('.heart-count').textContent = res.data.hearts.length;
        if (isHearted) {
            _this.heart.classList.add('heart__button--float');
            setTimeout(function () {
                return _this.heart.classList.remove('heart__button--float');
            }, 2500);
        }
    }).catch(console.error);
}

exports.default = ajaxHeart;
//# sourceMappingURL=heart.js.map