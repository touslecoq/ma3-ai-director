# GrandMA3 AI Director - Installation Guide

This guide will walk you through setting up the development environment and installing all dependencies for the GrandMA3 AI Director application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### macOS

1. **Homebrew** (Package manager)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Node.js** (v20 or higher)
   ```bash
   brew install node
   ```

3. **Python** (3.10 or higher)
   ```bash
   brew install python@3.10
   ```

4. **FFmpeg** (For video processing)
   ```bash
   brew install ffmpeg
   ```

5. **PortAudio** (For audio I/O)
   ```bash
   brew install portaudio
   ```

### Windows

1. **Node.js** (v20 or higher)
   - Download from https://nodejs.org/
   - Run installer and follow prompts

2. **Python** (3.10 or higher)
   - Download from https://python.org/
   - **Important:** Check "Add Python to PATH" during installation

3. **FFmpeg**
   - Download from https://ffmpeg.org/download.html
   - Extract and add to system PATH

4. **Visual C++ Build Tools** (Required for some Python packages)
   - Download from https://visualstudio.microsoft.com/visual-cpp-build-tools/

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd ~/Desktop/grandma3-ai-director
```

### 2. Install Root Dependencies

```bash
npm install
```

This installs:
- Electron
- Electron Builder
- Concurrently (for running multiple processes)

### 3. Install Electron App Dependencies

```bash
cd electron-app
npm install
cd ..
```

This installs:
- React and React DOM
- TypeScript
- Vite (build tool)
- Electron-specific dependencies

### 4. Create Python Virtual Environment

It's recommended to use a virtual environment for Python dependencies:

```bash
cd ai-engine
python3 -m venv venv
```

Activate the virtual environment:

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 5. Install Python Dependencies

With the virtual environment activated:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Audio analysis libraries (librosa, aubio, sounddevice)
- Video processing (OpenCV, moviepy)
- Machine learning (PyTorch, transformers)
- LLM integration (LangChain, OpenAI, Anthropic)
- Vector database (ChromaDB)
- And more...

**Note:** This may take 10-20 minutes depending on your internet connection and system.

### 6. Configuration

#### Create AI Engine Configuration

Create a configuration file at `ai-engine/.env`:

```bash
cd ai-engine
touch .env
```

Edit `.env` with your preferred text editor and add:

```env
# OpenAI API Key (for LLM features)
OPENAI_API_KEY=your-api-key-here

# Or use Anthropic Claude
ANTHROPIC_API_KEY=your-api-key-here

# GrandMA3 Default Connection
MA3_DEFAULT_HOST=192.168.1.50
MA3_DEFAULT_PORT=30000

# Audio Settings
DEFAULT_SAMPLE_RATE=44100
DEFAULT_BUFFER_SIZE=512

# Development
DEBUG=true
LOG_LEVEL=info
```

#### Create AI Engine Config File

Create `ai-engine/config.yaml`:

```yaml
ma3:
  host: "192.168.1.50"
  port: 30000
  protocol: "telnet"
  timeout: 5

audio:
  input_device: "default"
  sample_rate: 44100
  buffer_size: 512
  channels: 2

tempo_tracking:
  smoothing_window: 4
  confidence_threshold: 0.7
  max_deviation_per_update: 5
  deviation_tolerance: 15

ai:
  llm_provider: "openai"
  model: "gpt-4"
  temperature: 0.7
  max_tokens: 2000

vector_db:
  path: "./chroma_db"
  collection_name: "lighting_looks"
```

## Verification

### Test Python Backend

```bash
cd ai-engine
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Open http://127.0.0.1:8000/docs in your browser to see the API documentation.

Press `Ctrl+C` to stop the server.

### Test Electron App

```bash
cd electron-app
npm run dev
```

The Electron window should open after a few seconds.

## Troubleshooting

### Python Installation Issues

**Issue:** `pip install` fails with compilation errors

**Solution (macOS):**
```bash
brew install portaudio
export CFLAGS="-I/opt/homebrew/include"
export LDFLAGS="-L/opt/homebrew/lib"
pip install --no-cache-dir -r requirements.txt
```

**Solution (Windows):**
- Ensure Visual C++ Build Tools are installed
- Try installing problematic packages individually

### Audio Device Issues

**Issue:** Can't find audio input device

**Solution:**
```bash
# List available devices
python -c "import sounddevice as sd; print(sd.query_devices())"
```

Update `config.yaml` with the correct device name or index.

### FFmpeg Not Found

**Issue:** Video processing fails

**Solution:**
- Verify FFmpeg is installed: `ffmpeg -version`
- Add FFmpeg to system PATH
- Restart terminal/IDE after installation

### Electron Won't Start

**Issue:** Electron shows blank screen

**Solution:**
```bash
cd electron-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### PyTorch Installation Issues

**Issue:** PyTorch installation is very slow or fails

**Solution:**
Install PyTorch separately with appropriate options:

**CPU-only (faster install):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**GPU (CUDA - Windows/Linux only):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

Then install remaining requirements:
```bash
pip install -r requirements.txt
```

## Development Workflow

Once everything is installed:

1. **Start the full application:**
   ```bash
   npm run dev
   ```
   This starts both Electron and Python backend.

2. **Start components separately:**
   
   Terminal 1 - Python Backend:
   ```bash
   cd ai-engine
   source venv/bin/activate
   python main.py
   ```
   
   Terminal 2 - Electron App:
   ```bash
   cd electron-app
   npm run dev
   ```

## Next Steps

1. Connect to your GrandMA3 console
2. Import your show structure
3. Configure cues with tempo tracking settings
4. Start experimenting with video analysis and AI features!

Refer to the [User Guide](docs/USER_GUIDE.md) for detailed usage instructions.

## Getting Help

If you encounter issues:
1. Check this troubleshooting section
2. Review the [README.md](README.md)
3. Open an issue on GitHub

## Optional: GPU Acceleration

For faster video and audio processing, consider:

**macOS (Apple Silicon):**
- PyTorch should automatically use Metal acceleration

**Windows/Linux (NVIDIA GPU):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

**AMD GPU:**
- Refer to PyTorch ROCm installation guide

GPU acceleration significantly improves:
- Video frame analysis speed
- ML model inference
- Batch processing of looks
