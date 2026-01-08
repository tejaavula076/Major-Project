mapboxgl.accessToken = mapToken;
if (typeof coordinates === 'string') {
    coordinates = JSON.parse(coordinates);   // now it's [lng, lat]
}
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
// console.log(coordinates)
const homeEl = document.createElement("div");
homeEl.innerHTML = `
<i class="fa-solid fa-house"></i>
`;
homeEl.style.fontSize = "20px";
homeEl.style.color = "red"
homeEl.style.borderRadius = "50%"
homeEl.style.cursor = "pointer"
// console.log(location)
const marker1 = new mapboxgl.Marker(homeEl)
    .setLngLat(coordinates)
    .addTo(map);
const popup = new mapboxgl.Popup({ offset: 25 })
  .setLngLat(coordinates)                      // 👈 important
  .setHTML(`<h4>${listinglocation}</h4><p>Exact location will be provided after booking</p>`)
  .setMaxWidth("300px")

marker1.setPopup(popup);

// console.log("iam the marker", marker1)