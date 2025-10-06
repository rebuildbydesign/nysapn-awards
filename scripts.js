mapboxgl.accessToken = 'pk.eyJ1IjoiajAwYnkiLCJhIjoiY2x1bHUzbXZnMGhuczJxcG83YXY4czJ3ayJ9.S5PZpU9VDwLMjoX_0x5FDQ'; // HOLDS THE CURRENTLY OPEN POPUP var currentPopup = null;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-75.0, 43.0], // Approx center of New York State
  zoom: 6.3,
  minZoom: 5.5
});

// Disable scroll zoom until click
map.scrollZoom.disable();
map.on('click', () => map.scrollZoom.enable());

// Add Geocoder
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: 'Search for an address',
  marker: false
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Load GeoJSON and add points
map.on('load', () => {
  map.addSource('nys-projects', {
    type: 'geojson',
    data: 'nysapn-awards.geojson'
  });

  map.addLayer({
    id: 'nys-project-points',
    type: 'circle',
    source: 'nys-projects',
    paint: {
      'circle-radius': 8,
      'circle-color': [
        'match',
        ['get', 'Category'],
        'Large Community Infrastructure Project', '#bdbfff',
        'Mid-Size Community Infrastructure Project', '#a1d5d7',
        'Small Community Infrastructure Project', '#276a64',
        'Climate Adaptation Program', '#0059ff',
        '#ccc' // fallback color
      ],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 1.2,
      
    }
  });

    // TOOLTIPS WITH NAME

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mouseenter', 'nys-project-points', (e) => {
  const props = e.features[0].properties;
  const coordinates = e.features[0].geometry.coordinates.slice();
  const shortName = props.Project_Name;

  popup.setLngLat(coordinates).setHTML(`<strong>${shortName}</strong>`).addTo(map);
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'nys-project-points', () => {
  popup.remove();
  map.getCanvas().style.cursor = '';
});



  // Popups
  map.on('click', 'nys-project-points', (e) => {
    const props = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    const popupHTML = `
      <div>
        <img class="popup-thumbnail" src="${props.Photo_URL}" alt="Project image" />
        <div class="popup-title">${props.Project_Name}</div>
        <div class="popup-description">${props.Project_Description}</div>
        <div class="popup-category"><strong>Category:</strong> ${props.Category}</div>
        <div class="popup-category"><strong>Location:</strong> ${props.Location}</div>
        <div class="popup-category"><strong>Organization:</strong> ${props.Organization}</div>
        <div class="popup-cta">
          <a href="${props.Link}" target="_blank">Learn more →</a>
        </div>
      </div>
    `;

    new mapboxgl.Popup({ offset: 16 })
      .setLngLat(coordinates)
      .setHTML(popupHTML)
      .addTo(map);
  });

  // Change cursor to pointer on hover
  map.on('mouseenter', 'nys-project-points', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'nys-project-points', () => {
    map.getCanvas().style.cursor = '';
  });
});