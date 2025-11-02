# MatrixPy - Interactive Linear Algebra Calculator

A complete web application for performing linear algebra operations with an intuitive interface and real-time vector visualization.

![MatrixPy Interface](https://github.com/user-attachments/assets/99458ee3-2554-4beb-b1b3-42aa55154164)

## Features

### Vector Operations
- **Unit Vector Calculation (Normalization)**: Convert any vector to its unit vector
- **Angle Between Vectors**: Calculate the angle between two vectors using dot product
- **Orthogonality Check**: Verify if two vectors are perpendicular to each other
- **Parallelism Check**: Determine if two vectors are parallel using cross product
- **Linear Combinations**: Calculate linear combinations of multiple vectors with given coefficients

### Matrix Operations
- **Matrix Transpose**: Transpose any matrix
- **Matrix Multiplication**: Multiply two compatible matrices
- **System of Linear Equations Solver**: Solve systems of the form Ax = b

### Visualization
- **2D/3D Vector Visualization**: Interactive canvas-based visualization of vectors
- Supports both 2D and 3D vectors with automatic projection for 3D vectors
- Visual representation with color-coded arrows and labels

![Vector Visualization](https://github.com/user-attachments/assets/3094dbd1-7777-45c9-ba46-adb1cfbc1273)

## Technology Stack

### Backend
- **Python 3.12+**
- **Flask 3.0**: Web framework
- **NumPy 1.26**: Numerical computing
- **SciPy 1.11**: Scientific computing and linear algebra
- **SymPy 1.12**: Symbolic mathematics

### Frontend
- **HTML5/CSS3**: Modern, responsive interface
- **JavaScript (ES6+)**: Async API calls and dynamic rendering
- **Canvas API**: Custom 2D vector visualization
- **Plotly.js** (optional): Enhanced 3D visualization when available

## Installation

1. Clone the repository:
```bash
git clone https://github.com/zzruanxx/MatrixPy.git
cd MatrixPy
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## Usage

### Input Format
All inputs use JSON array notation:
- **Vectors**: `[1, 2, 3]` or `[x, y]`
- **Matrices**: `[[1, 2], [3, 4]]`
- **Lists of vectors**: `[[1, 2], [3, 4]]`

### Examples

#### Calculate Unit Vector
Input: `[3, 4]`
Result: `[0.6000, 0.8000]`

#### Angle Between Vectors
Vector 1: `[1, 0, 0]`
Vector 2: `[0, 1, 0]`
Result: `90.00°` (perpendicular vectors)

#### Solve Linear System
Matrix A: `[[2, 1], [1, 3]]`
Vector b: `[5, 7]`
Result: `x = [1.6000, 1.8000]`

#### Matrix Multiplication
Matrix 1: `[[1, 2], [3, 4]]`
Matrix 2: `[[5, 6], [7, 8]]`
Result: `[[19, 22], [43, 50]]`

## API Endpoints

All endpoints accept POST requests with JSON payloads:

- `POST /unit_vector` - Calculate unit vector
- `POST /angle_between` - Calculate angle between vectors
- `POST /orthogonality` - Check orthogonality
- `POST /parallelism` - Check parallelism
- `POST /linear_combination` - Calculate linear combination
- `POST /solve_system` - Solve linear system
- `POST /matrix_transpose` - Transpose matrix
- `POST /matrix_multiply` - Multiply matrices

## Features in Detail

### Vector Normalization
Converts any non-zero vector to a unit vector (magnitude = 1) while preserving direction.

### Angle Calculation
Uses the dot product formula: `θ = arccos(v1·v2 / (|v1||v2|))`
Returns angle in degrees.

### Orthogonality
Two vectors are orthogonal if their dot product equals zero (within numerical tolerance).

### Parallelism
Two vectors are parallel if their cross product equals zero (within numerical tolerance).

### Linear Systems
Solves systems using SciPy's efficient linear algebra routines with error handling for singular matrices.

## Development

The application follows a clean architecture:
- `app.py`: Flask backend with all API endpoints
- `templates/index.html`: Main HTML interface
- `static/css/style.css`: Responsive styling with gradient design
- `static/js/script.js`: Frontend logic and API integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
