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

/**
 * Path finding with diagonals
 */

// import { map } from './map.js';

// // A* algorithm for pathfinding
// function heuristic(a, b) {
//     // Use Euclidean distance for better accuracy with diagonal movement
//     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
// }

// function getNeighbors(node) {
//     const neighbors = [];
//     const directions = [
//         { x: 0, y: 1 },   // down
//         { x: 0, y: -1 },  // up
//         { x: 1, y: 0 },   // right
//         { x: -1, y: 0 },  // left
//         { x: 1, y: 1 },   // down-right (diagonal)
//         { x: 1, y: -1 },  // up-right (diagonal)
//         { x: -1, y: 1 },  // down-left (diagonal)
//         { x: -1, y: -1 }  // up-left (diagonal)
//     ];

//     for (const dir of directions) {
//         const neighborX = node.x + dir.x;
//         const neighborY = node.y + dir.y;

//         // Check bounds and obstacles
//         if (neighborX >= 0 && neighborX < map[0].length &&
//             neighborY >= 0 && neighborY < map.length &&
//             map[neighborY][neighborX] !== 2) { // 2 is an obstacle
//             // For diagonal movement, check if the path is clear
//             if (Math.abs(dir.x) + Math.abs(dir.y) === 2) { // It's a diagonal move
//                 const betweenX = node.x + dir.x;
//                 const betweenY = node.y; // Horizontal middle point
//                 const betweenX2 = node.x; // Vertical middle point
//                 const betweenY2 = node.y + dir.y;

//                 // Check if the horizontal or vertical path is blocked
//                 if (map[neighborY][betweenX] === 2 || map[betweenY2][neighborX] === 2) {
//                     continue; // If either tile is an obstacle, skip this neighbor
//                 }
//             }
//             neighbors.push({ x: neighborX, y: neighborY });
//         }
//     }

//     return neighbors;
// }

// export function astar(start, goal) {
//     const openSet = new Set();
//     const closedSet = new Set();
//     const cameFrom = {};

//     const gScore = {};
//     const fScore = {};

//     openSet.add(`${start.x},${start.y}`);
//     gScore[`${start.x},${start.y}`] = 0;
//     fScore[`${start.x},${start.y}`] = heuristic(start, goal);

//     while (openSet.size > 0) {
//         let current = null;
//         for (const pos of openSet) {
//             const [x, y] = pos.split(',').map(Number);
//             if (current === null || fScore[pos] < fScore[current]) {
//                 current = pos;
//             }
//         }

//         if (current === `${goal.x},${goal.y}`) {
//             const path = [];
//             let node = current;
//             while (node) {
//                 path.unshift({ x: parseInt(node.split(',')[0]), y: parseInt(node.split(',')[1]) });
//                 node = cameFrom[node];
//             }
//             return path;
//         }

//         openSet.delete(current);
//         closedSet.add(current);

//         const neighbors = getNeighbors({ x: parseInt(current.split(',')[0]), y: parseInt(current.split(',')[1]) });

//         for (const neighbor of neighbors) {
//             const neighborPos = `${neighbor.x},${neighbor.y}`;
//             if (closedSet.has(neighborPos)) continue;

//             // Extract current node position for G-score calculation
//             const [currentX, currentY] = current.split(',').map(Number);
//             const tentativeGScore = gScore[current] + (neighbor.x !== currentX && neighbor.y !== currentY ? Math.sqrt(2) : 1); // Cost of diagonal move is sqrt(2)

//             if (!openSet.has(neighborPos)) {
//                 openSet.add(neighborPos);
//             } else if (tentativeGScore >= (gScore[neighborPos] || Infinity)) {
//                 continue;
//             }

//             cameFrom[neighborPos] = current;
//             gScore[neighborPos] = tentativeGScore;
//             fScore[neighborPos] = tentativeGScore + heuristic(neighbor, goal);
//         }
//     }

//     return []; // Return empty path if no path is found
// }
