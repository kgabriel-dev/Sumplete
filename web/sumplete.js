"use strict";
function initializeGame(gridSize) {
    if (gridSize < 1) {
        console.error('Grid size must be at least 1');
        return;
    }
    var gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    // Initialize the game here
    gameContainer.innerHTML = "Game initialized with grid size: ".concat(gridSize);
}
initializeGame(5);
