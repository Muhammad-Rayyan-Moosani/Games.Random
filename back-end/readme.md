## 🏗️ Technical Architecture

```
┌─────────────────┐
│   User Browser  │
│   (Frontend)    │
│  - React/HTML   │
│  - Chat UI      │
│  - Game Display │
└────────┬────────┘
         │
         │ HTTP POST: {description: "...", library: "..."}
         ▼
┌─────────────────┐
│   Backend API   │
│   (Node.js)     │
│  - Express      │
│  - API Handler  │
└────────┬────────┘
         │
         │ API Call
         ▼
┌─────────────────┐
│  Claude API     │
│  (Anthropic)    │
│  - Code Gen     │
└────────┬────────┘
         │
         │ JavaScript Game Code (p5.js or Phaser)
         ▼
┌─────────────────┐
│   User Browser  │
│  - Run in iframe│
│  - Play Game!   │
└─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js (v18+)
- **API Framework:** Express.js _(planned)_
- **AI API:** Anthropic Claude API (Sonnet 4.5)
- **Game Libraries:** p5.js, Phaser 3

---

## 📦 Backend - What's Done

### ✅ Completed Features

#### 1. **Claude API Integration**

- ✅ Anthropic SDK setup and configuration
- ✅ Environment variable management with `dotenv`
- ✅ API key security (stored in `/secrets/.env`)

#### 2. **Conversation System**

- ✅ Multi-turn conversation support
- ✅ Conversation history tracking
- ✅ User and assistant role management
- ✅ Continuous conversation loop
- ✅ Exit commands (`exit`, `quit`)

#### 3. **Dual Library Support**

- ✅ p5.js prompt configuration (`prompt-p5js.txt`)
- ✅ Phaser prompt configuration (`prompt-phaser.txt`)
- ✅ Library selection at session start
- ✅ Runtime library switching (`use p5js`, `use phaser`)
- ✅ Current library status check (`library`, `which`)

#### 4. **Code Processing**

- ✅ Markdown code block stripping
- ✅ Multi-format code fence removal (`javascript, `js, etc.)
- ✅ Clean code extraction from Claude responses

#### 5. **Token Management**

- ✅ Configurable `max_tokens` (currently 8000)
- ✅ Token limit warning system
- ✅ Efficient token usage (only pay for what's used)

#### 6. **Error Handling**

- ✅ API error catching and logging
- ✅ Empty input validation
- ✅ Invalid library choice handling

#### 7. **User Experience**

- ✅ Formatted console output with emojis
- ✅ Clear command instructions
- ✅ Visual library selection menu
- ✅ Session attribution (`made by  with...`)

### 8. **\*API Endpoint**

- ✅ Create Express.js server
- ✅ Set up CORS for frontend communication
- ✅ Create `/api/generate` POST endpoint
- ✅ Move Claude logic into service modules
- ✅ Add request/response validation

---

### 📋 Backend - To Do

- anything in **bold** is a 50/50

#### Phase 2: API Structure

- ✅ Create route handlers (`/routes/generate.js`)
- ✅ Create Claude service (`/services/claudeService.js`)
- [ ] Create prompt management system
- [ ] **Add logging middleware (Morgan)**
- [ ] **Add security headers (Helmet)**

#### Phase 3: Rate Limiting & Security

- [ ] Implement rate limiting (express-rate-limit)
- [ ] Set up IP-based throttling (10 req/15min)
- [ ] Add request sanitization
- [ ] Implement API key validation

#### Phase 4: Code Validation

- [ ] Retry mechanism for failed generations
- [ ] **Syntax validation for generated code**
- [ ] **Security scanning for malicious code**
- [ ] **Code length limits**

#### Phase 5: Caching (Optional)

- ✅ Cache common game types
- [ ] Implement prompt caching for cost savings
- [ ] Response caching for duplicate requests

### Phase 6: Data Base

- [ ] Add a data base where the users generated game can be stored
- [ ] Data base to be linked with users Google Account

### Phase 7: Google Auth

- [ ] Option to link your Google account to the website
- [ ] Link games to the Google account and store them

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- Anthropic API key

### Installation

1. **Clone the repository**

```bash
git clone [repository-url]
cd games-random
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create `secrets/.env`:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

4. **Create prompt files**

Create `prompt-p5js.txt` and `prompt-phaser.txt` with your system prompts.

5. **Go into back-end/server**

```bash
node server.js
```

---

## 📦 Dependencies

### Current Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.32.1",
  "dotenv": "^16.4.7"
}
```

You can install using `npm i` (it _should_ install everything)

---

## 💡 Usage Examples

### Console Interface (Current)

```bash
$ node server.js

╔════════════════════════════════════════╗
║  🎮  - AI Game Generator  ║
╚════════════════════════════════════════╝

Choose your game engine:

  1. p5.js    ⚡ (Simple & Fast - Pong, Snake, Flappy Bird)
  2. Phaser   🚀 (Advanced - Platformers, Physics, RPG)

Enter your choice (1 or 2) or library name: 1

✅ Using P5JS for this session

Commands:
  • "use p5js" or "use phaser" - Switch library
  • "library" - Show current library
  • "exit" or "quit" - End session

You: create a simple pong game

🤖 Asking Claude (using P5JS)...

📝 Claude says:
[... game code appears ...]

You: make it faster

🤖 Asking Claude (using P5JS)...
[... updated code ...]
```

### Web Interface (Planned)

- User types game description in chat UI
- Selects p5.js or Phaser from dropdown
- Clicks "Generate Game"
- Game appears in canvas below
- User can iterate with follow-up requests

---

## 🔐 Security Considerations

- ✅ API keys stored in environment variables
- ✅ `.env` file gitignored
- [ ] Rate limiting to prevent abuse (TODO)
- [ ] Input sanitization (TODO)
- ✅ Code execution in sandboxed iframe (TODO)
- [ ] Content Security Policy headers (TODO)

---

## 💰 Cost Management

### Token Usage Estimates

- Simple game generation: ~1,000-2,000 tokens (~$0.03)
- Complex game generation: ~4,000-6,000 tokens (~$0.09)
- Iteration/modification: ~1,000-2,000 tokens (~$0.03)

### Budget

- Free tier: $5 in credits (~150 game generations)
- Estimated hackathon usage: ~$10-20

### Optimizations

- ✅ Dynamic `max_tokens` based on complexity
- ✅ Conversation history management
- [ ] Response caching (TODO)
- [ ] Prompt caching with Anthropic (TODO)

---

## 🐛 Known Issues

- None yet! 🎉

## Next Steps

- To deploy the main application and add some features
- To buy a domain and to implement.
- Coming sooooooonnnnnnnn!

---
