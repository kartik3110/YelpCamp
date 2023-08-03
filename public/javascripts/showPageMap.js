//this js file is served publically on client side. it does not have access to env variables as its not 
//server-side generated.
mapboxgl.accessToken = mapToken;
const foundCamp = JSON.parse(foundCampData)
console.log(foundCamp)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: foundCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
});


//create a new popup
const myPopup = new mapboxgl.Popup({ offset: 25, closeButton: false })
    .setHTML(`<h3>${foundCamp.title}</h3>`)
// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(foundCamp.geometry.coordinates)
    .setPopup(myPopup)
    .addTo(map);

