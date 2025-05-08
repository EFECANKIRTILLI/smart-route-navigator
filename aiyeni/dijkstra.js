function dijkstra(graph, startNode, endNode) {
    const distances = {};
    const previous = {};
    const queue = new Set(graph.nodes);

    graph.nodes.forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[startNode] = 0;

    while (queue.size > 0) {
        let currentNode = Array.from(queue).reduce((minNode, node) =>
            distances[node] < distances[minNode] ? node : minNode
        );

        queue.delete(currentNode);

        if (currentNode === endNode) break;

        const neighbors = graph.edges[currentNode] || [];
        neighbors.forEach(neighbor => {
            const alt = distances[currentNode] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                previous[neighbor.node] = currentNode;
            }
        });
    }

    const path = [];
    let node = endNode;
    while (node) {
        path.unshift(node);
        node = previous[node];
    }
    return path;
}
