# Plant Disease Detector

An AI-powered web application for detecting plant diseases from leaf images using state-of-the-art vision models. Built with React, FastAPI, and multimodal LLMs.

## Features

- **Real-time Analysis**: Upload a leaf photo and get instant disease detection
- **Multiple AI Providers**: Choose between OpenAI GPT-4 Vision and Anthropic Claude 3 Opus
- **Comprehensive Reports**: Detailed diagnosis including disease name, severity, confidence, symptoms, treatment, and prevention
- **Modern UI**: Visually appealing, responsive interface with drag-and-drop upload
- **RESTful API**: FastAPI backend with automatic OpenAPI documentation

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Axios for API communication

### Backend
- FastAPI (Python 3.10+)
- Pydantic for data validation
- OpenAI Python SDK
- Anthropic Python SDK
- Pillow for image processing
- python-magic for file validation

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- OpenAI API key (for GPT-4 Vision)
- Anthropic API key (for Claude 3 Opus)

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEFAULT_LLM_PROVIDER=openai
DEBUG=True
```

## Running the Application

### Development Mode

Start the backend (Terminal 1):
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Start the frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

Access the application at http://localhost:5173

### Production Build

Build the frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Endpoints

#### POST /api/v1/detect
Detect plant disease from uploaded image.

**Parameters:**
- `file` (multipart/form-data): Image file (JPEG, PNG, WebP, max 10MB)
- `provider` (form): `openai` or `anthropic` (default: openai)
- `include_treatment` (form): boolean (default: true)
- `include_prevention` (form): boolean (default: true)

**Response:**
```json
{
  "success": true,
  "disease": {
    "name": "Early Blight",
    "scientific_name": "Alternaria solani",
    "description": "A common fungal disease affecting tomatoes and potatoes...",
    "severity": "moderate",
    "confidence": 0.92,
    "affected_area": "Lower leaves, progressing upward",
    "symptoms": ["Dark brown spots with concentric rings", "Yellowing around spots"],
    "treatment": "Apply fungicide containing chlorothalonil...",
    "prevention": "Rotate crops, avoid overhead watering..."
  },
  "processing_time_ms": 2341.5
}
```

#### GET /api/v1/health
Health check endpoint.

#### GET /api/v1/providers
List available LLM providers.

## Project Structure

```
plant-disease-detector/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── core/
│   │   │   └── config.py          # Configuration settings
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic models
│   │   ├── services/
│   │   │   └── llm_vision.py      # LLM vision integration
│   │   ├── utils/
│   │   └── main.py                # FastAPI application
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   └── ResultDisplay.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docs/
└── README.md
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

Maximum file size: 10MB

## Disease Detection Capabilities

The application can identify various plant diseases including but not limited to:
- Early Blight
- Late Blight
- Powdery Mildew
- Leaf Spot
- Rust
- Mosaic Virus
- Bacterial Spot
- And many more

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Author

Created by kv-creates

## Acknowledgments

- OpenAI for GPT-4 Vision
- Anthropic for Claude 3 Opus
- PlantVillage dataset for reference
- All contributors and testers