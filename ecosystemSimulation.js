function generateEcosystem() {
    const speciesCount = document.getElementById('speciesCount').value;
    const biomassData = [];
    const abundanceData = [];

    for (let i = 1; i <= speciesCount; i++) {
        // Random biomass and abundance for simplicity
        const biomass = Math.floor(Math.random() * 1000) + 100 * i; // Biomass increases with each trophic level
        const abundance = Math.floor(Math.random() * 100) + 10 * i; // Abundance decreases with each trophic level

        biomassData.push(biomass);
        abundanceData.push(abundance);
    }

    updateChart('pyramidOfBiomass', biomassData, 'Pyramid of Biomass');
    updateChart('pyramidOfAbundance', abundanceData, 'Pyramid of Abundance');
}

function updateChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = data.map((_, index) => `Species ${index + 1}`);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
}
