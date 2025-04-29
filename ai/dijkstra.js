function dijkstra(graph, start, end) {
  const distances = {};
  const visited = {};
  const previous = {};
  const queue = [];

  for (let node of graph.nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  queue.push({ node: start, distance: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift().node;

    if (current === end) break;
    if (visited[current]) continue;
    visited[current] = true;

    for (let neighbor of graph.edges[current]) {
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
        queue.push({ node: neighbor.node, distance: alt });
      }
    }
  }

  const path = [];
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { path, distance: distances[end] };
}
