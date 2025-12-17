function initializeGame(gridSize: number): HTMLDivElement[][] | undefined {
    if(gridSize < 1) {
        console.error('Grid size must be at least 1');
        return;
    }

    const gameContainer = document.getElementById('game-container');

    if(!gameContainer) {
        console.error('Game container not found');
        return;
    }

    // Initialize the game here
    const gridCells: HTMLDivElement[][] = [];
    
    // Create the game grid
    for(let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        for(let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            row.appendChild(cell);

            gridCells[i] = gridCells[i] || [];
            gridCells[i][j] = cell;
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

    for(let i = 0; i < gridSize; i++) {
        const resultCell = document.createElement('div');
        resultCell.className = 'cell result-cell-bottom';

        row.appendChild(resultCell);
        gridCells[gridSize] = gridCells[gridSize] || [];
        gridCells[gridSize][i] = resultCell;
    }

    return gridCells;
}

function createNumbers(gameGrid: HTMLDivElement[][]): void {
    const GRID_SIZE = gameGrid.length - 1;
    
    // Define the results displayed along the y-axis
    const resultsPerRow: number[] = [];

    for(let i = 0; i < GRID_SIZE; i++)
        resultsPerRow.push(GRID_SIZE + Math.round(Math.random() * 20));

    // Define which numbers are correct
    const correctCells: boolean[][] = [];
    for(let row = 0; row < GRID_SIZE; row++) {
        // Define how many numbers are correct
        const correctCellsAmount = Math.ceil(Math.random() * GRID_SIZE);

        const indicesMap: number[] = [];
        for(let i = 0; i < GRID_SIZE; i++)
            indicesMap.push(i);
        
        // Shuffle the indices map
        indicesMap.sort(() => Math.random() - 0.5);
        
        // Fill the current row in the correctCells array
        correctCells[row] = [...Array(GRID_SIZE).keys()].map(() => false);

        for(let i = 0; i < GRID_SIZE; i++)
            correctCells[row][indicesMap[i]] = (i < correctCellsAmount);
        
        // Create the correct numbers
        const correctNumbers = splitNumber(resultsPerRow[row], correctCellsAmount, []);

        // Place the numbers at the correct place
        // Meaning correct numbers on correct cells, random numbers at wrong cells
        for(let column = 0; column < GRID_SIZE; column++) {
            gameGrid[row][column].innerText = (correctCells[row][column] ? correctNumbers.pop() || 0 : Math.ceil(Math.random() * GRID_SIZE)).toString();
            gameGrid[row][column].classList.add(correctCells[row][column] ? 'cell-correct' : 'cell-wrong');
        }

        // Place the results in the corresponding cell
        gameGrid[row][GRID_SIZE].innerText = resultsPerRow[row].toString();
    }

    // Define the results displayed along the x-axis
    const resultsPerColumn: number[] = [];

    for(let column = 0; column < GRID_SIZE; column++) {
        let columnSum = 0;

        for(let row = 0; row < GRID_SIZE; row++) {
            if(!correctCells[row][column])
                continue;

            columnSum += parseInt(gameGrid[row][column].innerText);
        }

        gameGrid[GRID_SIZE][column].innerText = columnSum.toString();
    }
}

function splitNumber(num: number, count: number, partsInput: number[] = []): number[] {
    const SPACEHOLDER_VALUE = -1;

    // List of parts in the input that are not placeholders
    const parts = partsInput.filter(part => part !== SPACEHOLDER_VALUE);

    // Calculate how many parts are missing
    const missingPartsCount = count - parts.length;
    // Calculate the number that is missing
    const partsSum = parts.reduce((accumulator, current) => accumulator + current, 0);
    const missingNumber = num - partsSum;

    // Check if a new number is even needed
    if(missingNumber == 0 || missingPartsCount == 0)
        return parts;

    // Check if the result is trivial, meaning only 1 more number is needed
    if(missingPartsCount == 1)
        return [...parts, missingNumber];

    // A new random number must be added to the parts array
    // The number must be at least 1, and low enough to allow missingPartsCount many numbers
    const nextNumber = 1 + Math.floor(Math.random() * (missingNumber - (missingPartsCount - 1)))

    // Return an array containing calculated parts and placeholders at the end
    const partsOutput: number[] = [];
    partsOutput.push(...parts, nextNumber);

    for(let i = partsOutput.length; i < count; i++)
        partsOutput.push(SPACEHOLDER_VALUE);

    return splitNumber(num, count, partsOutput);
}


const gameGrid = initializeGame(5);

if(gameGrid) {
    createNumbers(gameGrid);
}