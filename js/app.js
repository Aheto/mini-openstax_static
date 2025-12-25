/**
 * Mini OpenStax Static — Shared JavaScript Utilities
 * For GitHub Pages deployment (no backend)
 */

// ======================
// UTILITY FUNCTIONS
// ======================

/**
 * Sanitize HTML string to prevent XSS (basic)
 * @param {string} str - Input string
 * @returns {string} Safe HTML string
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format a decimal score as a percentage string
 * @param {number} score - Value between 0.0 and 1.0
 * @returns {string}
 */
export function formatScore(score) {
  if (typeof score !== 'number') return '0%';
  return Math.round(score * 100) + '%';
}

/**
 * Show loading message in a container
 * @param {HTMLElement} el
 * @param {string} [msg='Loading...']
 */
export function showLoading(el, msg = 'Loading...') {
  if (el) el.innerHTML = `<div class="loading">${sanitizeHTML(msg)}</div>`;
}

/**
 * Show error message in a container
 * @param {HTMLElement} el
 * @param {string} msg
 */
export function showError(el, msg) {
  if (el) {
    const safeMsg = sanitizeHTML(msg || 'An error occurred');
    el.innerHTML = `<div class="error">${safeMsg}</div>`;
  }
}

// ======================
// STATIC DATA CLIENT (NO BACKEND)
// ======================

/**
 * Load chapter data from static JSON
 * @param {string} chapterId - e.g., '1'
 * @returns {Promise<Object>}
 */
/ ✅ CORRECT: Works on any GitHub Pages subpath
export async function loadChapter(chapterId) {
  // Resolve relative to current page, not root
  const url = new URL(`../data/chapters/chapter-${chapterId}.json`, import.meta.url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Chapter ${chapterId} not found`);
  }
  return response.json();
}

/**
 * Load analytics data from static JSON
 * @param {string} assignmentId - e.g., '1'
 * @returns {Promise<Object>}
 */
export async function loadAnalytics(assignmentId) {
  const response = await fetch(`/data/analytics/assignment-${assignmentId}.json`);
  if (!response.ok) {
    throw new Error(`Analytics for assignment ${assignmentId} not found`);
  }
  return response.json();
}

// ======================
// LTI SIMULATION (CLIENT-SIDE ONLY)
// ======================

/**
 * Handle simulated LTI launch via URL params
 * Redirects to role-specific page
 */
export function handleLtiLaunch() {
  const urlParams = new URLSearchParams(window.location.search);
  const userRole = urlParams.get('user_role');
  const contextId = urlParams.get('context_id') || 'Algebra I';

  if (userRole === 'student' || userRole === 'instructor') {
    // Save to localStorage for session persistence
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('context_id', contextId);

    // Redirect
    if (userRole === 'student') {
      window.location.href = '/student/chapter-1.html';
    } else {
      window.location.href = '/instructor/analytics-1.html';
    }
    return true;
  }
  return false;
}

/**
 * Auto-redirect homepage if role is saved
 */
export function autoRedirectIfRoleSaved() {
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const savedRole = localStorage.getItem('user_role');
    if (savedRole === 'student') {
      window.location.href = '/student/chapter-1.html';
    } else if (savedRole === 'instructor') {
      window.location.href = '/instructor/analytics-1.html';
    }
  }
}

// ======================
// AUTO-INIT FOR HOMEPAGE
// ======================

// Run on homepage or /lti/launch
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const isLtiPage = window.location.pathname === '/lti/launch';
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html';

    if (isLtiPage) {
      handleLtiLaunch();
    } else if (isHomePage) {
      autoRedirectIfRoleSaved();
    }
  });
}
