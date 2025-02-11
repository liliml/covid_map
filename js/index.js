mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zZS0xNjgiLCJhIjoiY202aWYxY3lsMDdxdjJpcHJoaHlmZzdiNiJ9.3wUanYJCI6409InuRs9e7A';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
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
                    3000,          // stop_input_0
                    '#FED976',   // stop_output_1
                    3500,          // stop_input_1
                    '#FEB24C',   // stop_output_2
                    4000,          // stop_input_2
                    '#FD8D3C',   // stop_output_3
                    4500,         // stop_input_3
                    '#FC4E2A',   // stop_output_4
                    5000,         // stop_input_4
                    '#E31A1C',   // stop_output_5
                    5500,         // stop_input_5
                    '#BD0026',   // stop_output_6
                    6000,        // stop_input_6
                    "#800026",    // stop_output_7
                    6500,        // stop_input_7
                    "#e13b26",    // stop_output_8
                    7000,        // stop_input_8
                    "#ad0955",    // stop_output_9
                    7500,        // stop_input_9
                    "#86013e",    // stop_output_10
                    
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });
    });

    
    const layers = [
        '3000-3499',
        '3500-3999',
        '4000-4499',
        '4500-4999',
        '5000-5499',
        '5500-5999',
        '6000-6499',
        '6500-6999',
        '7000-7499',
        '7500-7999',
        '8000 or more'
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
        "#e13b26",  
        "#ad0955",  
        "#86013e"
    ];
    
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Population Density<br>(people/sq.mi.)</b><br><br>";
    
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
            `<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.density}</strong> people per square mile</em></p>` :
            `<p>Hover over a state!</p>`;
    });
}

geojsonFetch();