// --- CONFIGURATION ---
const travelData = {
    "IND": {
        name: "India",
        photos: ["IND.jpg"] 
    }
};

// 1. Initialize Map
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. Load Country Boundaries
fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                // Get the ID to check for a match
                const iso = feature.properties.ISO_A3 || feature.properties.iso_a3 || feature.id;
                const countryCode = iso ? iso.toString().toUpperCase() : "";

                // CHANGE: If the country is in our travelData, make it Dark Blue, else Light Gray
                const hasPhotos = travelData[countryCode];
                
                return {
                    fillColor: hasPhotos ? '#00008b' : '#cccccc', // Dark Blue vs Light Gray
                    weight: 1,
                    color: 'white',
                    fillOpacity: hasPhotos ? 0.8 : 0.4
                };
            },
            onEachFeature: function(feature, layer) {
                const iso = feature.properties.ISO_A3 || feature.properties.iso_a3 || feature.id;
                const countryCode = iso ? iso.toString().toUpperCase() : "";

                layer.on('mouseover', function() { 
                    this.setStyle({ fillOpacity: 1, weight: 2 }); 
                });
                layer.on('mouseout', function() { 
                    const hasPhotos = travelData[countryCode];
                    this.setStyle({ 
                        fillOpacity: hasPhotos ? 0.8 : 0.4,
                        weight: 1 
                    }); 
                });

                layer.on('click', function(e) {
                    if (travelData[countryCode]) {
                        openGallery(countryCode);
                    } else {
                        const name = feature.properties.name || "this country";
                        alert("No photos for " + name);
                    }
                });
            }
        }).addTo(map);
    })
    .catch(err => console.error("Map data failed to load:", err));

// --- FUNCTIONS ---

function openGallery(iso) {
    const data = travelData[iso];
    const modal = document.getElementById('gallery-modal');
    const nameHeader = document.getElementById('country-name');
    const grid = document.getElementById('photo-grid');

    if (modal && data) {
        nameHeader.innerText = data.name;
        grid.innerHTML = ''; 
        
        data.photos.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.onerror = () => { img.src = 'https://via.placeholder.com/600x400?text=IND.jpg+Not+Found'; };
            grid.appendChild(img);
        });

        modal.style.display = 'block';
    }
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
};