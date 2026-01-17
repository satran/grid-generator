document.getElementById('grid-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const spacing = parseFloat(document.getElementById('spacing').value);
    const paperSize = document.getElementById('paper-size').value;
    const gridColor = document.getElementById('grid-color').value;
    const gridSize = parseFloat(document.getElementById('grid-size').value);

    const paperSizes = {
        "A3": [297, 420],
        "A4": [210, 297],
        "A5": [148, 210],
        "A6": [105, 148],
        "B5": [176, 250],
        "B6": [125, 176],
    };

    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize.toLowerCase()
    });

    const width = paperSizes[paperSize][0];
    const height = paperSizes[paperSize][1];
    const padding = spacing;

    doc.setDrawColor(gridColor);
    doc.setTextColor(gridColor);

    if (type === 'dotted') {
        drawDotted(doc, width, height, spacing, gridColor, gridSize);
    } else if (type === 'grid') {
        drawGrid(doc, width, height, spacing, gridColor, gridSize);
    } else if (type === 'lined') {
        drawLined(doc, width, height, spacing, gridColor, gridSize);
    }

    // Analytics
    gtag('event', 'gridType', type);
    gtag('event', 'gridSpacing', spacing);
    gtag('event', 'paper', paperSize);
    gtag('event', 'gridColor', gridColor);
    gtag('event', 'gridSize', gridSize);

    doc.save(`${type}_${paperSize}_${spacing}mm.pdf`);
});

function drawDotted(doc, width, height, spacing, color, size) {
    doc.setFillColor(color);
    const radius = size / 2;
    for (let x = spacing; x <= width - spacing; x += spacing) {
        for (let y = spacing; y <= height - spacing; y += spacing) {
            doc.circle(x, y, radius, 'F');
        }
    }
}

function drawGrid(doc, width, height, spacing, color, size) {
    // This is to ensure the grids are within the boundary 
    // of the first horizontal line and the last vertical line.
    let vertGrids = Math.floor(height / spacing);
    let horGrids = Math.floor(width / spacing);
    height = (spacing * vertGrids);
    width = (spacing * horGrids);

    doc.setLineWidth(size);
    doc.setDrawColor(color);
    for (let x = spacing; x <= width - spacing; x += spacing) {
        doc.line(x, spacing, x, height - spacing);
    }
    for (let y = spacing; y <= height - spacing; y += spacing) {
        doc.line(spacing, y, width - spacing, y);
    }
}

function drawLined(doc, width, height, spacing, color, size) {
    doc.setLineWidth(size);
    doc.setDrawColor(color);
    for (let y = spacing; y <= height - spacing; y += spacing) {
        doc.line(spacing, y, width - spacing, y);
    }
}