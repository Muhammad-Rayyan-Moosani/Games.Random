`Use this file to test the code on the terminal/console/command prompt 
before moving to "claudeService.js" in the server folder for final push on the website`

// Load environment variables from secrets folder
import dotenv from 'dotenv';

// Import Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';

// Import readline for console input
import { createInterface } from 'readline';

// Import fs to read the txt file
import { readFile } from 'fs/promises';

dotenv.config({ path: './secrets/.env' });

// Create readline interface for getting user input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize Anthropic client with your API key
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Store conversation history
const conversationHistory = [];

// Reading BOTH prompt files
const p5jsPrompt = await readFile('../prompts/prompt-p5js.txt', 'utf8');
const phaserPrompt = await readFile('../prompts/prompt-phaser.txt', 'utf8');

// Current library selection (default to p5js)
let currentLibrary = 'p5js';

function stripMarkdownCodeBlocks(text) {
    return text
        .replace(/```(?:javascript|js|typescript|ts)?\s*/gi, '')
        .replace(/\s*```/g, '')
        .trim();
}

// Function to ask Claude something with library choice
async function askClaude(userPrompt, library = currentLibrary) {
    try {
        console.log(`\n🤖 Asking Claude (using ${library.toUpperCase()})...\n`);

        // Choose the correct system prompt based on library
        let systemPrompt;
        if (library === 'phaser') {
            systemPrompt = phaserPrompt;
        } else {
            systemPrompt = p5jsPrompt;
        }

        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: userPrompt
        });

        // Make API call to Claude
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 8000,
            system: systemPrompt,  // Library-specific prompt
            messages: conversationHistory
        });

        // Extract ALL content from Claude's response
        let response = '';
        for (const block of message.content) {
            if (block.type === 'text') {
                response += block.text;
            }
        }

        // Remove markdown code blocks
        const cleanResponse = stripMarkdownCodeBlocks(response);

        // Add Claude's response to history
        conversationHistory.push({
            role: 'assistant',
            content: message.content
        });

        // Output the response
        console.log('📝 Claude says:\n');
        console.log(cleanResponse);
        console.log(`\n// made by  with ${library} and Claude Sonnet 4.5\n`);

        // Check if response might be cut off
        if (message.stop_reason === 'max_tokens') {
            console.log('⚠️  Warning: Response may be incomplete (hit token limit)\n');
        }

        return cleanResponse;

    } catch (error) {
        console.error('❌ Error calling Claude API:', error.message);
    }
}

// Function to handle library switching
function switchLibrary(library) {
    if (library === 'p5js' || library === 'phaser') {
        currentLibrary = library;
        console.log(`\n✅ Switched to ${library.toUpperCase()}\n`);
        return true;
    } else {
        console.log('\n❌ Invalid library. Choose "p5js" or "phaser"\n');
        return false;
    }
}

// Function to get user input (recursive loop)
function getUserInput() {
    rl.question('You: ', async (userInput) => {

        // Check if user wants to exit
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            console.log('\n👋 Goodbye!\n');
            rl.close();
            return;
        }

        // Check if user wants to switch library
        if (userInput.toLowerCase().startsWith('use ')) {
            const library = userInput.toLowerCase().replace('use ', '').trim();
            switchLibrary(library);
            getUserInput();
            return;
        }

        // Show current library
        if (userInput.toLowerCase() === 'library' || userInput.toLowerCase() === 'which') {
            console.log(`\n📚 Current library: ${currentLibrary.toUpperCase()}`);
            console.log('💡 Type "use p5js" or "use phaser" to switch\n');
            getUserInput();
            return;
        }

        // Skip empty inputs
        if (!userInput.trim()) {
            getUserInput();
            return;
        }

        // Ask Claude with current library
        await askClaude(userInput, currentLibrary);

        // Loop back to get more input
        getUserInput();
    });
}

// Main function to run the program
// Main function to run the program
async function claude() {
    console.log('=== 🎮  - Claude Conversation ===\n');

    // Ask user which library to use at the start
    rl.question('What library do you want to use? (p5js/phaser): ', (choice) => {
        const selectedLibrary = choice.trim().toLowerCase();

        // Validate and set the library
        if (selectedLibrary === 'p5js' || selectedLibrary === 'phaser') {
            currentLibrary = selectedLibrary;
            console.log(`\n✅ Using ${currentLibrary.toUpperCase()} for this session\n`);
        } else if (selectedLibrary === '') {
            // Default to p5js if user presses enter without input
            currentLibrary = 'p5js';
            console.log('\n✅ Using P5JS (default) for this session\n');
        } else {
            console.log('\n⚠️  Invalid choice. Using P5JS (default) for this session\n');
            currentLibrary = 'p5js';
        }

        console.log('Commands:');
        console.log('  - "use p5js" or "use phaser" - Switch library (optional)');
        console.log('  - "library" or "which" - Show current library');
        console.log('  - "exit" or "quit" - End conversation\n');

        // Start the conversation loop
        getUserInput();
    });
}

// Run the program
claude();