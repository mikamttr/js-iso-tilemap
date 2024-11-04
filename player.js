// player.js

// import { map } from './map.js';

// // Initial player position
// export let playerPosition = { x: 0, y: 0 };

// export function movePlayer(x, y) {
//     // Check if the destination tile is within bounds and not an obstacle
//     if (x >= 0 && x < map[0].length && y >= 0 && y < map.length && map[y][x] !== 2) {
//         playerPosition = { x, y };
//     }
// }

import { map } from './map.js';

// Initial player position
export let playerPosition = { x: 0, y: 0 };

export function movePlayer(x, y) {
    // Check if the destination tile is within bounds and not an obstacle
    if (x >= 0 && x < map[0].length && y >= 0 && y < map.length && map[y][x] !== 2) {
        playerPosition = { x, y };
        return true; // Move successful
    }
    return false; // Move failed
}
