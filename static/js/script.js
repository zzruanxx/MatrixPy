// ===== Toast Notifications =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconName = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'toast-icon';
    iconDiv.innerHTML = `<i class="fas ${iconName}"></i>`;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'toast-message';
    msgDiv.textContent = message;

    toast.appendChild(iconDiv);
    toast.appendChild(msgDiv);
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
}

// ===== Helper: Parse Input =====
function parseInput(input) {
    if (!input || input.trim() === '') {
        showResult('Please fill in all required fields.', true);
        return null;
    }
    try {
        return JSON.parse(input);
    } catch (e) {
        showResult('Invalid input format. Please use JSON format like [1,2,3] or [[1,2],[3,4]]', true);
        return null;
    }
}

// ===== Helper: Validate required inputs and highlight empty ones =====
function validateRequired(section, ...inputIds) {
    let valid = true;
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.value.trim() === '') {
            if (el) {
                el.classList.add('input-error');
                setTimeout(() => el.classList.remove('input-error'), 1000);
            }
            valid = false;
        }
    });
    if (!valid) {
        showToast('Please fill in all required fields.', 'error');
    }
    return valid;
}

// ===== Helper: Display Results =====
function showResult(message, isError = false) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('success', 'error');
    resultDiv.classList.add(isError ? 'error' : 'success');

    const iconName = isError ? 'fa-times-circle' : 'fa-check-circle';
    const label = isError ? 'Error' : 'Result';

    const inner = document.createElement('div');
    inner.className = 'result-inner';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'result-icon';
    iconDiv.innerHTML = `<i class="fas ${iconName}"></i>`;

    const body = document.createElement('div');
    body.className = 'result-body';

    const strong = document.createElement('strong');
    strong.textContent = label;

    const value = document.createElement('div');
    value.className = 'result-value';
    value.textContent = message;

    body.appendChild(strong);
    body.appendChild(value);
    inner.appendChild(iconDiv);
    inner.appendChild(body);
    resultDiv.appendChild(inner);

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const truncated = message.length > 80 ? message.substring(0, 80) + '…' : message;
    showToast(truncated, isError ? 'error' : 'success');
}

// ===== Helper: Button Loading State =====
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalHtml = button.innerHTML;
        button.classList.add('btn-loading');
        button.innerHTML = '<span class="btn-spinner"></span> Processing…';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        if (button.dataset.originalHtml) {
            button.innerHTML = button.dataset.originalHtml;
        }
    }
}

// ===== Calculate Unit Vector =====
async function calculateUnitVector(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'vectorInput')) return;
    const vector = parseInput(document.getElementById('vectorInput').value);
    if (!vector) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/unit_vector', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vector })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Unit Vector: [' + data.unit_vector.map(v => v.toFixed(4)).join(', ') + ']');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Calculate Angle =====
async function calculateAngle(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'v1Input', 'v2Input')) return;
    const v1 = parseInput(document.getElementById('v1Input').value);
    const v2 = parseInput(document.getElementById('v2Input').value);
    if (!v1 || !v2) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/angle_between', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1, v2 })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Angle: ' + data.angle.toFixed(2) + '° (degrees)');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Check Orthogonality =====
async function checkOrthogonality(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'orthV1', 'orthV2')) return;
    const v1 = parseInput(document.getElementById('orthV1').value);
    const v2 = parseInput(document.getElementById('orthV2').value);
    if (!v1 || !v2) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/orthogonality', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1, v2 })
        });
        const data = await response.json();
        const result = data.orthogonal ? '✓ Yes, vectors are orthogonal' : '✗ No, vectors are not orthogonal';
        showResult(result + ' (dot product: ' + data.dot_product.toFixed(4) + ')');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Check Parallelism =====
async function checkParallelism(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'parV1', 'parV2')) return;
    const v1 = parseInput(document.getElementById('parV1').value);
    const v2 = parseInput(document.getElementById('parV2').value);
    if (!v1 || !v2) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/parallelism', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ v1, v2 })
        });
        const data = await response.json();
        const result = data.parallel ? '✓ Yes, vectors are parallel' : '✗ No, vectors are not parallel';
        showResult(result + ' (cross product: [' + data.cross_product.map(v => v.toFixed(4)).join(', ') + '])');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Calculate Linear Combination =====
async function calculateLinearCombination(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'vectorsInput', 'coeffInput')) return;
    const vectors = parseInput(document.getElementById('vectorsInput').value);
    const coefficients = parseInput(document.getElementById('coeffInput').value);
    if (!vectors || !coefficients) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/linear_combination', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vectors, coefficients })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Linear Combination: [' + data.result.map(v => v.toFixed(4)).join(', ') + ']');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Solve System =====
async function solveSystem(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'AInput', 'bInput')) return;
    const A = parseInput(document.getElementById('AInput').value);
    const b = parseInput(document.getElementById('bInput').value);
    if (!A || !b) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/solve_system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ A, b })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Solution x: [' + data.solution.map(v => v.toFixed(4)).join(', ') + ']');
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Transpose Matrix =====
async function transposeMatrix(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'matrixInput')) return;
    const matrix = parseInput(document.getElementById('matrixInput').value);
    if (!matrix) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/matrix_transpose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matrix })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Transpose: ' + JSON.stringify(data.transpose));
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Multiply Matrices =====
async function multiplyMatrices(e) {
    const button = e.target.closest('button');
    if (!validateRequired(null, 'm1Input', 'm2Input')) return;
    const m1 = parseInput(document.getElementById('m1Input').value);
    const m2 = parseInput(document.getElementById('m2Input').value);
    if (!m1 || !m2) return;

    setButtonLoading(button, true);
    try {
        const response = await fetch('/matrix_multiply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ m1, m2 })
        });
        const data = await response.json();
        if (data.error) showResult(data.error, true);
        else showResult('Product: ' + JSON.stringify(data.product));
    } catch (error) {
        showResult('Connection error: ' + error.message, true);
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== Visualize Vectors =====
function visualizeVectors(e) {
    if (!validateRequired(null, 'visV1')) return;
    const v1Input = document.getElementById('visV1').value;
    const v2Input = document.getElementById('visV2').value;
    const v1 = parseInput(v1Input);
    if (!v1) return;

    if (typeof Plotly === 'undefined') {
        visualizeVectorsCanvas(v1, v2Input);
        return;
    }

    let traces = [];
    traces.push({
        type: 'scatter3d',
        mode: 'lines+markers',
        x: [0, v1[0]],
        y: [0, v1[1] || 0],
        z: [0, v1[2] || 0],
        line: { color: '#667eea', width: 6 },
        marker: { size: 8, color: '#667eea' },
        name: 'Vector 1'
    });

    if (v2Input && v2Input.trim() !== '') {
        const v2 = parseInput(v2Input);
        if (v2) {
            traces.push({
                type: 'scatter3d',
                mode: 'lines+markers',
                x: [0, v2[0]],
                y: [0, v2[1] || 0],
                z: [0, v2[2] || 0],
                line: { color: '#764ba2', width: 6 },
                marker: { size: 8, color: '#764ba2' },
                name: 'Vector 2'
            });
        }
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const layout = {
        title: { text: 'Vector Visualization', font: { color: isDark ? '#f1f5f9' : '#1e293b' } },
        paper_bgcolor: isDark ? '#1e293b' : '#ffffff',
        plot_bgcolor: isDark ? '#1e293b' : '#ffffff',
        scene: {
            xaxis: { title: 'X', range: [-10, 10], color: isDark ? '#94a3b8' : '#64748b' },
            yaxis: { title: 'Y', range: [-10, 10], color: isDark ? '#94a3b8' : '#64748b' },
            zaxis: { title: 'Z', range: [-10, 10], color: isDark ? '#94a3b8' : '#64748b' },
            aspectmode: 'cube'
        },
        showlegend: true,
        legend: { font: { color: isDark ? '#f1f5f9' : '#1e293b' } },
        margin: { t: 40, b: 20, l: 20, r: 20 }
    };

    Plotly.newPlot('canvas', traces, layout, { responsive: true });
    showResult('Vector visualization rendered successfully');
}

function visualizeVectorsCanvas(v1, v2Input) {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    const canvasEl = document.createElement('canvas');
    canvasEl.width = canvas.offsetWidth || 800;
    canvasEl.height = 500;
    canvas.appendChild(canvasEl);

    const ctx = canvasEl.getContext('2d');
    const centerX = canvasEl.width / 2;
    const centerY = canvasEl.height / 2;
    const scale = 30;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    ctx.fillStyle = isDark ? '#1e293b' : '#fafafa';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(centerX + i * scale, 0); ctx.lineTo(centerX + i * scale, canvasEl.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, centerY + i * scale); ctx.lineTo(canvasEl.width, centerY + i * scale); ctx.stroke();
    }

    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(canvasEl.width, centerY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvasEl.height); ctx.stroke();

    drawVector(ctx, centerX, centerY, v1[0] * scale, -(v1[1] || 0) * scale, '#667eea', 'V1');

    if (v2Input && v2Input.trim() !== '') {
        const v2 = parseInput(v2Input);
        if (v2) drawVector(ctx, centerX, centerY, v2[0] * scale, -(v2[1] || 0) * scale, '#764ba2', 'V2');
    }

    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('X', canvasEl.width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);

    showResult('Vector visualization completed');
}

function drawVector(ctx, startX, startY, dx, dy, color, label) {
    const endX = startX + dx;
    const endY = startY + dy;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    const angle = Math.atan2(dy, dx);
    const arrowLength = 15;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText(label, endX + 10, endY - 10);
}

// ===== Clear Section =====
function clearSection(sectionElement) {
    const inputs = sectionElement.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('input-error');
    });
    const canvas = sectionElement.querySelector('#canvas');
    if (canvas) {
        canvas.innerHTML = `
            <div class="canvas-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>Enter a vector above and click Visualize</p>
            </div>
        `;
    }
    showToast('Section cleared', 'success');
}

// ===== Dark Mode =====
function initTheme() {
    const saved = localStorage.getItem('matrixpy-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('matrixpy-theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ===== Scroll Spy =====
function initScrollSpy() {
    const sections = document.querySelectorAll('.operation-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ===== Section Reveal =====
function initRevealAnimations() {
    const sections = document.querySelectorAll('.operation-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(section => observer.observe(section));
}

// ===== Scroll Top =====
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Navbar Scroll =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

// ===== Hamburger =====
function initHamburger() {
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
        }
    });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollSpy();
    initRevealAnimations();
    initScrollTop();
    initNavbarScroll();
    initHamburger();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // Enter key to submit
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const section = input.closest('.operation-section');
                if (section) {
                    const button = section.querySelector('.btn-primary');
                    if (button) button.click();
                }
            }
        });
        // Remove error class on input
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });
});
