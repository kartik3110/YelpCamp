//this js file is served publically on client side. it does not have access to env variables as its not server-side generated.
mapboxgl.accessToken = mapToken;
//use ajax to request campground data in this file. cant require stuff in client side js, therefore use cdn to include axios.(or use fetch api)

const fetchData = async function () {
    const response = await axios.get(`/find/${campId}`)
    const foundCamp = response.data;
    console.log('in async function')

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: foundCamp.geometry.coordinates, // starting position [lng, lat]
        zoom: 6 // starting zoom
    });


    map.addControl(new mapboxgl.NavigationControl());

    //create a new popup
    const myPopup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`<h3>${foundCamp.title}</h3>`)
    // Create a new marker.
    const marker = new mapboxgl.Marker()
        .setLngLat(foundCamp.geometry.coordinates)
        .setPopup(myPopup)
        .addTo(map);
}
fetchData();
