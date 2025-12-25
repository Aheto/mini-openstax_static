/**
 * Mini OpenStax Static — Shared Utilities (GitHub Pages Compatible)
 * No ES Modules — works with classic <script> tags
 */

window.MiniOpenStax = (function() {
  'use strict';

  // ======================
  // UTILITY FUNCTIONS
  // ======================

  function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatScore(score) {
    if (typeof score !== 'number') return '0%';
    return Math.round(score * 100) + '%';
  }

  function showLoading(el, msg) {
    if (el) el.innerHTML = `<div class="loading">${sanitizeHTML(msg || 'Loading...')}</div>`;
  }

  function showError(el, msg) {
    if (el) {
      const safeMsg = sanitizeHTML(msg || 'An error occurred');
      el.innerHTML = `<div class="error">${safeMsg}</div>`;
    }
  }

  // ======================
  // DATA LOADING (RELATIVE PATHS)
  // ======================

  async function loadChapter(chapterId) {
    // Resolve relative to current page (works from /student/chapter-1.html)
    const url = `../data/chapters/chapter-${chapterId}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Chapter ${chapterId} not found`);
    return res.json();
  }

  async function loadAnalytics(assignmentId) {
    // Resolve relative to current page (works from /instructor/analytics-1.html)
    const url = `../data/analytics/assignment-${assignmentId}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Analytics ${assignmentId} not found`);
    return res.json();
  }

  // ======================
  // LTI SIMULATION (CLIENT-ONLY)
  // ======================

  function handleLtiLaunch() {
    const urlParams = new URLSearchParams(window.location.search);
    const userRole = urlParams.get('user_role');
    const contextId = urlParams.get('context_id') || 'Algebra I';

    if (userRole === 'student' || userRole === 'instructor') {
      localStorage.setItem('user_role', userRole);
      localStorage.setItem('context_id', contextId);

      if (userRole === 'student') {
        window.location.href = 'student/chapter-1.html';
      } else {
        window.location.href = 'instructor/analytics-1.html';
      }
      return true;
    }
    return false;
  }

  function autoRedirectIfRoleSaved() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path.endsWith('/mini-openstax_static/')) {
      const savedRole = localStorage.getItem('user_role');
      if (savedRole === 'student') {
        window.location.href = 'student/chapter-1.html';
      } else if (savedRole === 'instructor') {
        window.location.href = 'instructor/analytics-1.html';
      }
    }
  }

  // ======================
  // PUBLIC API
  // ======================

  return {
    sanitizeHTML,
    formatScore,
    showLoading,
    showError,
    loadChapter,
    loadAnalytics,
    handleLtiLaunch,
    autoRedirectIfRoleSaved
  };
})();
