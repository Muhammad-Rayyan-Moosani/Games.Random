// This is the main server file that handles all web requests
// It's an Express server with three main jobs:
// 1. Generate games (with AI streaming)
// 2. Let users chat about their code
// 3. Serve the frontend files

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { generateGame, chatWithCodeAssistant, generateGameStreaming } from './main.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Figure out file paths (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment port or default to 3000
const PORT = process.env.PORT || 3000;

// Allow requests from any origin (needed for local dev)
app.use(cors({
    origin: true
}));

// Let Express parse JSON in request bodies
app.use(express.json());

// Rate limiter - stops people from spamming the API
// Limits each IP to 3 games per day (resets after 24 hours)
const dailyGameLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    max: 3, // 3 requests per day
    message: {
        success: false,
        error: 'Daily limit reached',
        message: 'You have reached your daily limit of 3 game generations. Please try again in 24 hours.',
        resetTime: null
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const resetTime = new Date(req.rateLimit.resetTime);
        const now = new Date();
        const hoursLeft = Math.ceil((resetTime - now) / (1000 * 60 * 60));

        console.log(`⚠️  Rate limit exceeded for IP: ${req.ip}`);

        res.status(429).json({
            success: false,
            error: 'Daily limit reached',
            message: `You've used all 3 daily game generations. Please try again in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}.`,
            limit: 3,
            remaining: 0,
            resetTime: resetTime.toISOString(),
            hoursUntilReset: hoursLeft
        });
    },
    skip: (req) => {
        // Could add premium user logic here later
        return false;
    }
});

// Simple status page
app.get('/api', (req, res) => {
    res.send(`
        <h1>🎮 games.random API Server</h1>
        <p>Server is running!</p>
        <p>Available endpoints:</p>
        <ul>
            <li>POST /api/generate - Generate a game</li>
            <li>POST /api/generate-stream - Generate a game (streaming)</li>
            <li>POST /api/chat - Chat with code assistant</li>
        </ul>
    `);
});

// Main endpoint - generates a game from a description
// Rate limited to 3 per day per IP
app.post('/api/generate', dailyGameLimit, async (req, res) => {
    try {
        const { description, library } = req.body;

        // Make sure they gave us a description
        if (!description) {
            return res.status(400).json({
                success: false,
                error: 'Description is required. Please describe the game you want to create.'
            });
        }

        if (description.trim().length < 5) {
            return res.status(400).json({
                success: false,
                error: 'Description is too short. Please provide more details.'
            });
        }

        // Make sure they picked a valid library
        if (!library) {
            return res.status(400).json({
                success: false,
                error: 'Library is required. Choose either "p5js" or "phaser".'
            });
        }

        const normalizedLibrary = library.toLowerCase();
        if (!['p5js', 'phaser'].includes(normalizedLibrary)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid library. Must be either "p5js" or "phaser".'
            });
        }

        console.log(`🎮 Request: Generate ${normalizedLibrary} game: "${description}"`);

        // Generate the game
        const startTime = performance.now();
        const gameCode = await generateGame(description, normalizedLibrary);
        const endTime = performance.now();

        console.log('✅ Game generated successfully!');
        console.log(`⏱️ Generation time: ${((endTime - startTime) / 1000).toFixed(2)}s`);

        res.json({
            success: true,
            code: gameCode,
            library: normalizedLibrary
        });

    } catch (error) {
        console.error('❌ Server Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Streaming endpoint - same as /generate but sends code in real-time
// This is what the frontend actually uses because it feels faster
app.post('/api/generate-stream', dailyGameLimit, async (req, res) => {
    try {
        const { description, library } = req.body;

        // Quick validation
        if (!description || description.trim().length < 5) {
            return res.status(400).json({
                success: false,
                error: 'Description is required and must be at least 5 characters.'
            });
        }

        const normalizedLibrary = (library || 'p5js').toLowerCase();
        if (!['p5js', 'phaser'].includes(normalizedLibrary)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid library. Must be either "p5js" or "phaser".'
            });
        }

        console.log(`⚡ Streaming request: ${normalizedLibrary} - "${description}"`);

        // Set up streaming headers (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');  // Don't buffer in nginx

        // Generate and stream the code back
        await generateGameStreaming(description, normalizedLibrary, (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });

        res.end();

    } catch (error) {
        console.error('❌ Streaming Server Error:', error.message);
        res.write(`data: ${JSON.stringify({
            type: 'error',
            error: error.message
        })}\n\n`);
        res.end();
    }
});

// Chat endpoint - lets users ask questions about their generated code
app.post('/api/chat', async (req, res) => {
    try {
        const { message, gameCode, library } = req.body;

        // Make sure they sent a message
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        // Make sure we have context
        if (!gameCode || !library) {
            return res.status(400).json({
                success: false,
                error: "Game code and library information are required."
            });
        }

        console.log(`💬 Chat request for ${library} game`);

        // Get Claude's help
        const reply = await chatWithCodeAssistant(message, gameCode, library);

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error("❌ Chatbot API Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Serve all the frontend files (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../../front-end/public')));

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Ready to generate games!`);
});
