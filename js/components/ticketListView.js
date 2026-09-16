/* ==========================================================================
   ApexTicket - Ticket List View Component
   ========================================================================== */

import { store } from '../store.js';
import { calculateSLA, escapeHTML, formatDate, formatDateTime, formatTimeAgo } from '../utils/helpers.js';
import { INITIAL_COMPANIES, INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_DEPARTMENTS } from '../utils/seedData.js';

export function renderTicketListView(container) {
  const filteredTickets = store.getFilteredTickets();
  const filters = store.state.filters;
  const agents = store.state.agents;

  container.innerHTML = `
    <div class="view-header fade-in">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-list-check" style="color: var(--brand-primary)"></i> All Tickets Directory</h1>
        <div class="view-subtitle">Showing ${filteredTickets.length} tickets across dealership branches</div>
      </div>
      <div>
        <button id="btn-create-ticket-list" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> + Create New
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar fade-in">
      <div class="filter-group">
        
        <!-- Company Filter -->
        <select id="filter-company" class="form-select" style="width: auto;">
          <option value="all" ${filters.company === 'all' ? 'selected' : ''}>Client / Company: All</option>
          ${INITIAL_COMPANIES.map(c => `
            <option value="${c.toLowerCase()}" ${filters.company === c.toLowerCase() ? 'selected' : ''}>${c}</option>
          `).join('')}
        </select>

        <!-- Location Filter -->
        <select id="filter-location" class="form-select" style="width: auto;">
          <option value="all" ${filters.location === 'all' ? 'selected' : ''}>Location: All</option>
          ${INITIAL_LOCATIONS.map(loc => `
            <option value="${loc.toLowerCase()}" ${filters.location === loc.toLowerCase() ? 'selected' : ''}>${loc}</option>
          `).join('')}
        </select>

        <!-- Department Filter -->
        <select id="filter-department" class="form-select" style="width: auto;">
          <option value="all" ${filters.department === 'all' ? 'selected' : ''}>Department: All</option>
          ${INITIAL_DEPARTMENTS.map(d => `
            <option value="${d.toLowerCase()}" ${filters.department === d.toLowerCase() ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>

        <!-- Status Filter -->
        <select id="filter-status" class="form-select" style="width: auto;">
          <option value="all" ${filters.status === 'all' ? 'selected' : ''}>Status: All</option>
          <option value="open" ${filters.status === 'open' ? 'selected' : ''}>Open</option>
          <option value="in_progress" ${filters.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
          <option value="pending" ${filters.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="resolved" ${filters.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          <option value="closed" ${filters.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>

        <!-- Priority Filter -->
        <select id="filter-priority" class="form-select" style="width: auto;">
          <option value="all" ${filters.priority === 'all' ? 'selected' : ''}>Priority: All</option>
          <option value="urgent" ${filters.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
          <option value="high" ${filters.priority === 'high' ? 'selected' : ''}>High</option>
          <option value="medium" ${filters.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="low" ${filters.priority === 'low' ? 'selected' : ''}>Low</option>
        </select>

        <!-- Scope Filter -->
        <select id="filter-scope" class="form-select" style="width: auto;">
          <option value="all" ${filters.scope === 'all' ? 'selected' : ''}>Scope: All (Global)</option>
          <option value="internal" ${filters.scope === 'internal' ? 'selected' : ''}>Internal Scope</option>
          <option value="external" ${filters.scope === 'external' ? 'selected' : ''}>External Scope</option>
        </select>

        <!-- Category Filter -->
        <select id="filter-category" class="form-select" style="width: auto;">
          <option value="all" ${filters.category === 'all' ? 'selected' : ''}>Category: All</option>
          ${INITIAL_CATEGORIES.map(cat => `
            <option value="${cat.toLowerCase()}" ${filters.category === cat.toLowerCase() ? 'selected' : ''}>${cat}</option>
          `).join('')}
        </select>

        <!-- Assignee Filter -->
        <select id="filter-assignee" class="form-select" style="width: auto;">
          <option value="all" ${filters.assignee === 'all' ? 'selected' : ''}>Assignee: All</option>
          ${agents.map(a => `
            <option value="${a.id}" ${filters.assignee === a.id ? 'selected' : ''}>${a.name}</option>
          `).join('')}
        </select>
      </div>

      <button id="btn-reset-filters" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-rotate-left"></i> Reset Filters
      </button>
    </div>

    <!-- Tickets Table Container -->
    <div class="tickets-table-container fade-in">
      ${filteredTickets.length === 0 ? `
        <div class="empty-state">
          <i class="fa-solid fa-inbox"></i>
          <h3>No matching tickets found</h3>
          <p>Try adjusting your search criteria or clear active filters.</p>
        </div>
      ` : `
        <table class="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ticket Title</th>
              <th>Ticket Created By</th>
              <th>Created Date</th>
              <th>Category</th>
              <th>Client / Location</th>
              <th>Dept / Designation</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTickets.map(t => {
              const sla = calculateSLA(t);
              const createdByName = t.createdBy || (t.reporter ? t.reporter.name : 'Srinivas Theerthala');
              const avatarInitials = t.reporter?.avatar || createdByName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
              return `
                <tr class="ticket-row" data-id="${t.id}">
                  <td class="table-ticket-id">${t.id}</td>
                  <td>
                    <div class="table-ticket-title">${escapeHTML(t.title)}</div>
                    <div class="table-ticket-sub">
                      Contact: ${escapeHTML(t.contactNo || '9381036252')}
                      ${t.onBehalfOf ? ` • <span style="color: var(--text-dim);">On behalf of: ${escapeHTML(t.onBehalfOf)}</span>` : ''}
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div class="user-avatar" style="width: 28px; height: 28px; font-size: 0.72rem; background: var(--brand-primary); color: #ffffff; flex-shrink: 0; font-weight: 700;">${avatarInitials}</div>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">${escapeHTML(createdByName)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);"><i class="fa-regular fa-calendar-days" style="color: var(--brand-primary); margin-right: 4px;"></i>${formatDateTime(t.createdAt)}</span>
                      <span style="font-size: 0.72rem; color: var(--text-dim);">${formatTimeAgo(t.createdAt)}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-category" style="background: rgba(6, 182, 212, 0.12); color: #38bdf8; font-weight: 700;">${t.category}</span></td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: var(--brand-primary); font-weight: 700; width: fit-content;">${t.company || 'GEM Arena'}</span>
                      <span style="font-size: 0.75rem; color: var(--text-dim);"><i class="fa-solid fa-location-dot" style="font-size: 0.7rem; margin-right: 3px; color: var(--brand-primary);"></i> ${escapeHTML(t.location || 'Kondapur')}</span>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span class="badge badge-category" style="width: fit-content;">${t.department || 'IT'}</span>
                      <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${escapeHTML(t.designation || 'Executive')}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-priority-${t.priority.toLowerCase()}">${t.priority}</span></td>
                  <td><span class="badge badge-status-${t.status.toLowerCase().replace(' ', '_')}">${t.status}</span></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div class="user-avatar" style="width: 26px; height: 26px; font-size: 0.7rem;">${t.assignee ? t.assignee.avatar : '??'}</div>
                      <span style="font-size: 0.825rem; font-weight: 500;">${t.assignee ? t.assignee.name : 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: var(--brand-primary); font-weight: 700; font-size: 0.78rem; padding: 4px 8px; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 4px;">
                      <i class="fa-regular fa-calendar-check"></i> ${t.dueDate ? formatDate(t.dueDate) : 'Not set'}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#filter-company').addEventListener('change', (e) => store.setFilter('company', e.target.value));
  container.querySelector('#filter-location').addEventListener('change', (e) => store.setFilter('location', e.target.value));
  container.querySelector('#filter-department').addEventListener('change', (e) => store.setFilter('department', e.target.value));
  container.querySelector('#filter-status').addEventListener('change', (e) => store.setFilter('status', e.target.value));
  container.querySelector('#filter-priority').addEventListener('change', (e) => store.setFilter('priority', e.target.value));
  container.querySelector('#filter-scope').addEventListener('change', (e) => store.setFilter('scope', e.target.value));
  container.querySelector('#filter-category').addEventListener('change', (e) => store.setFilter('category', e.target.value));
  container.querySelector('#filter-assignee').addEventListener('change', (e) => store.setFilter('assignee', e.target.value));

  container.querySelector('#btn-reset-filters').addEventListener('click', () => store.resetFilters());
  container.querySelector('#btn-create-ticket-list').addEventListener('click', () => store.emit('openCreateTicketModal'));

  container.querySelectorAll('.ticket-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-id');
      store.emit('openTicketDetailModal', id);
    });
  });
}
