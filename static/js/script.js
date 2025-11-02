// Helper function to parse vector/matrix input
function parseInput(input) {
    try {
        return JSON.parse(input);
    } catch (e) {
        showResult('Error: Invalid input format. Use JSON format like [1,2,3] or [[1,2],[3,4]]');
        return null;
    }
}

// Helper function to display results
function showResult(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous content
    
    const strongEl = document.createElement('strong');
    strongEl.textContent = 'Result';
    
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    
    resultDiv.appendChild(strongEl);
    resultDiv.appendChild(messageEl);
    
    // Scroll to result smoothly
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Helper function to show loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Processing...';
    } else {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// Calculate Unit Vector
async function calculateUnitVector() {
    const vectorInput = document.getElementById('vectorInput').value;
    const vector = parseInput(vectorInput);
    if (!vector) return;

    const button = event.target;
    setButtonLoading(button, true);

    try {
        const response = await fetch('/unit_vector', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vector: vector })
        });
        const data = await response.json();
        if (data.error) {
            showResult('Error: ' + data.error);
        } else {
            showResult('Unit Vector: [' + data.unit_vector.map(v => v.toFixed(4)).join(', ') + ']');
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

// Calculate Angle Between Vectors
async function calculateAngle() {
    const v1 = parseInput(document.getElementById('v1Input').value);
    const v2 = parseInput(document.getElementById('v2Input').value);
    if (!v1 || !v2) return;

    try {
        const response = await fetch('/angle_between', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1: v1, v2: v2 })
        });
        const data = await response.json();
        if (data.error) {
            showResult('Error: ' + data.error);
        } else {
            showResult('Angle: ' + data.angle.toFixed(2) + '° (degrees)');
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Check Orthogonality
async function checkOrthogonality() {
    const v1 = parseInput(document.getElementById('orthV1').value);
    const v2 = parseInput(document.getElementById('orthV2').value);
    if (!v1 || !v2) return;

    try {
        const response = await fetch('/orthogonality', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1: v1, v2: v2 })
        });
        const data = await response.json();
        const result = data.orthogonal ? 'Yes, vectors are orthogonal' : 'No, vectors are not orthogonal';
        showResult(result + ' (dot product: ' + data.dot_product.toFixed(4) + ')');
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Check Parallelism
async function checkParallelism() {
    const v1 = parseInput(document.getElementById('parV1').value);
    const v2 = parseInput(document.getElementById('parV2').value);
    if (!v1 || !v2) return;

    try {
        const response = await fetch('/parallelism', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1: v1, v2: v2 })
        });
        const data = await response.json();
        const result = data.parallel ? 'Yes, vectors are parallel' : 'No, vectors are not parallel';
        showResult(result + ' (cross product: [' + data.cross_product.map(v => v.toFixed(4)).join(', ') + '])');
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Calculate Linear Combination
async function calculateLinearCombination() {
    const vectors = parseInput(document.getElementById('vectorsInput').value);
    const coefficients = parseInput(document.getElementById('coeffInput').value);
    if (!vectors || !coefficients) return;

    try {
        const response = await fetch('/linear_combination', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vectors: vectors, coefficients: coefficients })
        });
        const data = await response.json();
        showResult('Linear Combination: [' + data.result.map(v => v.toFixed(4)).join(', ') + ']');
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Solve System
async function solveSystem() {
    const A = parseInput(document.getElementById('AInput').value);
    const b = parseInput(document.getElementById('bInput').value);
    if (!A || !b) return;

    try {
        const response = await fetch('/solve_system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ A: A, b: b })
        });
        const data = await response.json();
        if (data.error) {
            showResult('Error: ' + data.error);
        } else {
            showResult('Solution x: [' + data.solution.map(v => v.toFixed(4)).join(', ') + ']');
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Transpose Matrix
async function transposeMatrix() {
    const matrix = parseInput(document.getElementById('matrixInput').value);
    if (!matrix) return;

    try {
        const response = await fetch('/matrix_transpose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matrix: matrix })
        });
        const data = await response.json();
        showResult('Transpose: ' + JSON.stringify(data.transpose));
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Multiply Matrices
async function multiplyMatrices() {
    const m1 = parseInput(document.getElementById('m1Input').value);
    const m2 = parseInput(document.getElementById('m2Input').value);
    if (!m1 || !m2) return;

    try {
        const response = await fetch('/matrix_multiply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ m1: m1, m2: m2 })
        });
        const data = await response.json();
        if (data.error) {
            showResult('Error: ' + data.error);
        } else {
            showResult('Product: ' + JSON.stringify(data.product));
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

// Visualize Vectors in 3D
function visualizeVectors() {
    const v1Input = document.getElementById('visV1').value;
    const v2Input = document.getElementById('visV2').value;
    
    const v1 = parseInput(v1Input);
    if (!v1) return;

    // Check if Plotly is available
    if (typeof Plotly === 'undefined') {
        // Fallback to simple canvas-based visualization
        visualizeVectorsCanvas(v1, v2Input);
        return;
    }

    // Prepare data for Plotly
    let traces = [];

    // Add first vector
    traces.push({
        type: 'scatter3d',
        mode: 'lines+markers',
        x: [0, v1[0]],
        y: [0, v1[1] || 0],
        z: [0, v1[2] || 0],
        line: { color: 'red', width: 6 },
        marker: { size: 8, color: 'red' },
        name: 'Vector 1'
    });

    // Add second vector if provided
    if (v2Input.trim() !== '') {
        const v2 = parseInput(v2Input);
        if (v2) {
            traces.push({
                type: 'scatter3d',
                mode: 'lines+markers',
                x: [0, v2[0]],
                y: [0, v2[1] || 0],
                z: [0, v2[2] || 0],
                line: { color: 'blue', width: 6 },
                marker: { size: 8, color: 'blue' },
                name: 'Vector 2'
            });
        }
    }

    // Layout settings
    const layout = {
        title: 'Vector Visualization',
        scene: {
            xaxis: { title: 'X', range: [-10, 10] },
            yaxis: { title: 'Y', range: [-10, 10] },
            zaxis: { title: 'Z', range: [-10, 10] },
            aspectmode: 'cube'
        },
        showlegend: true
    };

    // Plot
    Plotly.newPlot('canvas', traces, layout);
}

// Canvas-based fallback visualization for 2D/3D vectors
function visualizeVectorsCanvas(v1, v2Input) {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Clear previous content
    
    // Create a canvas element
    const canvasEl = document.createElement('canvas');
    canvasEl.width = canvas.offsetWidth || 800;
    canvasEl.height = 500;
    canvas.appendChild(canvasEl);
    
    const ctx = canvasEl.getContext('2d');
    const centerX = canvasEl.width / 2;
    const centerY = canvasEl.height / 2;
    const scale = 30; // Scale factor for visualization
    
    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvasEl.height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(canvasEl.width, centerY + i * scale);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasEl.width, centerY);
    ctx.stroke();
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasEl.height);
    ctx.stroke();
    
    // Draw vector 1
    drawVector(ctx, centerX, centerY, v1[0] * scale, -(v1[1] || 0) * scale, 'red', 'V1');
    
    // Draw vector 2 if provided
    if (v2Input.trim() !== '') {
        const v2 = parseInput(v2Input);
        if (v2) {
            drawVector(ctx, centerX, centerY, v2[0] * scale, -(v2[1] || 0) * scale, 'blue', 'V2');
        }
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('X', canvasEl.width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);
    
    // Show result message for 3D vectors
    const v2 = v2Input.trim() !== '' ? parseInput(v2Input) : null;
    if (v1.length > 2 || (v2 && v2.length > 2)) {
        showResult('2D projection shown. Z-components: V1[' + (v1[2] || 0) + '], V2[' + 
                   (v2 ? (v2[2] || 0) : 0) + ']');
    } else {
        showResult('Vector visualization completed');
    }
}

// Helper function to draw an arrow (vector)
function drawVector(ctx, startX, startY, dx, dy, color, label) {
    const endX = startX + dx;
    const endY = startY + dy;
    
    // Draw line
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(dy, dx);
    const arrowLength = 15;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(label, endX + 10, endY - 10);
}
