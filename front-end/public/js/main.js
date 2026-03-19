/**
 * games.random - Main Entry Point
 * 
 * Initializes and coordinates all modules for the play interface.
 * Handles game code loading from session storage and module initialization.
 * 
 * @module main
 * @author Shayan Mazahir, Mohammad Samin, Rayyan Moosani
 * @license GPL-3.0-or-later
 */

import { initMonacoEditor, getEditor } from './editor.js';
import { runGame, runEditedCode, resetCode } from './game-runner.js';
import { 
    openAIChat, 
    closeAIChat, 
    sendAIMessage, 
    sendQuickMessage,
    handleAIChatKeypress,
    stopGameControls 
} from './chat-assistant.js';
import { 
    copyCode, 
    downloadCode, 
    downloadStandaloneHTML,
    toggleDownloadMenu 
} from './file-manager.js';
import { 
    toggleDocumentation, 
    updateHighlightFilter 
} from './documentation.js';
import { toggleFlowVisualization } from './flow-viz.js';
import { 
    changeTheme, 
    openThemeModal, 
    closeThemeModal, 
    applyCustomTheme 
} from './editor.js';
import { toggleFullscreen } from './utils.js';

// ========== GLOBAL STATE ==========

/**
 * Global state object containing game code and configuration
 */
window.gameState = {
    code: '',
    library: '',
    originalCode: '',
    isInitialized: false
};

// ========== EXPOSE FUNCTIONS TO WINDOW FOR INLINE HANDLERS ==========

// Editor functions
window.runEditedCode = runEditedCode;
window.resetCode = resetCode;
window.changeTheme = changeTheme;
window.openThemeModal = openThemeModal;
window.closeThemeModal = closeThemeModal;
window.applyCustomTheme = applyCustomTheme;
window.updateHighlightFilter = updateHighlightFilter;

// File management
window.copyCode = copyCode;
window.downloadCode = downloadCode;
window.downloadStandaloneHTML = downloadStandaloneHTML;
window.toggleDownloadMenu = toggleDownloadMenu;

// AI Chat
window.openAIChat = openAIChat;
window.closeAIChat = closeAIChat;
window.sendAIMessage = sendAIMessage;
window.sendQuickMessage = sendQuickMessage;
window.handleAIChatKeypress = handleAIChatKeypress;
window.stopGameControls = stopGameControls;

// Features
window.toggleDocumentation = toggleDocumentation;
window.toggleFlowVisualization = toggleFlowVisualization;
window.toggleFullscreen = toggleFullscreen;

// ========== INITIALIZATION ==========

/**
 * Load game code from session storage
 * Called on page load to retrieve generated game
 * 
 * @returns {Object} Object containing code and library, or null if not found
 */
function loadGameFromSession() {
    const code = sessionStorage.getItem('editedGameCode') || sessionStorage.getItem('gameCode');
    const library = sessionStorage.getItem('gameLibrary');

    if (!code || !library) {
        window.location.href = 'index.html';
        return null;
    }

    return { code, library };
}

/**
 * Initialize the application
 * Sets up editor, loads game code, and starts the game
 */
async function init() {
    console.log('🚀 Initializing games.random play interface...');

    // Load game from session
    const gameData = loadGameFromSession();
    if (!gameData) return;

    // Store in global state
    window.gameState.code = gameData.code;
    window.gameState.library = gameData.library;
    window.gameState.originalCode = gameData.code;

    // Update UI
    document.getElementById('libraryBadge').textContent = gameData.library.toUpperCase();

    try {
        // Initialize Monaco editor
        await initMonacoEditor(gameData.code, gameData.library);
        
        // Run the game
        runGame();

        // Mark as initialized
        window.gameState.isInitialized = true;
        
        console.log('✅ Initialization complete!');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showError('Failed to initialize editor. Please refresh the page.');
    }
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div style="
            color: #ff6b6b;
            padding: 40px;
            text-align: center;
            font-size: 1.1em;
        ">
            <div style="font-size: 3em; margin-bottom: 20px;">❌</div>
            <div>${message}</div>
            <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                ← Go Back
            </button>
        </div>
    `;
}

// ========== START APPLICATION ==========

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Close download menu when clicking outside
document.addEventListener('click', () => {
    const menu = document.getElementById('downloadMenu');
    if (menu) menu.style.display = 'none';
});

console.log('📦 Main module loaded');
