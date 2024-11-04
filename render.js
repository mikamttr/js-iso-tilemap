// render.js

import { map } from './map.js';

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export function isoToScreen(x, y) {
    const screenX = (x - y) * (TILE_WIDTH / 2);
    const screenY = (x + y) * (TILE_HEIGHT / 2);
    return { x: screenX, y: screenY };
}

export function drawTile(ctx, x, y, color, opacity = 1) {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    ctx.lineTo(x, y + TILE_HEIGHT);
    ctx.lineTo(x - TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1; // Reset opacity
}

export function drawMap(ctx, hoveredTile, playerPosition) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const { x, y } = isoToScreen(col, row);
            const screenX = x + ctx.canvas.width / 2;
            const screenY = y + 100;

            // Draw grass or obstacle based on the map value
            if (map[row][col] === 1) {
                drawTile(ctx, screenX, screenY, "#6a9e60"); // Grass tile
            } else if (map[row][col] === 2) {
                drawTile(ctx, screenX, screenY, "#4a4a4a"); // Obstacle tile
            }

            // Draw hover effect
            if (hoveredTile && hoveredTile.x === col && hoveredTile.y === row) {
                drawTile(ctx, screenX, screenY, "#ffffff", 0.4); // Light overlay
            }
        }
    }

    // Draw the player at the current position
    const playerScreenPos = isoToScreen(playerPosition.x, playerPosition.y);
    drawTile(ctx, playerScreenPos.x + ctx.canvas.width / 2, playerScreenPos.y + 100, "#0000FF"); // Blue for player
}
