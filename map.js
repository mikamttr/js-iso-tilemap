export const mapWidth = 18;
export const mapHeight = 18;

export function createMap(width, height) {
    const map = [];
    for (let row = 0; row < height; row++) {
        const rowArray = [];
        for (let col = 0; col < width; col++) {
            const isObstacle = Math.random() < 0.2; // 20% chance of being an obstacle
            rowArray.push(isObstacle ? 2 : 1); // 1 for grass, 2 for obstacle
        }
        map.push(rowArray);
    }
    return map;
}

// Initialize the map
export const map = createMap(mapWidth, mapHeight);
