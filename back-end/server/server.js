/**
 * games.random - Express API Server
 *
 * RESTful API server for AI game generation with real-time streaming capabilities.
 *
 * Features:
 * - AI game generation (standard and streaming)
 * - Interactive code assistant chatbot
 * - Rate limiting for API requests
 *
 * @module server
 * @author Shayan Mazahir, Rayyan Moosani
 * @license GPL-3.0-or-later
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { generateGame, chatWithCodeAssistant, generateGameStreaming } from './main.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();

const app = express();

// ========== CONFIGURATION ==========

// ES module path resolution (required for __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables with fallback defaults
const PORT = process.env.PORT || 3000;


// ========== MIDDLEWARE ==========

/**
 * CORS configuration - Allow cross-origin requests
 */
app.use(cors({
    origin: true  // Allow all origins (configure stricter for production)
}));

// Parse JSON request bodies
app.use(express.json());

// ========== RATE LIMITING ==========

/**
 * Daily Rate Limiter for Game Generation
 * Limits users to 3 game generations per 24 hours based on IP address
 * Prevents abuse and manages API costs
 */
const dailyGameLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // Limit each IP to 3 requests per windowMs
    message: {
        success: false,
        error: 'Daily limit reached',
        message: 'You have reached your daily limit of 3 game generations. Please try again in 24 hours.',
        resetTime: null // Will be set dynamically
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
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
    // Skip rate limiting for authenticated users (optional future enhancement)
    skip: (req) => {
        // You can add logic here to skip rate limiting for premium users
        return false;
    }
});


// ========== API ROUTES ==========

/**
 * GET /api
 * API status and documentation endpoint
 * Shows server status and available endpoints
 */
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

/**
 * POST /api/generate
 * Generate game code using AI
 * Public endpoint - no authentication required
 * Rate limited to 3 generations per 24 hours per IP
 *
 * @param {Object} req.body - Request body
 * @param {string} req.body.description - Natural language game description
 * @param {string} req.body.library - Game library ('p5js' or 'phaser')
 * @returns {Object} Generated game code and metadata
 */
app.post('/api/generate', dailyGameLimit, async (req, res) => {
    try {
        const { description, library } = req.body;

        // Validate description
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

        // Validate library
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

        // Generate game code using AI
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

/**
 * POST /api/generate-stream
 * Generate game code with real-time streaming
 * Uses Server-Sent Events (SSE) to stream code as it's generated
 * Public endpoint - no authentication required
 * Rate limited to 3 generations per 24 hours per IP
 *
 * @param {Object} req.body - Request body
 * @param {string} req.body.description - Natural language game description
 * @param {string} req.body.library - Game library ('p5js' or 'phaser')
 * @returns {Stream} SSE stream of code chunks
 */
app.post('/api/generate-stream', dailyGameLimit, async (req, res) => {
    try {
        const { description, library } = req.body;

        // Validate input
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

        // Set up Server-Sent Events headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');  // Disable nginx buffering

        // Stream game generation with callback for each chunk
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

/**
 * POST /api/chat
 * Interactive code assistant for modifying generated games
 * Public endpoint - no authentication required
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.message - User's question or request
 * @param {string} req.body.gameCode - Current game code for context
 * @param {string} req.body.library - Game library being used
 * @returns {Object} AI assistant's response
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, gameCode, library } = req.body;

        // Validate message
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        // Validate context
        if (!gameCode || !library) {
            return res.status(400).json({
                success: false,
                error: "Game code and library information are required."
            });
        }

        console.log(`💬 Chat request for ${library} game`);

        // Get AI response
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

// ========== STATIC FILE SERVING ==========

/**
 * Serve frontend static files
 * Serves HTML, CSS, JS, and other assets from the front-end directory
 */
app.use(express.static(path.join(__dirname, '../../front-end/public')));

// ========== START SERVER ==========

/**
 * Start Express server and listen on configured port
 * Displays startup information and configuration status
 */
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Ready to generate games!`);
});