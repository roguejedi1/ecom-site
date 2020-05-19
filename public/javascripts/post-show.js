mapboxgl.accessToken = '';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10'
});

map.on('load', function () {
    map.loadImage(
        'images/mapbox-icon.png',
        function (error, image) {
            if (error) throw error;
            map.addImage('cat', image);
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [0, 0]
                            }
                        }
                    ]
                }
            });
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point',
                'layout': {
                    'icon-image': 'cat',
                    'icon-size': 0.25
                }
            });
        }
    );
});

// Edit review forms
$('.toggle-edit-form').on('click', function () {
    // toggle edit button text
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit')
    // toggle edit review form visibility
    $(this).siblings('.edit-review-form').toggle();
});

// Clear ratings on review
$('.clear-rating').click(function(){
    $(this).siblings('.input-no-rate').click();
});