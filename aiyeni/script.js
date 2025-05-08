let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

let selected = [];
let markers = [];
let pathLine = null;
let graph;

fetch('graph-data.json')
    .then(response => response.json())
    .then(data => {
        graph = data;

        Object.entries(data.coordinates).forEach(([id, coord]) => {
            L.circleMarker(coord, { radius: 5, color: 'blue' }).addTo(map);
        });

        map.on('click', function(e) {
            const nearestNode = findNearestNode(e.latlng, data.coordinates);
            if (selected.length < 2) {
                selected.push(nearestNode);
                let marker = L.marker(data.coordinates[nearestNode]).addTo(map);
                markers.push(marker);
            }

            if (selected.length === 2) {
                const path = dijkstra(data, selected[0], selected[1]);
                const latlngs = path.map(id => data.coordinates[id]);
                if (pathLine) map.removeLayer(pathLine);
                pathLine = L.polyline(latlngs, { color: 'red' }).addTo(map);

                const totalDist = calculateTotalDistance(path, data);
                document.getElementById('info').innerText = `Distance: ${totalDist.toFixed(2)} units.`;
            }
        });
    });

function findNearestNode(latlng, coordinates) {
    let minDist = Infinity;
    let closestNode = null;
    for (let id in coordinates) {
        let dist = map.distance(latlng, L.latLng(coordinates[id]));
        if (dist < minDist) {
            minDist = dist;
            closestNode = id;
        }
    }
    return closestNode;
}

function calculateTotalDistance(path, data) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const edges = data.edges[path[i]];
        const next = edges.find(edge => edge.node === path[i + 1]);
        if (next) total += next.weight;
    }
    return total;
}
