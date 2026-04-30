// This file handles all the AI magic - talking to Claude to generate game code
// It's pretty simple: we send a description, Claude sends back code

import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Figure out where this file lives so we can find other files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the API key from .env file
dotenv.config({ path: join(__dirname, '../../.env') });

// Make sure we have an API key
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
    console.error('\n❌ ERROR: Anthropic API key not configured!');
    console.error('📝 Please add your API key to the .env file:');
    console.error('   1. Get your key from https://console.anthropic.com/');
    console.error('   2. Edit .env file and replace "your-anthropic-api-key-here"');
    console.error('   3. Restart the server\n');
}

// Connect to Claude API
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Load the instruction prompts that tell Claude how to write games
// We have different instructions for p5.js and Phaser
const p5jsPrompt = await readFile(join(__dirname, '../prompts/prompt-p5js.txt'), 'utf8');
const phaserPrompt = await readFile(join(__dirname, '../prompts/prompt-phaser.txt'), 'utf8');
const AIchatbotPrompt = await readFile(join(__dirname, '../prompts/AIchatbot-Prompts.txt'), 'utf8');

// Keep track of the last game we generated so the chatbot can reference it
let TheCleanCode = "";

// Claude sometimes wraps code in markdown formatting like ```javascript
// This function strips all that out so we get pure code
function stripMarkdownCodeBlocks(text) {
    return text
        .replace(/```(?:javascript|js|typescript|ts)?\s*/gi, '')  // Remove ```javascript
        .replace(/\s*```/g, '')                                    // Remove closing ```
        .replace(/\*\*([^*]+)\*\*/g, '$1')                        // Remove **bold** formatting
        .replace(/^---+$/gm, '')                                   // Remove --- lines
        .replace(/^#+\s*/gm, '')                                   // Remove # headers
        .replace(/\n{3,}/g, '\n\n')                               // Clean up extra blank lines
        .trim();
}

// This is the main function that asks Claude to generate a game
// You give it a description like "make a pong game" and it returns code
export async function generateGame(description, library = 'p5js') {
    try {
        console.log(`\n🤖 Asking Claude (using ${library.toUpperCase()})...\n`);

        // Pick the right instructions based on which library they chose
        const systemPrompt = library === 'phaser' ? phaserPrompt : p5jsPrompt;

        console.log(`📏 System prompt length: ${systemPrompt.length} characters`);
        console.log(`📏 User message length: ${description.length} characters`);

        const startTime = performance.now();

        // Send the request to Claude
        // We use caching here - first request is slow, but repeated requests are way faster
        const message = await anthropic.messages.create({
            model: 'claude-opus-4-7',
            max_tokens: 7000,
            system: [
                {
                    type: "text",
                    text: systemPrompt,
                    cache_control: { type: "ephemeral" } // This makes it faster next time
                }
            ],
            messages: [
                {
                    role: 'user',
                    content: description
                }
            ]
        });

        const endTime = performance.now();
        const apiTime = ((endTime - startTime) / 1000).toFixed(2);

        // Pull out the actual text from Claude's response
        let response = '';
        for (const block of message.content) {
            if (block.type === 'text') {
                response += block.text;
            }
        }

        // Clean up any markdown formatting
        const cleanCode = stripMarkdownCodeBlocks(response);

        // Show some stats
        const usage = message.usage;
        console.log(`⏱️  Claude API time: ${apiTime}s`);
        console.log(`📊 Tokens used: ${usage.output_tokens} output`);
        if (usage.cache_creation_input_tokens) {
            console.log(`💾 Cache created: ${usage.cache_creation_input_tokens} tokens (first call)`);
        }
        if (usage.cache_read_input_tokens) {
            console.log(`⚡ Cache hit: ${usage.cache_read_input_tokens} tokens (90% faster!)`);
        }

        console.log('✅ Game generated successfully!\n');

        // Let them know if the response got cut off
        if (message.stop_reason === 'max_tokens') {
            console.log('⚠️  Warning: Response may be incomplete (hit token limit)\n');
        }

        // Save this so the chatbot can help with it later
        TheCleanCode = cleanCode;
        return cleanCode;

    } catch (error) {
        console.error('❌ Error calling Claude API:', error.message);
        throw error;
    }
}

// Chat assistant - helps users modify the game they just generated
// Like "how do I make the player faster?" and it'll explain how
export async function chatWithCodeAssistant(userMessage, gameCode, library) {
    try {
        console.log("\n🤖 Code Assistant request received...\n");

        // Give Claude the chat instructions plus the game code to reference
        const PromptWithCode = AIchatbotPrompt + TheCleanCode;
        const startTime = performance.now();

        // Ask Claude for help
        const message = await anthropic.messages.create({
            model: 'claude-opus-4-7',
            max_tokens: 7000,
            system: [
                {
                    type: "text",
                    text: PromptWithCode,
                    cache_control: { type: "ephemeral" }
                }
            ],
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        });

        const endTime = performance.now();
        console.log(`⏱️  Chat response time: ${((endTime - startTime) / 1000).toFixed(2)}s`);

        // Get the response text
        let response = '';
        for (const block of message.content) {
            if (block.type === 'text') {
                response += block.text;
            }
        }

        return response.trim();

    } catch (error) {
        console.error("❌ Code Assistant Error:", error);
        throw error;
    }
}

// Streaming version - same as generateGame but sends code as it's being written
// This makes it feel more responsive because you see the code appear in real-time
export async function generateGameStreaming(description, library = 'p5js', onChunk) {
    try {
        console.log(`\n⚡ Streaming ${library.toUpperCase()} game generation...\n`);

        // Pick the right prompt
        const systemPrompt = library === 'phaser' ? phaserPrompt : p5jsPrompt;

        console.log(`📏 System prompt: ${systemPrompt.length} chars`);
        console.log(`📏 User message: ${description.length} chars`);

        const startTime = performance.now();

        // Start the stream
        const stream = await anthropic.messages.stream({
            model: 'claude-opus-4-7',
            max_tokens: 7000,
            system: systemPrompt,
            messages: [{ role: 'user', content: description }]
        });

        let fullResponse = '';
        let chunkCount = 0;

        // Every time we get a new chunk of text, send it to the UI
        stream.on('text', (textDelta, textSnapshot) => {
            fullResponse = textSnapshot;
            chunkCount++;

            if (onChunk) {
                onChunk({
                    type: 'chunk',
                    text: textDelta,           // Just the new bit
                    full: textSnapshot,         // Everything so far
                    chunkNumber: chunkCount
                });
            }

            // Log every 50 chunks so we know it's working
            if (chunkCount % 50 === 0) {
                console.log(`📝 Streamed ${chunkCount} chunks...`);
            }
        });

        // Wait until it's all done
        const finalMessage = await stream.finalMessage();

        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);

        // Clean up the code
        const cleanCode = stripMarkdownCodeBlocks(fullResponse);

        // Log how it went
        console.log(`✅ Streaming complete!`);
        console.log(`⏱️  Total time: ${totalTime}s`);
        console.log(`📊 Chunks: ${chunkCount}`);
        console.log(`📊 Tokens: ${finalMessage.usage.output_tokens}`);

        // Tell the UI we're done
        if (onChunk) {
            onChunk({
                type: 'complete',
                code: cleanCode,
                totalTime: totalTime,
                chunks: chunkCount,
                tokens: finalMessage.usage.output_tokens
            });
        }

        if (finalMessage.stop_reason === 'max_tokens') {
            console.log('⚠️  Warning: Response may be incomplete\n');
        }

        // Save for the chatbot
        TheCleanCode = cleanCode;
        return cleanCode;

    } catch (error) {
        console.error('❌ Streaming error:', error.message);
        if (onChunk) {
            onChunk({ type: 'error', error: error.message });
        }
        throw error;
    }
}