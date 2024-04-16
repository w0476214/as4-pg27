document.addEventListener('DOMContentLoaded', () => {
    // Define the base URL for the API call
    const baseUrl = 'https://prog2700.onrender.com/threeinarow/sample';
    // Fetch data from the API
    fetch(baseUrl)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => initializePuzzle(data)); // Initialize the puzzle with the fetched data

    // Function to initialize the puzzle
    const initializePuzzle = data => {
        // Create the game board using the data
        const board = createBoard(data);
        // Create the game controls
        const controls = createControls();
        // Append the board and controls to the game container
        document.getElementById('theGame').append(board, controls.statusMessage, controls.checkButton, controls.errorCheckbox, controls.errorLabel);
    };

    // Function to create the game board
    const createBoard = ({ rows }) => {
        // Create a table element
        const table = document.createElement('table');
        // Iterate over each row of data
        rows.forEach((row) => {
            // Create a table row element
            const tableRow = document.createElement('tr');
            // Iterate over each cell in the row
            row.forEach((cell) => {
                // Create a table cell element
                const tableCell = createTableCell(cell);
                // Append the cell to the row
                tableRow.appendChild(tableCell);
            });
            // Append the row to the table
            table.appendChild(tableRow);
        });
        return table;
    };

    // Function to create a table cell
    const createTableCell = (cell) => {
        // Create a table cell element
        const cellElement = document.createElement('td');
        cellElement.className = 'cell'; // Assign class for styling
        // Store the cell's data in attributes
        cellElement.dataset.state = cell.currentState;
        cellElement.dataset.correctState = cell.correctState;
        cellElement.dataset.canToggle = cell.canToggle;
        renderCell(cellElement); // Apply initial coloring based on the cell's state
        // If the cell can be toggled, add a click event listener
        if (cell.canToggle) {
            cellElement.addEventListener('click', () => toggleCell(cellElement));
        }
        return cellElement; // Return the created cell element
    };

    // Function to toggle the cell's state
    const toggleCell = (cell) => {
        // Check if the cell is meant to be toggleable
        if (cell.dataset.canToggle === "true") {
            // Cycle through the states (0, 1, 2)
            cell.dataset.state = (parseInt(cell.dataset.state) + 1) % 3;
            renderCell(cell); // Re-render the cell with the new state
            // Clear any status message and highlighting
            clearStatusMessage();
            clearHighlight();
            // Highlight the last clicked cell
            highlightLastClicked(cell);
        }
    };

    // Function to apply coloring to a cell
    const renderCell = (cell) => {
        // Define colors corresponding to each state
        const colors = ['#aaaaaa', '#0000ff', '#ffffff'];
        // Set the background color based on the cell's state
        cell.style.backgroundColor = colors[cell.dataset.state];
    };

    // Function to create game control elements
    const createControls = () => {
        // Create a div to display the puzzle status message
        const statusMessage = document.createElement('div');
        statusMessage.id = 'statusMessage';
        
        // Create a button to check the puzzle
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Check Puzzle';
        checkButton.addEventListener('click', () => checkPuzzle());

        // Create a checkbox for showing incorrect cells
        const errorCheckbox = document.createElement('input');
        errorCheckbox.type = 'checkbox';
        errorCheckbox.id = 'errorCheckbox';
        errorCheckbox.addEventListener('change', (event) => showErrors(event.target.checked));
        
        // Create a label for the error display checkbox
        const errorLabel = document.createElement('label');
        errorLabel.htmlFor = 'errorCheckbox';
        errorLabel.textContent = ' Show incorrect squares';
        
        // Return the control elements
        return { statusMessage, checkButton, errorCheckbox, errorLabel };
    };

    // Function to check the puzzle status
    const checkPuzzle = () => {
        // Collect all cell elements
        const cells = Array.from(document.querySelectorAll('.cell'));
        // Check if all cells are in the correct state
        const isComplete = cells.every(cell => cell.dataset.state === cell.dataset.correctState);
        // Check if all toggleable cells are in the correct state
        const isCorrect = cells.filter(cell => cell.dataset.canToggle === "true").every(cell => cell.dataset.state === cell.dataset.correctState);
        
        // Update the status message based on puzzle state
        const statusMessage = document.getElementById('statusMessage');
        if (isComplete) {
            statusMessage.textContent = 'Completed!!';
            statusMessage.style.color = 'green';
        } else if (isCorrect) {
            statusMessage.textContent = 'So far so good!';
            statusMessage.style.color = 'blue';
        } else {
            statusMessage.textContent = 'Something is wrong!';
            statusMessage.style.color = 'red';
        }
    };

    // Function to display incorrect cells
    const showErrors = (shouldShow) => {
        // Collect all cell elements
        const cells = document.querySelectorAll('.cell');
        // Add or remove the 'error' class based on correctness
        cells.forEach(cell => {
            const isCorrectState = cell.dataset.state === cell.dataset.correctState;
            if (cell.dataset.canToggle === "true" && !isCorrectState) {
                if (shouldShow) {
                    cell.classList.add('error');
                } else {
                    cell.classList.remove('error');
                }
            }
        });
    };

    // Function to clear any status messages
    const clearStatusMessage = () => {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = '';
    };

    // Function to clear highlights from all cells
    const clearHighlight = () => {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('highlight'));
    };

    // Function to highlight the last clicked cell
    const highlightLastClicked = (cell) => {
        clearHighlight();
        cell.classList.add('highlight');
    };
});
