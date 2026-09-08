/* ==========================================================================
   ApexTicket - Header Component
   ========================================================================== */

import { store } from '../store.js';
import { showToast } from '../utils/helpers.js';

export function renderHeader(container) {
  const isAgent = store.state.currentRole === 'agent';
  const isDark = store.state.currentTheme === 'dark';
  const isGlobal = store.state.globalAccess;

  container.innerHTML = `
    <div class="header-brand" id="global-brand-link" style="cursor: pointer; display: flex; align-items: center; gap: 10px;" title="Global Link - Navigate to Global Dashboard (Click anytime)">
      <div class="brand-logo" style="background: linear-gradient(135deg, var(--brand-primary) 0%, #38bdf8 100%); width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);">
        <span style="font-size: 1.3rem; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">G</span>
      </div>
      <div class="brand-title" style="font-weight: 800; font-size: 1.25rem;">
        IT<span style="color: var(--brand-primary);">Tracker</span>
        <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--brand-primary); font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 4px;">GLOBAL</span>
      </div>
    </div>

    <div class="header-search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="global-search-input" placeholder="Global Search (tickets, ID, category)... Press '/' to focus" value="${store.state.searchQuery}">
    </div>

    <div class="header-actions">
      <!-- Global Access Toggle Button -->
      <button id="global-access-btn" class="btn btn-sm ${isGlobal ? 'btn-primary' : 'btn-secondary'}" style="font-weight: 700; gap: 6px;" title="Global Access Mode - Click to switch global access working anywhere & anytime">
        <i class="fa-solid fa-earth-americas" style="font-size: 0.9rem;"></i>
        <span>Global Access: ${isGlobal ? 'ON' : 'OFF'}</span>
      </button>

      <!-- Theme Toggle -->
      <button id="theme-toggle-btn" class="btn-icon" title="Toggle Light/Dark Theme">
        <i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}"></i>
      </button>

      <!-- Logout Button -->
      <button id="logout-btn-header" class="btn-icon" title="Sign Out" style="color: #ef4444;">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  `;

  // --- Event Listeners ---
  const brandLink = container.querySelector('#global-brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', () => {
      store.resetFilters();
      store.setView('dashboard');
      showToast('Navigated to Global Dashboard', 'info');
    });
  }

  const globalAccessBtn = container.querySelector('#global-access-btn');
  if (globalAccessBtn) {
    globalAccessBtn.addEventListener('click', () => {
      store.toggleGlobalAccess();
      const statusStr = store.state.globalAccess ? 'ENABLED (All Locations & Scope unlocked)' : 'DISABLED (Filtered view)';
      showToast(`Global Access Mode is now ${statusStr}`, store.state.globalAccess ? 'success' : 'warning');
    });
  }

  const searchInput = container.querySelector('#global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.setSearchQuery(e.target.value);
      if (store.state.currentView !== 'tickets' && store.state.currentView !== 'kanban') {
        store.setView('tickets');
      }
    });
  }

  // Shortcut key '/'
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  const themeBtn = container.querySelector('#theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      store.toggleTheme();
    });
  }

  const logoutBtn = container.querySelector('#logout-btn-header');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }
}

