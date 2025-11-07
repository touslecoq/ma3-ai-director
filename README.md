# GrandMA3 AI Lighting Director

An intelligent cross-platform desktop application that brings AI-powered lighting design to GrandMA3 consoles. Features include video analysis, natural language control, adaptive tempo tracking, and automated cue generation.

## Features

### 🎥 Video Analysis & Look Extraction
- Upload videos or YouTube links to analyze lighting designs
- AI extracts colors, intensities, movements, and fixture positions
- Build a searchable library of lighting looks
- Recreate looks on your MA3 fixtures

### 💬 Natural Language Interface
- Conversational AI agent powered by LLM
- Create looks with simple commands: *"Create a pale blue look with sweeping movement"*
- Understands lighting terminology and artistic descriptions
- Interactive refinement and suggestions

### 🎵 Real-Time Audio Analysis
- Live audio capture from multiple sources
- Beat detection and tempo tracking
- Spectral analysis (bass, mids, highs)
- Energy level monitoring
- Song structure detection

### 🎯 Adaptive Tempo Following
- Monitors active MA3 cues automatically
- Tracks live band tempo variations
- Intelligent smoothing prevents jerky adjustments
- Configurable per-cue tracking behavior
- Works alongside existing OnSong/pedal workflows

### 🎼 Music-Based Cue Generation
- Analyze studio or live recordings
- AI generates complete cuelist with timing
- User-guided mode: specify base looks (e.g., "blue verse, magenta chorus")
- Fully automatic mode: AI decides everything
- Smart transitions and dynamic elements

### 🧠 Knowledge Base & Learning
- Vector database stores all looks semantically
- Search by natural language description
- AI learns from your preferences over time
- Usage statistics and ratings

### 🎛️ GrandMA3 Integration
- Real-time connection to MA3 console
- Read show structure (cuelists, cues, executors)
- Create and modify cues programmatically
- Set fixture values and effects
- MAtricks effect generation

## Architecture

```
grandma3-ai-director/
├── electron-app/          # Electron desktop application
│   ├── main/             # Main process (Node.js)
│   ├── renderer/         # React UI
│   └── preload/          # IPC bridge
├── ai-engine/            # Python AI/ML backend
│   ├── video_analyzer/   # Video processing & look extraction
│   ├── audio/           # Real-time audio analysis & tempo tracking
│   ├── nlp/             # Natural language processing
│   ├── agent/           # LLM-powered AI agent
│   ├── models/          # ML model definitions
│   ├── generators/      # Effect & chase generators
│   └── ma3_interface/   # GrandMA3 API wrapper
├── shared/              # Shared types and utilities
└── docs/                # Documentation
```

## Technology Stack

**Frontend:**
- Electron 28
- React 18 + TypeScript
- Material-UI / Tailwind CSS

**Backend (AI Engine):**
- Python 3.10+
- PyTorch 2.0+ (Deep learning)
- OpenCV 4.8+ (Video processing)
- librosa & aubio (Audio analysis)
- LangChain (AI agent framework)
- ChromaDB (Vector database)
- OpenAI GPT-4 or Claude (LLM)

**Integration:**
- GrandMA3 API (Lua remote control)
- OSC Protocol
- MIDI Support

## Prerequisites

### macOS
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Python
brew install python@3.10

# Install ffmpeg (for video processing)
brew install ffmpeg
```

### Windows
1. Install Node.js from https://nodejs.org/
2. Install Python 3.10+ from https://python.org/
3. Install ffmpeg from https://ffmpeg.org/

## Installation

1. **Clone the repository:**
```bash
cd ~/Desktop
git clone <repository-url> grandma3-ai-director
cd grandma3-ai-director
```

2. **Install all dependencies:**
```bash
npm run install:all
```

This will:
- Install root npm dependencies
- Install Electron app dependencies
- Install Python dependencies

## Development

### Start Development Environment
```bash
npm run dev
```

This starts:
- Electron app with hot reload
- Python backend API server
- React development server

### Individual Components

**Electron App Only:**
```bash
npm run dev:electron
```

**Python Backend Only:**
```bash
npm run dev:python
```

## Configuration

### GrandMA3 Connection

Edit `ai-engine/config.yaml`:
```yaml
ma3:
  host: "192.168.1.50"  # MA3 console IP
  port: 30000           # Telnet port
  protocol: "telnet"    # or "http"
```

### Audio Settings

Edit `ai-engine/config.yaml`:
```yaml
audio:
  input_device: "default"  # or specific device name
  sample_rate: 44100
  buffer_size: 512
  channels: 2
```

### AI Model Settings

Edit `ai-engine/config.yaml`:
```yaml
ai:
  llm_provider: "openai"  # or "anthropic"
  api_key: "your-api-key"
  model: "gpt-4"
  temperature: 0.7
```

## Building for Production

### Build All

```bash
npm run build
```

### Package for macOS

```bash
npm run package:mac
```

Creates:
- `dist/GrandMA3 AI Director.dmg`
- `dist/GrandMA3 AI Director-mac.zip`

### Package for Windows

```bash
npm run package:win
```

Creates:
- `dist/GrandMA3 AI Director Setup.exe`
- `dist/GrandMA3 AI Director.exe` (portable)

## Usage

### Quick Start

1. **Connect to MA3:**
   - Launch the app
   - Go to Settings → MA3 Connection
   - Enter your console's IP address
   - Click "Connect"

2. **Import Show Structure:**
   - Click "Import from MA3"
   - App reads all cuelists and cues

3. **Configure Cues:**
   - Select a cue from the list
   - Set target BPM
   - Choose tracking mode (Gentle/Smooth/Tight)

4. **Start Audio Analysis:**
   - Select audio input source
   - Press "Start Monitoring"
   - Audio visualizer shows live tempo

5. **Performance Mode:**
   - Use your foot pedal as normal (OnSong → MA3)
   - App detects cue changes automatically
   - Effect speeds adjust to live tempo

### Creating Looks

**Via Natural Language:**
```
You: "Create a moody blue look with slow movement"
AI: "Creating deep blue (RGB: 20, 50, 120) with 6-second pan sweep.
     Shall I store this as Cue 2.1?"
```

**Via Video Analysis:**
1. Upload a reference video
2. AI analyzes and extracts looks
3. Browse extracted looks
4. Select one to recreate on your fixtures

**Via Music Analysis:**
1. Upload an audio file (MP3, WAV)
2. Specify base looks: "Blue verses, magenta chorus"
3. AI generates complete cuelist with timing
4. Review and approve
5. Cues created automatically in MA3

## Keyboard Shortcuts

- `Cmd/Ctrl + N` - New project
- `Cmd/Ctrl + O` - Open project
- `Cmd/Ctrl + S` - Save project
- `Cmd/Ctrl + ,` - Open settings
- `Cmd/Ctrl + Shift + C` - Connect to MA3
- `Cmd/Ctrl + Space` - Open AI chat
- `Cmd/Ctrl + U` - Upload video
- `Cmd/Ctrl + M` - Upload audio
- `Space` - Start/stop audio monitoring

## Troubleshooting

### Can't Connect to MA3
- Verify console IP address
- Check network connectivity
- Ensure MA3 remote control is enabled
- Try OSC protocol if telnet fails

### Audio Not Detected
- Check audio input device selection
- Grant microphone permissions
- Verify input device in system settings
- Try different buffer size

### Python Module Errors
```bash
cd ai-engine
pip install -r requirements.txt --upgrade
```

### Electron Won't Start
```bash
cd electron-app
rm -rf node_modules
npm install
```

## Documentation

- [User Guide](docs/USER_GUIDE.md)
- [API Documentation](docs/API.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Development Guide](docs/DEVELOPMENT.md)

## Project Status

**Current Version:** 0.1.0 (Pre-Alpha)

This is an initial setup. Core features are being actively developed.

## Development Roadmap

- [x] Project structure setup
- [ ] Electron app foundation
- [ ] Python backend API
- [ ] MA3 connection & state monitoring
- [ ] Audio analysis engine
- [ ] Adaptive tempo tracking
- [ ] Video upload & processing
- [ ] Look extraction models
- [ ] Natural language interface
- [ ] Knowledge base & vector search
- [ ] Music-based cue generation
- [ ] MAtricks generator
- [ ] Complete UI implementation
- [ ] Testing & refinement
- [ ] macOS packaging
- [ ] Windows packaging

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Author

Richard Palcock

---

**Note:** This application is in active development. Features are being added iteratively. Check back for updates!
