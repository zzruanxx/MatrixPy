from flask import Flask, request, jsonify, render_template
import numpy as np
import scipy.linalg
import sympy
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/unit_vector', methods=['POST'])
def unit_vector():
    data = request.get_json()
    vector = np.array(data['vector'])
    norm = np.linalg.norm(vector)
    if norm == 0:
        return jsonify({'error': 'Cannot normalize zero vector'})
    unit = vector / norm
    return jsonify({'unit_vector': unit.tolist()})

@app.route('/angle_between', methods=['POST'])
def angle_between():
    data = request.get_json()
    v1 = np.array(data['v1'])
    v2 = np.array(data['v2'])
    dot = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return jsonify({'error': 'Cannot compute angle with zero vector'})
    cos_theta = dot / (norm1 * norm2)
    theta = math.acos(np.clip(cos_theta, -1, 1))
    return jsonify({'angle': math.degrees(theta)})

@app.route('/orthogonality', methods=['POST'])
def orthogonality():
    data = request.get_json()
    v1 = np.array(data['v1'])
    v2 = np.array(data['v2'])
    dot = np.dot(v1, v2)
    is_orthogonal = np.isclose(dot, 0)
    return jsonify({'orthogonal': bool(is_orthogonal), 'dot_product': float(dot)})

@app.route('/parallelism', methods=['POST'])
def parallelism():
    data = request.get_json()
    v1 = np.array(data['v1'])
    v2 = np.array(data['v2'])
    cross = np.cross(v1, v2)
    is_parallel = np.isclose(np.linalg.norm(cross), 0)
    return jsonify({'parallel': bool(is_parallel), 'cross_product': cross.tolist()})

@app.route('/linear_combination', methods=['POST'])
def linear_combination():
    data = request.get_json()
    vectors = [np.array(v) for v in data['vectors']]
    coefficients = np.array(data['coefficients'])
    result = sum(c * v for c, v in zip(coefficients, vectors))
    return jsonify({'result': result.tolist()})

@app.route('/solve_system', methods=['POST'])
def solve_system():
    data = request.get_json()
    A = np.array(data['A'])
    b = np.array(data['b'])
    try:
        x = scipy.linalg.solve(A, b)
        return jsonify({'solution': x.tolist()})
    except np.linalg.LinAlgError:
        return jsonify({'error': 'System has no unique solution'})

@app.route('/matrix_transpose', methods=['POST'])
def matrix_transpose():
    data = request.get_json()
    matrix = np.array(data['matrix'])
    transpose = matrix.T
    return jsonify({'transpose': transpose.tolist()})

@app.route('/matrix_multiply', methods=['POST'])
def matrix_multiply():
    data = request.get_json()
    m1 = np.array(data['m1'])
    m2 = np.array(data['m2'])
    if m1.shape[1] != m2.shape[0]:
        return jsonify({'error': 'Matrices not compatible for multiplication'})
    product = np.dot(m1, m2)
    return jsonify({'product': product.tolist()})

if __name__ == '__main__':
    app.run(debug=True)