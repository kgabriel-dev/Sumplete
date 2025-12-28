"use strict";
function initializeGame(gridSize) {
    if (gridSize < 1) {
        console.error('Grid size must be at least 1');
        return;
    }
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    // Initialize the game here
    const gridCells = [];
    // Create the game grid
    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
            gridCells[i] = gridCells[i] || [];
            gridCells[i][j] = cell;
            // Add click event listener to toggle cell state
            cell.addEventListener('click', () => {
                toggleCell(cell, i, j);
            });
            // Add hover effects
            cell.addEventListener('mouseenter', () => {
                cell.classList.add('cell-hovered');
            });
            cell.addEventListener('mouseleave', () => {
                cell.classList.remove('cell-hovered');
            });
        }
        // Append the result column
        const resultCell = document.createElement('div');
        resultCell.className = 'cell result-cell-right';
        row.appendChild(resultCell);
        gameContainer.appendChild(row);
        gridCells[i].push(resultCell);
    }
    // Append the result row at the bottom
    const row = document.createElement('div');
    row.classList = 'row result-row';
    gameContainer.appendChild(row);
    for (let i = 0; i < gridSize; i++) {
        const resultCell = document.createElement('div');
        resultCell.className = 'cell result-cell-bottom';
        row.appendChild(resultCell);
        gridCells[gridSize] = gridCells[gridSize] || [];
        gridCells[gridSize][i] = resultCell;
    }
    return gridCells;
}
function createNumbers(gameGrid) {
    const GRID_SIZE = gameGrid.length - 1;
    // Define the results displayed along the y-axis
    const resultsPerRow = [];
    for (let i = 0; i < GRID_SIZE; i++)
        resultsPerRow.push(GRID_SIZE + Math.round(Math.random() * 20));
    // Define which numbers are correct
    const correctCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        // Define how many numbers are correct
        const correctCellsAmount = Math.ceil(Math.random() * GRID_SIZE);
        const indicesMap = [];
        for (let i = 0; i < GRID_SIZE; i++)
            indicesMap.push(i);
        // Shuffle the indices map
        indicesMap.sort(() => Math.random() - 0.5);
        // Fill the current row in the correctCells array
        correctCells[row] = [...Array(GRID_SIZE).keys()].map(() => false);
        for (let i = 0; i < GRID_SIZE; i++)
            correctCells[row][indicesMap[i]] = (i < correctCellsAmount);
        // Create the correct numbers
        const correctNumbers = splitNumber(resultsPerRow[row], correctCellsAmount, []);
        // Place the numbers at the correct place
        // Meaning correct numbers on correct cells, random numbers at wrong cells
        for (let column = 0; column < GRID_SIZE; column++) {
            gameGrid[row][column].innerText = (correctCells[row][column] ? correctNumbers.pop() || 0 : Math.ceil(Math.random() * GRID_SIZE)).toString();
        }
        // Place the results in the corresponding cell
        gameGrid[row][GRID_SIZE].innerText = resultsPerRow[row].toString();
    }
    // Define the results displayed along the x-axis
    const resultsPerColumn = [];
    for (let column = 0; column < GRID_SIZE; column++) {
        let columnSum = 0;
        for (let row = 0; row < GRID_SIZE; row++) {
            if (!correctCells[row][column])
                continue;
            columnSum += parseInt(gameGrid[row][column].innerText);
        }
        gameGrid[GRID_SIZE][column].innerText = columnSum.toString();
    }
}
function splitNumber(num, count, partsInput = []) {
    const SPACEHOLDER_VALUE = -1;
    // List of parts in the input that are not placeholders
    const parts = partsInput.filter(part => part !== SPACEHOLDER_VALUE);
    // Calculate how many parts are missing
    const missingPartsCount = count - parts.length;
    // Calculate the number that is missing
    const partsSum = parts.reduce((accumulator, current) => accumulator + current, 0);
    const missingNumber = num - partsSum;
    // Check if a new number is even needed
    if (missingNumber == 0 || missingPartsCount == 0)
        return parts;
    // Check if the result is trivial, meaning only 1 more number is needed
    if (missingPartsCount == 1)
        return [...parts, missingNumber];
    // A new random number must be added to the parts array
    // The number must be at least 1, and low enough to allow missingPartsCount many numbers
    const nextNumber = 1 + Math.floor(Math.random() * (missingNumber - (missingPartsCount - 1)));
    // Return an array containing calculated parts and placeholders at the end
    const partsOutput = [];
    partsOutput.push(...parts, nextNumber);
    for (let i = partsOutput.length; i < count; i++)
        partsOutput.push(SPACEHOLDER_VALUE);
    return splitNumber(num, count, partsOutput);
}
function toggleCell(cell, row, column) {
    if (!gameGrid)
        return;
    const currentState = cellStates[row][column];
    // Cycle through states: 0 -> 1 -> 2 -> 0
    const newState = (currentState + 1) % 3;
    cellStates[row][column] = newState;
    // Update cell appearance based on state
    cell.classList.remove('cell-unselected', 'cell-marked-wrong', 'cell-marked-correct');
    switch (newState) {
        case 0:
            cell.classList.add('cell-unmarked');
            cell.classList.remove('cell-marked-wrong', 'cell-marked-correct');
            break;
        case 1:
            cell.classList.add('cell-marked-wrong');
            cell.classList.remove('cell-unmarked', 'cell-marked-correct');
            break;
        case 2:
            cell.classList.add('cell-marked-correct');
            cell.classList.remove('cell-unmarked', 'cell-marked-wrong');
            break;
    }
    // Update the state of the corresponding result cells
    // Check if the whole row's sum is correct - Not that all correct cells must be marked correct, but the sum must match
    const resultCellRight = gameGrid[row][GRID_SIZE];
    let rowSum = 0;
    let expectedRowSum = parseInt(resultCellRight.innerText);
    for (let j = 0; j < GRID_SIZE; j++) {
        if (cellStates[row][j] === 2) {
            rowSum += parseInt(gameGrid[row][j].innerText);
        }
    }
    if (rowSum === expectedRowSum) {
        resultCellRight.classList.add('result-cell-correct');
        resultCellRight.classList.remove('result-cell-wrong');
    }
    else if (rowSum > 0) {
        resultCellRight.classList.add('result-cell-wrong');
        resultCellRight.classList.remove('result-cell-correct');
    }
    else {
        resultCellRight.classList.remove('result-cell-correct', 'result-cell-wrong');
    }
    // Check if the whole column's sum is correct
    const resultCellBottom = gameGrid[GRID_SIZE][column];
    let columnSum = 0;
    let expectedColumnSum = parseInt(resultCellBottom.innerText);
    for (let i = 0; i < GRID_SIZE; i++) {
        if (cellStates[i][column] === 2) {
            columnSum += parseInt(gameGrid[i][column].innerText);
        }
    }
    if (columnSum === expectedColumnSum) {
        resultCellBottom.classList.add('result-cell-correct');
        resultCellBottom.classList.remove('result-cell-wrong');
    }
    else {
        resultCellBottom.classList.add('result-cell-wrong');
        resultCellBottom.classList.remove('result-cell-correct');
    }
}
const GRID_SIZE = 5;
const gameGrid = initializeGame(GRID_SIZE);
const cellStates = [];
if (gameGrid) {
    createNumbers(gameGrid);
    // Initialize cell states
    for (let i = 0; i < GRID_SIZE; i++) {
        cellStates[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            cellStates[i][j] = 0; // 0: unselected, 1: marked wrong, 2: marked correct
        }
    }
}
