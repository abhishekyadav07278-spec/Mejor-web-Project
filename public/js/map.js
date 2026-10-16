 
    const map = new mapboxgl.Map({
        accessToken: maptoken,
        container: 'map', // container ID
        center: center, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });

    // create a marker at a coordinate
const marker = new mapboxgl.Marker({
     color: '#FF0000', // set marker color
        // scale the marker size
 
}).setPopup(new mapboxgl.Popup({offset:25})
    .setHTML("<p>Exact location will be provided after booking</p>")
    .setMaxWidth("300px"))
  .setLngLat(center)
  .addTo(map);