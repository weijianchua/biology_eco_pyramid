let biomassChartInstance = null;
let abundanceChartInstance = null;

function generateEcosystem() {
    const speciesCount = parseInt(document.getElementById('speciesCount').value, 10);
    const biomassData = [];
    const abundanceData = [];

    for (let i = 1; i <= speciesCount; i++) {
        // Retrieve input values for abundance and biomass
        const abundanceInput = document.getElementById(`abundanceSpecies${i}`);
        const biomassInput = document.getElementById(`biomassSpecies${i}`);

        const abundance = abundanceInput ? parseInt(abundanceInput.value, 10) || 0 : 0;
        const biomass = biomassInput ? (parseInt(biomassInput.value, 10) || 0) * abundanceInput.value : 0;

        const speciesNameInput = document.getElementById(`speciesName${i}`);
        const speciesName = speciesNameInput ? speciesNameInput.value.trim() || `Species ${i}` : `Species ${i}`;

        biomassData.push({value: biomass, species: speciesName});
        abundanceData.push({value: abundance, species: speciesName});

    }

    // Update charts
    updateChart('pyramidOfBiomass', biomassData, 'Plot of Biomass',' Plot of Biomass (kg)','greenToRed');
    updateChart('pyramidOfAbundance', abundanceData, 'Plot of Abundance',' Plot of Abundance','redToGreen');
}


function updateChart(canvasId, data, label, chartTitle, colorRange) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const totalSpecies = data.length; // Total number of species

    // Determine the current chart instance based on canvasId
    let currentChartInstance = canvasId === 'pyramidOfBiomass' ? biomassChartInstance : abundanceChartInstance;

    // If a chart instance exists, destroy it
    if (currentChartInstance) {
        currentChartInstance.destroy();
    }

    // Generate colors based on species index, not their value
    const colors = data.map((_, index) => {
        // Calculate hue: starts from red (0) and goes towards green (120) based on species index
        const hue = (index / (totalSpecies - 1)) * 240; // Ensures the first is red and the last is green
        return `hsl(${hue}, 90%, 50%)`; // Full saturation and lightness at 50% for vibrant colors
    });

    // Create a new Chart instance
    const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.species),
            datasets: [{
                label: label,
                data: data.map(d => d.value),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: chartTitle,
                        color: 'black',
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        font: {
                            size: 16,
                            style: 'underline'
                        },
                    }
                }
            }
    });

    // Update the global reference to the new chart instance
    if (canvasId === 'pyramidOfBiomass') {
        biomassChartInstance = newChartInstance;
    } else {
        abundanceChartInstance = newChartInstance;
    }
}

// Function to move species up
function moveSpecies(i, direction, speciesCount) {
    // i is the current index, direction is -1 for up, 1 for down
    if ((direction === -1 && i > 1) || (direction === 1 && i < speciesCount)) {
        // Swap the species order
        [document.getElementById(`speciesName${i}`).value, document.getElementById(`speciesName${i + direction}`).value] =
        [document.getElementById(`speciesName${i + direction}`).value, document.getElementById(`speciesName${i}`).value];
        [document.getElementById(`abundanceSpecies${i}`).value, document.getElementById(`abundanceSpecies${i + direction}`).value] =
        [document.getElementById(`abundanceSpecies${i + direction}`).value, document.getElementById(`abundanceSpecies${i}`).value];
        [document.getElementById(`biomassSpecies${i}`).value, document.getElementById(`biomassSpecies${i + direction}`).value] =
        [document.getElementById(`biomassSpecies${i + direction}`).value, document.getElementById(`biomassSpecies${i}`).value];

        generateEcosystem(); // Update the ecosystem
    }
}

function validateSpeciesCount() {
    const speciesCountInput = document.getElementById('speciesCount');
    const container = document.getElementById('speciesDetailsContainer');
    const messageDiv = document.getElementById('speciesCountMessage');
    const speciesCount = parseInt(speciesCountInput.value, 10);

    // Validate species count and display messages
    if (speciesCount < 1) {
        messageDiv.textContent = "You need a minimum of 1 species";
        container.innerHTML = ''; // Clear previous inputs if the count is invalid
        return; // Exit the function if the count is invalid
    } else if (speciesCount > 5) {
        messageDiv.textContent = "Food chains tend to not exceed 5 species. Please select a value between 1 and 5.";
        // Optionally, clear inputs or keep them, depending on desired behavior
    } else {
        messageDiv.textContent = ""; // Clear message if input is valid
    }

    // Clear previous inputs before adding new ones
    container.innerHTML = '';

    for (let i = 1; i <= speciesCount; i++) {
        // Create and append abundance input
        const abundanceInput = document.createElement('input');
        abundanceInput.type = 'number';
        abundanceInput.id = `abundanceSpecies${i}`;
        abundanceInput.placeholder = `Abundance for S${i}`;
        abundanceInput.className = 'input-small';

        // Create and append biomass input
        const biomassInput = document.createElement('input');
        biomassInput.type = 'number';
        biomassInput.id = `biomassSpecies${i}`;
        biomassInput.placeholder = `Biomass for S${i} (kg)`;
        biomassInput.className = 'input-small';

        // Create and append species name input
        const speciesNameInput = document.createElement('input');
        speciesNameInput.type = 'text';
        speciesNameInput.id = `speciesName${i}`;
        speciesNameInput.placeholder = `Name of S${i}`;
        speciesNameInput.className = 'input-small';
        container.appendChild(document.createTextNode(`Species ${i}: `));
        container.appendChild(speciesNameInput);

        // Append inputs to the container
        container.appendChild(speciesNameInput);
        container.appendChild(abundanceInput);
        container.appendChild(biomassInput);

        // Move Up button
        const moveUpButton = document.createElement('button');
        moveUpButton.innerText = '↑';
        moveUpButton.onclick = function() { moveSpecies(i, -1, speciesCount); };
        container.appendChild(moveUpButton);

        // Move Down button
        const moveDownButton = document.createElement('button');
        moveDownButton.innerText = '↓';
        moveDownButton.onclick = function() { moveSpecies(i, 1, speciesCount); };
        container.appendChild(moveDownButton);

        container.appendChild(document.createElement('br')); // Line break for layout


    }
}

