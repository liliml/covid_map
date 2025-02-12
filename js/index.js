mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zZS0xNjgiLCJhIjoiY202aWYxY3lsMDdxdjJpcHJoaHlmZzdiNiJ9.3wUanYJCI6409InuRs9e7A';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6, // starting zoom
        center: [-122, 47.5] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let wa_covid_data = await response.json();

    map.on('load', function loadingData() {
        // add layer
        // add legend
        map.addSource('wa-covid-data-102521', {
            type: 'geojson',
            data: wa_covid_data
        });
        // console.log("got here");
        
        map.addLayer({
            'id': 'wa_covid_data-layer',
            'type': 'fill',
            'source': 'wa-covid-data-102521',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'fullyVaxPer10k'],
                    '#FFEDA0',   // stop_output_0
                    3000,          // stop_input_0 use color above if fullvax 3000 <
                    '#FED976',   // stop_output_1 
                    3500,          // stop_input_1 use color above if 3000 <= fullyvax < 3500
                    '#FEB24C',   // stop_output_2
                    4000,          // stop_input_2 use color above if 3500 <= fullyvax < 4000
                    '#FD8D3C',   // stop_output_3
                    4500,         // stop_input_3 use color above if 4000 <= fullyvax < 4500
                    '#FC4E2A',   // stop_output_4
                    5000,         // stop_input_4 use color above if 4500 <= fullyvax < 5000
                    '#E31A1C',   // stop_output_5
                    5500,         // stop_input_5 use color above if 5000 <= fullyvax < 5500
                    '#BD0026',   // stop_output_6
                    6000,        // stop_input_6 use color above if 5500 <= fullyvax < 6000
                    "#800026",    // stop_output_7
                    6500,        // stop_input_7 use color above if 6000 <= fullyvax < 6500
                    "#5000d2",    // stop_output_8 
                    7000,        // stop_input_8 use color above if 6500 <= fullyvax < 7000
                    "#2a006f",    // stop_output_9 
                                  // use color above if 7000 <= fullyvax 
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });
    });

    
    const layers = [
        'less then 3000',
        '3000-3499',
        '3500-3999',
        '4000-4499',
        '4500-4999',
        '5000-5499',
        '5500-5999',
        '6000-6499',
        '6500-6999',
        '7000 or more'
    ];
    const colors = [
        '#FFEDA0', 
        '#FED976', 
        '#FEB24C',
        '#FD8D3C', 
        '#FC4E2A',  
        '#E31A1C',  
        '#BD0026', 
        "#800026",  
        "#5000d2",  
        "#2a006f"  
    ];
    
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Number of Fully Vaccinated People<br>(people per 10k within the county)</b><br><br>";
    
    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
    
        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
    
    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['wa_covid_data-layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.fullyVaxPer10k}</strong> number of people who are fully vaccinated per 10k people within the county</em></p>` :
            `<p>Hover over a Washington county!</p>`;
    });
}

geojsonFetch();