/* ==========================================================================
   ApexTicket - Knowledge Base View Component
   ========================================================================== */

import { store } from '../store.js';
import { escapeHTML } from '../utils/helpers.js';

export function renderKbView(container) {
  const articles = store.state.kbArticles;

  container.innerHTML = `
    <div class="kb-hero fade-in">
      <h2><i class="fa-solid fa-book-bookmark" style="color: var(--brand-primary)"></i> Knowledge Base & Self-Service</h2>
      <div class="view-subtitle">Search our curated guides and solve common IT & software issues instantly</div>
      
      <div class="kb-search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="kb-search-input" placeholder="Search VPN setup, MFA, password reset, hardware policies...">
      </div>
    </div>

    <!-- Category Grids -->
    <div class="kb-categories-grid fade-in">
      ${articles.map(art => `
        <div class="kb-card">
          <div class="kb-card-header">
            <div class="kb-icon">
              <i class="fa-solid ${art.icon}"></i>
            </div>
            <div>
              <h3 style="font-size: 1rem; font-weight: 700;">${escapeHTML(art.title)}</h3>
              <span class="badge badge-category" style="margin-top: 4px;">${art.category}</span>
            </div>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.4;">
            ${escapeHTML(art.summary)}
          </p>

          <div style="font-size: 0.8rem; color: var(--text-dim); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
            <span><i class="fa-solid fa-eye"></i> ${art.views} views</span>
            <span><i class="fa-solid fa-thumbs-up"></i> ${art.helpful} found helpful</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const searchInput = container.querySelector('#kb-search-input');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    container.querySelectorAll('.kb-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'block' : 'none';
    });
  });
}
