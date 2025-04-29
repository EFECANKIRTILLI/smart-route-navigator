const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let graphData;
let startNode = null;
let endNode = null;
let polyline = null;

fetch('graph-data.json')
  .then(res => res.json())
  .then(data => {
    graphData = data;

    for (let node in data.coordinates) {
      const [lat, lng] = data.coordinates[node];
      const marker = L.marker([lat, lng]).addTo(map).bindPopup(`<b>${node}</b>`);

      // when u click marker , select starting and ending point :D
      marker.on('click', () => {
        if (!startNode) {
          startNode = node;
          marker.setIcon(L.icon({
            iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
            iconSize: [32, 32]
          }));
        } else if (!endNode && node !== startNode) {
          endNode = node;
          marker.setIcon(L.icon({
            iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
            iconSize: [32, 32]
          }));

          // Dijkstra start
          const result = dijkstra(graphData, startNode, endNode);
          const coords = result.path.map(n => data.coordinates[n]);

          // Drawing path :D
          polyline = L.polyline(coords, { color: 'blue' }).addTo(map);

          // show me distance
          alert(`En kısa yol: ${result.path.join(' → ')}\nToplam Mesafe: ${result.distance}`);
        }
      });
    }
  })
  .catch(err => console.error(err));
