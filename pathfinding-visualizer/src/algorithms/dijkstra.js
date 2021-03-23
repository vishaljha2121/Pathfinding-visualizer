export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
    }
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    console.log(unvisitedNodes);

    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        //console.log(unvisitedNodes[0]);

        const closestNode = unvisitedNodes.shift();
        //console.log(closestNode);
        if (closestNode.isWall) continue

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateNeighbors(closestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col + 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}