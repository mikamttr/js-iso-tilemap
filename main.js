import { mapWidth, mapHeight, map } from './map.js';
import { drawMap } from './render.js';
import { playerPosition } from './player.js';
import { astar } from './pathfinding.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

const PLAYER_SPEED = 0.1;

let hoveredTile = null;
let path = [];
let pathIndex = 0;
let targetPosition = null;

function screenToIso(mouseX, mouseY) {
    const x = ((mouseX - canvas.width / 2) / (TILE_WIDTH / 2) +
        (mouseY - 100) / (TILE_HEIGHT / 2)) / 2;
    const y = ((mouseY - 100) / (TILE_HEIGHT / 2) -
        (mouseX - canvas.width / 2) / (TILE_WIDTH / 2)) / 2;
    return { x: Math.floor(x), y: Math.floor(y) };
}

// Function to get the type of tile at the given coordinates
function getTileType(tileCoords) {
    if (tileCoords.x >= 0 && tileCoords.x < mapWidth &&
        tileCoords.y >= 0 && tileCoords.y < mapHeight) {
        return map[tileCoords.y][tileCoords.x];
    }
    return null;
}

canvas.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const tileCoords = screenToIso(mouseX, mouseY);

    if (tileCoords.x >= 0 && tileCoords.x < mapWidth &&
        tileCoords.y >= 0 && tileCoords.y < mapHeight) {

        const tileType = getTileType(tileCoords);

        if (tileType == 2) {
            hoveredTile = null;
            canvas.style.cursor = 'default';
        } else {
            hoveredTile = tileCoords;
            canvas.style.cursor = 'pointer';
        }
    } else {
        hoveredTile = null;
        canvas.style.cursor = 'default';
    }

    drawMap(ctx, hoveredTile, playerPosition);
});

canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const tileCoords = screenToIso(mouseX, mouseY);

    if (tileCoords.x >= 0 && tileCoords.x < mapWidth &&
        tileCoords.y >= 0 && tileCoords.y < mapHeight) {
        const tileType = getTileType(tileCoords);

        // Only allow pathfinding if the tile is not an obstacle
        if (tileType !== 2) {
            path = astar(playerPosition, tileCoords);
            pathIndex = 0;
            targetPosition = path.length > 0 ? path[0] : null; // Set target to the first tile in path
        }

        drawMap(ctx, hoveredTile, playerPosition);
    }
});

// Update player position along the path
function update() {
    if (targetPosition) {
        const dx = targetPosition.x - playerPosition.x;
        const dy = targetPosition.y - playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) {
            // If close enough, move to the target tile and advance the path index
            playerPosition.x = targetPosition.x;
            playerPosition.y = targetPosition.y;
            pathIndex++;
            targetPosition = pathIndex < path.length ? path[pathIndex] : null; // Update target
        } else {
            // Move towards the target position
            const moveX = (dx / distance) * Math.min(PLAYER_SPEED, distance);
            const moveY = (dy / distance) * Math.min(PLAYER_SPEED, distance);
            playerPosition.x += moveX;
            playerPosition.y += moveY;
        }
    }

    drawMap(ctx, hoveredTile, playerPosition);
    requestAnimationFrame(update);
}

drawMap(ctx, hoveredTile, playerPosition);
update();
