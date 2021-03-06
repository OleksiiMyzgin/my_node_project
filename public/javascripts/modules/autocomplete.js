function autocomplete(input, latInput, lngInput) {
    if(!input) return; // skip this fn from running if there is not input on the page
    const dropdawn = new google.maps.places.Autocomplete(input);

    dropdawn.addListener('place_changed', () => {
        const place = dropdawn.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });
    // if someone hits enter on the address field dont submit the form '
    input.on('keydown', (e) => {
        if(e.keyCode === 13) e.preventDefault();
    });
}

export default autocomplete;