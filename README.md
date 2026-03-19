<div align="center">

# 🎮 Games.Random

### AI-Powered 2D Game Generator

*Learn coding by creating games with natural language*

[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![Anthropic Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange.svg)](https://www.anthropic.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deploy](#-deployment)

</div>

---

## 📖 About

**Games.Random** is an innovative AI-powered platform that transforms natural language descriptions into fully playable 2D games. Designed for learners, educators, and game enthusiasts, it makes game development accessible to everyone—no coding experience required.

Simply describe the game you want to create, choose a library (p5.js or Phaser 3), and watch as Claude AI generates clean, commented code that you can play, learn from, and modify.

---

## ✨ Features

### 🤖 **AI-Powered Game Generation**
- Generate complete 2D games from natural language descriptions
- Powered by **Claude Sonnet 4.5** (Anthropic's latest model)
- Real-time streaming code generation with Server-Sent Events
- Support for **p5.js** and **Phaser 3** game libraries

### 🎨 **Interactive Development**
- **Instant playback**: Play generated games immediately in your browser
- **Code assistant chatbot**: Ask questions and get help modifying your game
- **Live code editor**: View and edit generated code in real-time
- **Educational comments**: Code includes explanatory comments for learning

### 🔐 **User Management**
- **Google OAuth authentication**: Secure sign-in with your Google account
- **Personal game library**: Save and manage your generated games
- **User profiles**: Track your creations and progress

### 🛡️ **Security & Performance**
- **Rate limiting**: 3 game generations per 24 hours (IP-based)
- **Session management**: Secure user sessions with Passport.js
- **MongoDB integration**: Persistent storage for user data and games
- **Error handling**: Graceful error messages and recovery

### 🐳 **Production-Ready**
- **Fully containerized**: Docker and Docker Compose support
- **Health checks**: Automatic service monitoring
- **Environment configuration**: Easy setup with .env files
- **Deployment configs**: Ready for Railway, Render, and more

### 🎯 **Modern UI/UX**
- **Dark theme**: Beautiful, modern interface with glassmorphic design
- **Responsive design**: Works on desktop, tablet, and mobile
- **Real-time feedback**: Live updates during code generation
- **Keyboard shortcuts**: Shift+Enter to generate games

---

## 🎬 Demo

### Generate a Game in 3 Steps:

1. **Describe your game**
   ```
   "Create a flappy bird game with a batman theme"
   ```

2. **Choose a library**
   - p5.js: Perfect for simple games and visual sketches
   - Phaser 3: Ideal for advanced games with physics

3. **Click Generate** and watch the magic happen! ✨

### Example Games You Can Create:
- 🏓 Pong with custom scoring
- 🐍 Snake game with obstacles
- 🦅 Flappy Bird variations
- 👾 Space Invaders clones
- 🎯 Platformer games
- 🎰 Puzzle games
- And many more!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Game UI    │  │  Auth System │  │  Game Library   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express.js Server                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  API Routes  │  │  Streaming   │  │  Rate Limiter   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────┬───────────────────┬───────────────────┬──────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Claude AI API   │  │   MongoDB    │  │ Passport OAuth   │
│  (Anthropic)     │  │   Database   │  │   (Google)       │
└──────────────────┘  └──────────────┘  └──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **npm** or **yarn**
- **Anthropic API key** (get one at [console.anthropic.com](https://console.anthropic.com/))
- **Docker** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muhammad-Rayyan-Moosani/Games.Random.git
   cd Games.Random
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   ANTHROPIC_API_KEY=your-api-key-here
   GOOGLE_CLIENT_ID=your-google-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
   SESSION_SECRET=your-random-secret
   MONGODB_URI=mongodb://localhost:27017/games-random (optional)
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

That's it! 🎉

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

Run the entire stack with one command:

```bash
docker-compose up -d
```

This starts:
- ✅ Games.Random application
- ✅ MongoDB database
- ✅ Automatic networking and volumes

**Stop the application:**
```bash
docker-compose down
```

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v20
- **Framework**: Express.js
- **AI**: Anthropic Claude API (Sonnet 4.5)
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js + Google OAuth 2.0
- **Session Management**: express-session
- **Rate Limiting**: express-rate-limit

### Frontend
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with glassmorphic design
- **Game Libraries**: p5.js, Phaser 3
- **Streaming**: Server-Sent Events (SSE)
- **Fonts**: Inter, JetBrains Mono

### DevOps
- **Containerization**: Docker, Docker Compose
- **Deployment**: Railway, Render, Vercel-ready
- **Version Control**: Git
- **CI/CD**: GitHub Actions ready

---

## 📚 Documentation

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/generate` | POST | Generate game (standard) | No |
| `/api/generate-stream` | POST | Generate game (streaming) | No |
| `/api/chat` | POST | Chat with code assistant | No |
| `/api/save-game` | POST | Save game to library | Yes |
| `/api/my-games` | GET | Get user's saved games | Yes |
| `/api/games/:id` | DELETE | Delete a saved game | Yes |
| `/auth/google` | GET | Initiate Google OAuth | No |
| `/auth/logout` | GET | Log out user | Yes |
| `/auth/current-user` | GET | Get current user info | No |

### Rate Limiting

- **Limit**: 3 game generations per 24 hours
- **Scope**: Per IP address
- **Reset**: Automatic after 24 hours
- **Bypass**: Authenticated users (future feature)

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | - | Your Anthropic API key |
| `GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ No | - | Google OAuth secret |
| `SESSION_SECRET` | ✅ Yes | - | Session encryption key |
| `MONGODB_URI` | ❌ No | local | MongoDB connection string |
| `PORT` | ❌ No | 3000 | Server port |

---

## 🌍 Deployment

### Railway (Recommended)

1. Go to [railway.app](https://railway.app/)
2. Connect your GitHub repository
3. Select the `Rayyan` branch
4. Add environment variables
5. Deploy!

### Render

1. Go to [render.com](https://render.com/)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `node app.js`
6. Add environment variables
7. Deploy!

### Docker

Deploy anywhere that supports Docker:

```bash
docker build -t games-random .
docker run -p 3000:3000 --env-file .env games-random
```

See [DOCKER.md](DOCKER.md) for more details.

---

## 🔧 Development

### Project Structure

```
Games.Random/
├── app.js                    # Application entry point
├── back-end/
│   ├── server/
│   │   ├── server.js        # Express server & routes
│   │   └── main.js          # Claude AI integration
│   └── prompts/             # AI system prompts
├── front-end/
│   └── public/
│       ├── index.html       # Main UI
│       ├── play.html        # Game player
│       └── js/              # Frontend scripts
├── docker-compose.yml       # Docker orchestration
├── Dockerfile              # Container definition
└── .env.example            # Environment template
```

### Running in Development Mode

```bash
# Install dependencies
npm install

# Start with auto-reload (using nodemon)
npm run dev

# Or start normally
npm start
```

### Building for Production

```bash
# Set environment to production
export NODE_ENV=production

# Start the server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Shayan Mazahir** - Initial work & architecture
- **Mohammad Samin** - Frontend development
- **Rayyan Moosani** - Backend development & DevOps

---

## 🙏 Acknowledgments

- **Anthropic** for the amazing Claude AI API
- **p5.js** and **Phaser** communities for excellent game libraries
- All contributors and testers who helped make this project better

---

## 📧 Support

Have questions or need help?

- 📧 Open an [Issue](https://github.com/Muhammad-Rayyan-Moosani/Games.Random/issues)
- 💬 Start a [Discussion](https://github.com/Muhammad-Rayyan-Moosani/Games.Random/discussions)
- 🐛 Report a [Bug](https://github.com/Muhammad-Rayyan-Moosani/Games.Random/issues/new)

---

## 🗺️ Roadmap

- [ ] Support for more game libraries (Three.js, PixiJS)
- [ ] Multiplayer game generation
- [ ] Game templates and examples
- [ ] Code export and download
- [ ] Integration with GitHub for code storage
- [ ] Premium tier with unlimited generations
- [ ] Mobile app (iOS/Android)
- [ ] Game sharing and community features

---

<div align="center">

**Made with ❤️ and AI**

[⭐ Star this repo](https://github.com/Muhammad-Rayyan-Moosani/Games.Random) if you find it helpful!

</div>
