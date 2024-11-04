// pathfinding.js

import { map } from './map.js';

// A* algorithm for pathfinding
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan distance
}

function getNeighbors(node) {
    const neighbors = [];
    const directions = [
        { x: 0, y: 1 },  // down
        { x: 0, y: -1 }, // up
        { x: 1, y: 0 },  // right
        { x: -1, y: 0 }  // left
    ];

    for (const dir of directions) {
        const neighborX = node.x + dir.x;
        const neighborY = node.y + dir.y;

        // Check bounds and obstacles
        if (neighborX >= 0 && neighborX < map[0].length &&
            neighborY >= 0 && neighborY < map.length &&
            map[neighborY][neighborX] !== 2) { // 2 is an obstacle
            neighbors.push({ x: neighborX, y: neighborY });
        }
    }

    return neighbors;
}

export function astar(start, goal) {
    const openSet = new Set();
    const closedSet = new Set();
    const cameFrom = {};

    const gScore = {};
    const fScore = {};

    openSet.add(`${start.x},${start.y}`);
    gScore[`${start.x},${start.y}`] = 0;
    fScore[`${start.x},${start.y}`] = heuristic(start, goal);

    while (openSet.size > 0) {
        let current = null;
        for (const pos of openSet) {
            const [x, y] = pos.split(',').map(Number);
            if (current === null || fScore[pos] < fScore[current]) {
                current = pos;
            }
        }

        if (current === `${goal.x},${goal.y}`) {
            const path = [];
            let node = current;
            while (node) {
                path.unshift({ x: parseInt(node.split(',')[0]), y: parseInt(node.split(',')[1]) });
                node = cameFrom[node];
            }
            return path;
        }

        openSet.delete(current);
        closedSet.add(current);

        const neighbors = getNeighbors({ x: parseInt(current.split(',')[0]), y: parseInt(current.split(',')[1]) });

        for (const neighbor of neighbors) {
            const neighborPos = `${neighbor.x},${neighbor.y}`;
            if (closedSet.has(neighborPos)) continue;

            const tentativeGScore = gScore[current] + 1; // Assumes each move has a cost of 1

            if (!openSet.has(neighborPos)) {
                openSet.add(neighborPos);
            } else if (tentativeGScore >= (gScore[neighborPos] || Infinity)) {
                continue;
            }

            cameFrom[neighborPos] = current;
            gScore[neighborPos] = tentativeGScore;
            fScore[neighborPos] = tentativeGScore + heuristic(neighbor, goal);
        }
    }

    return []; // Return empty path if no path is found
}
