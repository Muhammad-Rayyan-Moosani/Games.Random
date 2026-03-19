# AI Game Generator to Teach Game Mechanics

**Team:** Coders4Coop
**Project Name:**   

---

## Project Overview

### The Idea
A web application where users can describe any game they want in natural language, and our system generates a playable version in real-time using AI.

**Example Use Cases:**
- "Create a snake game but Pacman styled"
- "Make flappy bird but underwater themed"
- "Build pong with gravity physics"

### Why This Is Cool
- Democratizes game creation - anyone can make games without coding
- Unique mashups that don't exist yet
- Immediate playability - no downloads or installations
- Great demonstration of AI capabilities in creative domains

---

## Technical Architecture (may be changed)

```
┌─────────────────┐
│   User Browser  │
│   (Frontend)    │
│  - React/HTML   │
│  - Chat UI      │
│  - Game Display │
└────────┬────────┘
         │
         │ HTTP POST: {description: "..."}
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
         │ JavaScript Game Code
         ▼
┌─────────────────┐
│   User Browser  │
│  - Run in iframe│
│  - Play Game!   │
└─────────────────┘
```

---

## Implementation Plan

### Phase 0: Decisions
**Goals:**
- Decide which languages to use
- Decide what frameworks to use
- Break the team (front/back - end)
- Start searching for the perfect AI API

### Phase 1: MVP (Day 1)
**Goal:** Generate and run ONE simple game

**Backend Tasks:**

TBD

**Frontend Tasks:**

TDB

**Success Criteria:** User can type "simple pong game" and play it

---

### Phase 2: Refinement (Day 2)
**Goal:** Make games better quality and allow iterations

**Backend:**

TBD

**Frontend:**

TBD

**Success Criteria:** Users can iterate on games with feedback

---

### Phase 3 onwards: TBD


---

## Technical Challenges & Solutions

### Challenge 1: AI-Generated Code May Be Buggy
**Solutions:**
- Provide detailed prompts to AI for code quality
- Implement retry mechanism (generate 2-3 times, pick best)
- Add "Regenerate" button for users
- Start with simpler game types that are more reliable

### Challenge 2: External Dependencies/Packages
**Solutions:**
- Use CDN-hosted libraries (Phaser.js via CDN link)
- Prefer vanilla JavaScript (no dependencies)
- Pre-load common libraries in HTML template
- Instruct AI to avoid imports/requires

### Challenge 3: Security Concerns (Running User-Prompted Code)
**Solutions:**
- Execute in sandboxed iframe (isolated from main page)
- No server-side execution of generated code
- Rate limiting to prevent abuse
- Content Security Policy headers

### Challenge 4: API Costs
**Solutions:**
- Rate limiting (10 requests per 15 minutes per IP)
- Cache common game types
- Use efficient prompts to reduce token usage
- Monitor usage during hackathon

---

## Minimum Viable Product (MVP)

**What we MUST have:**
1. ✅ Working backend API that calls Claude
2. ✅ Frontend chat interface
3. ✅ Ability to generate at least ONE type of game successfully
4. ✅ Game execution in browser

**What would be NICE to have:**
- Refinement/iteration capability
- Multiple game types working reliably
- Polished UI/UX
- Deployed to public URL

**What we can SKIP:**
- User accounts/authentication
- Database/persistence
- Advanced features
- Perfect error handling

---



---

## Example Prompts to Test

**Simple (Start Here):**
- "Create a simple pong game"
- "Make a basic snake game"
- "Build a breakout clone"

**Medium (Once MVP Works):**
- "Snake game but Pacman styled"
- "Flappy bird but underwater themed"
- "Pong with gravity physics"

**Complex (Stretch Goals):**
- "Space invaders meets tower defense"
- "Platformer with procedural levels"
- "Racing game with power-ups"

---

## Success Metrics

**Technical Success:**
- Backend responds in < 5 seconds
- At least 70% of generated games are playable
- Zero crashes during demo
- Deployed and accessible via URL

**User Experience Success:**
- Clear UI/UX
- Obvious how to use
- Fun to interact with
- Impressive to watch

**Hackathon Success:**
- Working demo by deadline
- Solves a real problem (making game creation accessible)
- Technically impressive (AI + real-time execution)
- Good presentation

---

## 📚 Resources

### Documentation:
- **Claude API:** https://docs.anthropic.com
- **Express.js:** https://expressjs.com
- **HTML5 Canvas:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **Phaser.js (Optional):** https://phaser.io

### Hosting:
- **Backend:** Render.com, Railway.app, Heroku
- **Frontend:** Netlify, Vercel, GitHub Pages

### Learning:
- Node.js crash course
- JavaScript async/await
- Canvas API basics
- Prompt engineering for code generation

---

