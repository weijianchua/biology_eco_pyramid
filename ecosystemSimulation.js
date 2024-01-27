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

        biomassData.push({value: biomass, species: `Species ${i}`});
        abundanceData.push({value: abundance, species: `Species ${i}`});
    }

    // Update charts
    updateChart('pyramidOfBiomass', biomassData, 'Pyramid of Biomass', 'greenToRed');
    updateChart('pyramidOfAbundance', abundanceData, 'Pyramid of Abundance', 'redToGreen');
}


function updateChart(canvasId, data, label, colorRange) {
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
        const hue = (index / (totalSpecies - 1)) * 120; // Ensures the first is red and the last is green
        return `hsl(${hue}, 100%, 50%)`; // Full saturation and lightness at 50% for vibrant colors
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


function validateSpeciesCount() {
    const speciesCountInput = document.getElementById('speciesCount');
    const container = document.getElementById('speciesDetailsContainer');
    const messageDiv = document.getElementById('speciesCountMessage'); // Ensure this div exists in your HTML
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

        // Append inputs to the container
        container.appendChild(document.createTextNode(`Species ${i}: `));
        container.appendChild(abundanceInput);
        container.appendChild(biomassInput);
        container.appendChild(document.createElement('br')); // Line break for layout
    }
}

