/**
 * games.random - Utility Functions
 * 
 * Common utility functions including notifications, fullscreen toggle,
 * and helper methods used across modules.
 * 
 * @module utils
 * @author Shayan Mazahir, Mohammad Samin, Rayyan Moosani
 * @license GPL-3.0-or-later
 */

/**
 * Show notification toast
 * Displays a temporary notification message
 * 
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'info')
 * @param {number} duration - How long to show (milliseconds)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : type === 'error' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(100, 100, 100, 0.2)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 255, 136, 0.5)' : type === 'error' ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
        border-radius: 8px;
        color: #e0e0e0;
        font-size: 0.9em;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Toggle fullscreen mode for game container
 * Handles cross-browser fullscreen API
 */
export function toggleFullscreen() {
    const gamePanel = document.getElementById('gamePanel');
    if (!gamePanel) {
        console.error('Game panel not found');
        return;
    }

    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (gamePanel.requestFullscreen) {
            gamePanel.requestFullscreen();
        } else if (gamePanel.webkitRequestFullscreen) {
            gamePanel.webkitRequestFullscreen();
        } else if (gamePanel.msRequestFullscreen) {
            gamePanel.msRequestFullscreen();
        }
        console.log('📺 Entering fullscreen mode');
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        console.log('📺 Exiting fullscreen mode');
    }
}

/**
 * Show error message in game container
 * 
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return;

    gameContainer.innerHTML = `
        <div style="
            color: #ff6b6b;
            padding: 40px;
            text-align: center;
            font-size: 1.1em;
        ">
            <div style="font-size: 3em; margin-bottom: 20px;">❌</div>
            <div>${message}</div>
        </div>
    `;
}

/**
 * Debounce function calls
 * Limits how often a function can be called
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format timestamp to readable string
 * 
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

/**
 * Generate unique ID
 * 
 * @returns {string} Unique identifier
 */
export function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if element is in viewport
 * 
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Escape HTML to prevent XSS
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== ADD CSS ANIMATIONS IF NOT IN STYLESHEET ==========

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== MODULE LOGGING ==========

console.log('📦 Utils module loaded');
