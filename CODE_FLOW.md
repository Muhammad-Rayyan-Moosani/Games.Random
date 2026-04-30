# games.random - Code Flow Documentation

This doc explains how the code works from start to finish. No complicated jargon, just a simple walkthrough.

## The Big Picture

1. User visits the website
2. They describe a game they want (like "make a pong game")
3. We send that to Claude AI
4. Claude writes the code and streams it back in real-time
5. User sees the code appear as it's being written
6. Game runs automatically
7. User can chat with AI to modify it

## File Structure (Cleaned Up!)

```
Games.Random/
├── back-end/
│   ├── server/
│   │   ├── server.js           # Main server - handles all web requests
│   │   └── main.js             # AI logic - talks to Claude API
│   └── prompts/                # Instructions we give to Claude
│       ├── prompt-p5js.txt     # How to write p5.js games
│       ├── prompt-phaser.txt   # How to write Phaser games
│       └── AIchatbot-Prompts.txt  # How to help users with code
├── front-end/
│   └── public/
│       ├── index.html          # Landing page where you describe the game
│       ├── play.html           # Game player page with code editor
│       ├── index.css           # Styles
│       └── js/                 # Frontend JavaScript modules
│           ├── main.js         # Coordinates everything
│           ├── file-manager.js # Download/copy code
│           └── utils.js        # Helper functions
├── .env                        # API key (don't commit this!)
├── package.json                # Dependencies
└── CODE_FLOW.md               # You're reading it!
```

## Detailed Flow: How a Game Gets Generated

### Step 1: User Lands on index.html

- User opens `http://localhost:3000`
- Server serves `/front-end/public/index.html`
- They see a text box and two library choices (p5.js or Phaser)
- They type something like "make a snake game"
- They click "Generate game code"

**File: front-end/public/index.html line 859**
```javascript
async function generateGame() {
    // Get what they typed
    const description = document.getElementById("description").value;
    const library = document.querySelector('input[name="library"]:checked').value;

    // Make sure they actually typed something
    if (!description.trim()) {
        showError("Please describe the 2D game you want to create.");
        return;
    }

    // Send request to backend...
}
```

### Step 2: Frontend Sends Request to Backend

**What happens:**
- JavaScript makes a POST request to `/api/generate-stream`
- Sends the description and library choice
- Sets up Server-Sent Events to receive streaming data

**File: front-end/public/index.html line 927**
```javascript
const response = await fetch("/api/generate-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, library }),
});
```

### Step 3: Server Receives Request

**File: back-end/server/server.js line 148**

The server's streaming endpoint wakes up:

```javascript
app.post('/api/generate-stream', dailyGameLimit, async (req, res) => {
    const { description, library } = req.body;

    // Check rate limit (3 per day)
    // Validate the inputs
    // Set up streaming headers
    // Call the AI generation function
}
```

First, it checks if they've used up their daily limit (3 games per 24 hours). If they're good, it continues.

### Step 4: AI Generation Starts

**File: back-end/server/main.js line 179**

The server calls `generateGameStreaming()`:

```javascript
export async function generateGameStreaming(description, library = 'p5js', onChunk) {
    // Pick the right prompt (p5.js or Phaser instructions)
    const systemPrompt = library === 'phaser' ? phaserPrompt : p5jsPrompt;

    // Start streaming from Claude API
    const stream = await anthropic.messages.stream({
        model: 'claude-opus-4-7',
        max_tokens: 7000,
        system: systemPrompt,
        messages: [{ role: 'user', content: description }]
    });

    // Every time we get a chunk of text, send it to the frontend
    stream.on('text', (textDelta, textSnapshot) => {
        onChunk({
            type: 'chunk',
            text: textDelta,      // Just the new bit
            full: textSnapshot     // Everything so far
        });
    });
}
```

### Step 5: Code Streams Back to User

As Claude writes the code:
1. Each chunk arrives at the server
2. Server immediately forwards it to the frontend via SSE
3. Frontend displays it in real-time in the UI
4. User watches the code appear line by line

**File: front-end/public/index.html line 976**
```javascript
if (data.type === 'chunk') {
    // Update the display with new code
    streamingCodeEl.textContent = data.full;
    streamingCodeEl.scrollTop = streamingCodeEl.scrollHeight;
}
```

### Step 6: Generation Complete

When Claude finishes:

**File: back-end/server/main.js line 229**
```javascript
// Clean up any markdown formatting
const cleanCode = stripMarkdownCodeBlocks(fullResponse);

// Tell the UI we're done
if (onChunk) {
    onChunk({
        type: 'complete',
        code: cleanCode,
        totalTime: totalTime,
        chunks: chunkCount
    });
}

// Save for the chatbot (so it can help modify the code later)
TheCleanCode = cleanCode;
```

### Step 7: Frontend Saves and Redirects

**File: front-end/public/index.html line 982**
```javascript
else if (data.type === 'complete') {
    // Save the code so play.html can access it
    sessionStorage.setItem("editedGameCode", data.code);
    sessionStorage.setItem("gameLibrary", library);

    // Redirect to the game player page
    window.location.href = "play.html";
}
```

### Step 8: Game Runs on play.html

**File: front-end/public/play.html**

1. Page loads
2. Grabs code from sessionStorage
3. Sets up Monaco code editor
4. Injects code into an iframe
5. Game runs!

The code runs in an isolated iframe so it can't break the main page.

## The Chat Feature

After generating a game, users can ask questions like "how do I make the player faster?"

### Flow:

1. User types question in chat box
2. Frontend sends to `/api/chat`
3. Server calls `chatWithCodeAssistant()`
4. Function sends the question + the generated code to Claude
5. Claude responds with helpful explanation
6. Response shown in chat UI

**File: back-end/server/main.js line 131**
```javascript
export async function chatWithCodeAssistant(userMessage, gameCode, library) {
    // Give Claude the chat instructions plus the game code to reference
    const PromptWithCode = AIchatbotPrompt + TheCleanCode;

    // Ask Claude for help
    const message = await anthropic.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 7000,
        system: [{ type: "text", text: PromptWithCode }],
        messages: [{ role: 'user', content: userMessage }]
    });

    return response.trim();
}
```

## Rate Limiting

To prevent abuse and manage API costs, we limit each IP to 3 game generations per 24 hours.

**File: back-end/server/server.js line 36**

```javascript
const dailyGameLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,  // 24 hours
    max: 3,                          // 3 requests per window
    // ... error handling
});
```

This is applied to both `/api/generate` and `/api/generate-stream`.

## Key Technologies

- **Express**: Web server framework
- **Claude AI (Anthropic)**: Generates the game code
- **Server-Sent Events (SSE)**: Streams code in real-time
- **Monaco Editor**: The code editor (same as VS Code uses)
- **p5.js / Phaser**: Game libraries

## Environment Setup

The `.env` file needs one thing:

```
ANTHROPIC_API_KEY=your-key-here
```

Get your key from: https://console.anthropic.com/

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your API key to `.env`

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000

That's it! The server serves both the API and the frontend files.

## Common Questions

**Q: Why streaming instead of just waiting?**
A: It feels way faster. Users see progress instead of staring at a loading spinner for 10 seconds.

**Q: Where does the code run?**
A: In an iframe on play.html. This keeps it isolated from the main page.

**Q: Can I deploy this?**
A: Yes! Works on Vercel, Railway, or any Node.js host. Just set the ANTHROPIC_API_KEY environment variable.

**Q: Why 3 generations per day?**
A: API costs money. This prevents abuse while still being useful for learning.

**Q: What's with TheCleanCode variable?**
A: It's a simple cache. We store the last generated game so the chatbot can reference it without passing it back and forth.

## That's It!

The whole flow is basically:
1. User describes game
2. We ask Claude to write it
3. Stream it back as it's being written
4. Run it in an iframe
5. Let them modify it with AI help

Simple and effective.
