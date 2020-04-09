/**
* This is a simple JavaScript demonstration of how to call MapBox API to load the maps.
* I have set the default configuration to enable the geocoder and the navigation control.
* https://www.mapbox.com/mapbox-gl-js/example/popup-on-click/
*
* @author Adhi Baskoro <abas0012@student.monash.edu>
* Date: 09/04/2020
*/
const TOKEN = "pk.eyJ1IjoiYWJhczAwMTIiLCJhIjoiY2s4cDBvejUxMDJjaTNtcXViemgxYTI1dCJ9.wRCYToYunc4isymyq4Gy_Q";
var species = [];
// The first step is obtain all the latitude and longitude from the HTML
// The below is a simple jQuery selector
$(".coordinates").each(function () {
    var name = $(".name", this).text().trim();
    var longitude = $(".longitude", this).text().trim();
    var latitude = $(".latitude", this).text().trim();
    var lga = $(".lga", this).text().trim();
    //var year = $(".year", this).text().trim();
    //var month = $(".month", this).text().trim();
    //var day = $(".day", this).text().trim();
    // Create a point data structure to hold the values.
    var point = {
        "name": name,
        "latitude": latitude,
        "longitude": longitude,
        "lga": lga
        //"year": year,
        //"month": month,
        //"day": day
    };
    // Push them all into an array.
    species.push(point);
});
//data from points
var data = [];
for (i = 0; i < species.length; i++) {
    var feature = {
        "type": "Feature",
        "properties": {
            "name": species[i].name,
            "lga": species[i].lga,
            "icon": "circle-15"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [species[i].longitude, species[i].latitude]
        }
    };
    data.push(feature)
}

//finaldata
var finaldata = {
        "type": "FeatureCollection",
        "features": data
    }

mapboxgl.accessToken = TOKEN;
var filterGroup = document.getElementById('filter-group'); //filter element
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', //light map
    zoom: 11,
    center: [species[0].longitude, species[0].latitude]
});
map.on('load', function () {
    // Add a GeoJSON source containing place coordinates and information.
    map.addSource('datasource', {
        'type': 'geojson',
        'data': finaldata
    });


    // Add a layer showing the species.
    finaldata.features.forEach(function (feature) {
        var symbol = feature.properties['icon'];
        var lga = feature.properties['lga'];
        var layerID = 'poi-' + lga;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                'id': layerID,
                'type': 'circle',
                'source': 'datasource',
                'paint': {
                    'circle-color': 'rgba(55,148,179,1)'
                },
                'layout': {
                    'visibility': 'none',
                    //'icon-image': "{icon}",
                    //'icon-allow-overlap': true
                },
                'filter': ['==', 'lga', lga]
            });

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = false; //set to untick on initial load
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = lga; //Label names
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function (e) {
                map.setLayoutProperty(
                    layerID,
                    'visibility',
                    e.target.checked ? 'visible' : 'none'
                );
            });
        }
    });
});

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));;
map.addControl(new mapboxgl.NavigationControl());
// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', function () {
    map.getCanvas().style.cursor = '';
});

