// map.js

export const mapWidth = 18;
export const mapHeight = 18;

export function createMap(width, height) {
    const map = [];
    for (let row = 0; row < height; row++) {
        const rowArray = [];
        for (let col = 0; col < width; col++) {
            // Randomly decide if this tile should be an obstacle (2) or grass (1)
            const isObstacle = Math.random() < 0.2; // 20% chance of being an obstacle
            rowArray.push(isObstacle ? 2 : 1); // 2 for obstacle, 1 for grass
        }
        map.push(rowArray);
    }
    return map;
}

// Initialize the map
export const map = createMap(mapWidth, mapHeight);
