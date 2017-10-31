'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bling = require('./bling');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapOptions = {
    center: { lat: 43.2, lng: -79.8 },
    zoom: 10
};

function loadPlaces(map) {
    var lat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 43.2;
    var lng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -79.8;

    _axios2.default.get('/api/stores/near?lat=' + lat + '&lng=' + lng).then(function (res) {
        var places = res.data;
        if (!places.length) {
            alert('no places found!');
            return;
        }

        //create a bounds
        var bounds = new google.maps.LatLngBounds();
        var infoWindow = new google.maps.InfoWindow();

        var markers = places.map(function (place) {
            var _place$location$coord = _slicedToArray(place.location.coordinates, 2),
                placeLng = _place$location$coord[0],
                placeLat = _place$location$coord[1];

            var position = { lat: placeLat, lng: placeLng };
            bounds.extend(position);
            var marker = new google.maps.Marker({ map: map, position: position });
            marker.place = place;
            return marker;
        });

        // when someone clicks on a marker, show the details of that places
        markers.forEach(function (marker) {
            return marker.addListener('click', function () {
                var html = '\n                <div class="popup">\n                    <a href="/store/' + this.place.slug + '">\n                        <img src="/uploads/' + (this.place.photo || 'store.png') + '" alt="' + this.place.name + '">\n                        <p>' + this.place.name + ' - ' + this.place.location.address + '</p>\n                    </a>\n                </div>\n                ';
                infoWindow.setContent(html);
                infoWindow.open(map, this);
            });
        });

        //then zoom the map to fit all the markers perfectly
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    });
}

function makeMap(mapDiv) {
    if (!mapDiv) return;
    // make our map
    var map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map);

    var input = (0, _bling.$)('[name="geolocate"]');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
    });
}

exports.default = makeMap;
//# sourceMappingURL=map.js.map