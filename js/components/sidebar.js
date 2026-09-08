/* ==========================================================================
   ApexTicket - Sidebar Component matching Reference UI Structure
   ========================================================================== */

import { store } from '../store.js';

export function renderSidebar(container) {
  const currentView = store.state.currentView;
  const currentFilter = store.state.activeNavFilter || 'all';
  const currentUser = store.state.currentUser || { name: 'Srinivas Theerthala', avatar: 'ST', roleTitle: 'Lead Client Admin' };
  const isAgent = store.state.currentRole === 'agent';

  container.innerHTML = `
    <div class="sidebar-menu">
      
      <!-- Top Level Item: Dashboard & Analytics -->
      <div class="nav-item ${currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard" style="margin-bottom: 0.5rem;">
        <div class="nav-item-content" style="font-weight: 600; font-size: 0.95rem;">
          <i class="fa-solid fa-chart-line" style="font-size: 1.1rem; color: var(--brand-primary);"></i>
          <span>Dashboard & Analytics</span>
        </div>
      </div>

      <!-- Section 1: TICKET OPERATIONS -->
      <div class="sidebar-section-header">
        <div style="display: flex; align-items: center;">
          <i class="fa-regular fa-folder-closed section-icon"></i>
          <span>TICKET OPERATIONS</span>
        </div>
        <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-dim);"></i>
      </div>

      <div class="sidebar-sub-group">
        <!-- Sub-item: Create New -->
        <div class="sidebar-sub-item ${currentView === 'create' ? 'active' : ''}" data-view="create">
          <span class="sub-bullet"></span>
          <i class="fa-regular fa-square-plus" style="font-size: 1rem; margin-right: 2px;"></i>
          <span>Create New</span>
        </div>

        <!-- Sub-item: All -->
        <div class="sidebar-sub-item ${currentView === 'tickets' && currentFilter === 'all' ? 'active' : ''}" data-view="tickets" data-filter="all">
          <span class="sub-bullet"></span>
          <i class="fa-regular fa-folder-open" style="font-size: 0.95rem; margin-right: 2px;"></i>
          <span>All</span>
        </div>

        <!-- Sub-item: Created By Me -->
        <div class="sidebar-sub-item ${currentView === 'tickets' && currentFilter === 'created_by_me' ? 'active' : ''}" data-view="tickets" data-filter="created_by_me">
          <span class="sub-bullet"></span>
          <i class="fa-regular fa-circle-user" style="font-size: 0.95rem; margin-right: 2px;"></i>
          <span>Created By Me</span>
        </div>
      </div>

      <!-- Section 2: MY ACTIONS (No Change Management) -->
      <div class="sidebar-section-header" style="margin-top: 1rem;">
        <div style="display: flex; align-items: center;">
          <i class="fa-regular fa-circle-user section-icon"></i>
          <span>MY ACTIONS</span>
        </div>
        <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-dim);"></i>
      </div>

      <div class="sidebar-sub-group">
        <!-- Sub-item: Pending Approvals -->
        <div class="sidebar-sub-item ${currentView === 'tickets' && currentFilter === 'pending_approvals' ? 'active' : ''}" data-view="tickets" data-filter="pending_approvals">
          <span class="sub-bullet"></span>
          <i class="fa-regular fa-clipboard" style="font-size: 0.95rem; margin-right: 2px;"></i>
          <span>Pending Approvals</span>
        </div>

        <!-- Sub-item: Assigned To Me -->
        <div class="sidebar-sub-item ${currentView === 'tickets' && currentFilter === 'assigned_to_me' ? 'active' : ''}" data-view="tickets" data-filter="assigned_to_me">
          <span class="sub-bullet"></span>
          <i class="fa-regular fa-circle-user" style="font-size: 0.95rem; margin-right: 2px;"></i>
          <span>Assigned To Me</span>
        </div>
      </div>

      <!-- Knowledge Base Section -->
      <div class="sidebar-section-header" style="margin-top: 1rem;">
        <div style="display: flex; align-items: center;">
          <i class="fa-solid fa-book-bookmark section-icon"></i>
          <span>RESOURCES</span>
        </div>
      </div>

      <div class="sidebar-sub-group">
        <div class="sidebar-sub-item ${currentView === 'kb' ? 'active' : ''}" data-view="kb">
          <span class="sub-bullet"></span>
          <i class="fa-solid fa-book" style="font-size: 0.9rem; margin-right: 2px;"></i>
          <span>Knowledge Base</span>
        </div>
      </div>

    </div>

    <!-- Bottom User Info -->
    <div class="sidebar-user" style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="user-avatar" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #fff; font-weight: 800;">${currentUser.avatar || 'ST'}</div>
        <div class="user-info">
          <div class="user-name" style="font-weight: 700;">${currentUser.name || 'Srinivas Theerthala'}</div>
          <div class="user-role" style="font-size: 0.72rem; color: var(--text-dim);">${currentUser.roleTitle || 'Lead Client Admin'}</div>
        </div>
      </div>
      <button id="btn-sidebar-logout" title="Sign Out" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-size: 0.95rem;">
        <i class="fa-solid fa-power-off"></i>
      </button>
    </div>
  `;

  // Bind Navigation Clicks
  container.querySelectorAll('[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      const filter = item.getAttribute('data-filter');

      store.state.activeNavFilter = filter || 'all';

      if (view === 'create') {
        store.setView('create');
      } else if (view === 'tickets') {
        if (filter === 'pending_approvals') {
          store.setFilter('status', 'all');
          store.state.filters.requireApproverCheck = true;
        } else if (filter === 'assigned_to_me') {
          const activeAgent = store.state.agents[0].id;
          store.setFilter('assignee', activeAgent);
        } else if (filter === 'created_by_me') {
          store.resetFilters();
        } else {
          store.resetFilters();
        }
        store.setView('tickets');
      } else if (view) {
        store.setView(view);
      }
    });
  });

  const logoutBtn = container.querySelector('#btn-sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }
}
