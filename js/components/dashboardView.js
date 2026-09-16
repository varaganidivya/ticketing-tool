/* ==========================================================================
   ApexTicket - Premium Executive Dashboard Component
   ========================================================================== */

import { store } from '../store.js';
import { calculateSLA, escapeHTML, formatDateTime, formatTimeAgo } from '../utils/helpers.js';
import { INITIAL_CATEGORIES, INITIAL_SUPPORT_TEAMS } from '../utils/seedData.js';

export function renderDashboardView(container) {
  const tickets = store.getTickets();
  const agents = store.state.agents;

  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const urgent = tickets.filter(t => t.priority === 'Urgent' && (t.status === 'Open' || t.status === 'In Progress')).length;
  const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const slaBreached = tickets.filter(t => calculateSLA(t).status === 'breached').length;
  const slaCompliance = total > 0 ? Math.round(((total - slaBreached) / total) * 100) : 100;

  // Dynamically calculate category breakdown based on existing ticket categories
  const activeCategories = Array.from(new Set([...INITIAL_CATEGORIES, ...tickets.map(t => t.category)])).slice(0, 6);
  const categoryCounts = activeCategories.map(cat => ({
    name: cat,
    count: tickets.filter(t => t.category === cat).length
  }));

  const maxCatCount = Math.max(...categoryCounts.map(c => c.count), 1);

  // Support Team Load Calculation
  const teamStats = INITIAL_SUPPORT_TEAMS.map(team => {
    const teamTickets = tickets.filter(t => t.supportTeam === team);
    const teamResolved = teamTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    return {
      name: team,
      total: teamTickets.length,
      resolved: teamResolved,
      active: teamTickets.length - teamResolved
    };
  });

  container.innerHTML = `
    <div class="view-header fade-in">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-chart-pie" style="color: var(--brand-primary)"></i> Executive Support Dashboard</h1>
        <div class="view-subtitle">Real-time IT helpdesk performance metrics, SLA compliance & team load</div>
      </div>
    </div>

    <!-- Stat KPI Cards Grid -->
    <div class="stats-grid fade-in">
      <div class="stat-card stat-card-clickable" data-filter-type="all" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" title="Click to view All Tickets">
        <div class="stat-icon-wrapper stat-icon-indigo">
          <i class="fa-solid fa-ticket"></i>
        </div>
        <div>
          <div class="stat-value">${total}</div>
          <div class="stat-label">Total Tickets</div>
          <div style="font-size: 0.72rem; color: #818cf8; margin-top: 2px;"><i class="fa-solid fa-arrow-trend-up"></i> System Volume</div>
        </div>
      </div>

      <div class="stat-card stat-card-clickable" data-filter-type="active" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" title="Click to view Active Open Tickets">
        <div class="stat-icon-wrapper stat-icon-cyan">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <div>
          <div class="stat-value">${open + inProgress}</div>
          <div class="stat-label">Active / Open</div>
          <div style="font-size: 0.72rem; color: #38bdf8; margin-top: 2px;">${open} Open • ${inProgress} In Progress</div>
        </div>
      </div>

      <div class="stat-card stat-card-clickable" data-filter-type="urgent" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" title="Click to view Urgent Priority Tickets">
        <div class="stat-icon-wrapper stat-icon-rose">
          <i class="fa-solid fa-fire"></i>
        </div>
        <div>
          <div class="stat-value">${urgent}</div>
          <div class="stat-label">Urgent Priority</div>
          <div style="font-size: 0.72rem; color: #f87171; margin-top: 2px;">Requires immediate response</div>
        </div>
      </div>

      <div class="stat-card stat-card-clickable" data-filter-type="all" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" title="Click to view SLA Compliance">
        <div class="stat-icon-wrapper stat-icon-emerald">
          <i class="fa-solid fa-shield-check"></i>
        </div>
        <div>
          <div class="stat-value">${slaCompliance}%</div>
          <div class="stat-label">SLA Compliance Rate</div>
          <div style="font-size: 0.72rem; color: #4ade80; margin-top: 2px;">Target: &gt;95% Target SLA</div>
        </div>
      </div>
    </div>

    <!-- Charts & Category Breakdown Grid -->
    <div class="dashboard-charts-grid fade-in">
      
      <!-- Category Volume Distribution Bar Chart -->
      <div class="chart-card">
        <div class="card-title-bar">
          <div>
            <h3><i class="fa-solid fa-chart-bar" style="color: var(--brand-accent)"></i> Tickets by Category</h3>
            <div class="view-subtitle" style="margin-top: 2px;">Live category volume distribution across tickets</div>
          </div>
          <span class="badge badge-category" style="font-size: 0.75rem;">Realtime</span>
        </div>
        <div class="chart-container">
          ${categoryCounts.map(cat => {
            const pct = Math.round((cat.count / maxCatCount) * 100);
            return `
              <div class="bar-column bar-column-clickable" data-category="${escapeHTML(cat.name)}" style="cursor: pointer;" title="Click to filter by ${escapeHTML(cat.name)}">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--brand-primary);">${cat.count}</div>
                <div class="bar-fill" style="height: ${Math.max(pct, 12)}%;"></div>
                <div class="bar-label" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 70px;">${escapeHTML(cat.name)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Support Team Load & Performance Grid -->
      <div class="chart-card">
        <div class="card-title-bar">
          <h3><i class="fa-solid fa-users-gear" style="color: #38bdf8"></i> Support Teams Breakdown</h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.25rem;">
          ${teamStats.map(st => `
            <div class="team-stat-row" data-team="${escapeHTML(st.name)}" style="cursor: pointer; padding: 4px; border-radius: 6px; transition: background 0.15s ease;" title="Click to view ${escapeHTML(st.name)} tickets">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.825rem;">
                <span style="font-weight: 600; color: var(--text-main);"><i class="fa-solid fa-shield-halved" style="color: var(--brand-primary); font-size: 0.75rem; margin-right: 4px;"></i> ${escapeHTML(st.name)}</span>
                <span style="color: var(--text-dim); font-size: 0.75rem; font-family: monospace;">${st.total} ticket(s)</span>
              </div>
              <div style="width: 100%; background: var(--bg-input); height: 7px; border-radius: 4px; overflow: hidden;">
                <div style="width: ${total > 0 ? Math.max((st.total / total) * 100, 10) : 0}%; background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%); height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>

    <!-- Active Tickets Priority Feed -->
    <div class="chart-card fade-in">
      <div class="card-title-bar">
        <div>
          <h3><i class="fa-solid fa-clock-rotate-left" style="color: #f59e0b;"></i> High Attention Tickets</h3>
          <div class="view-subtitle" style="margin-top: 2px;">Tickets requiring action or pending resolution</div>
        </div>
        <button id="btn-view-all-tickets" class="btn btn-ghost btn-sm">View All Tickets <i class="fa-solid fa-arrow-right"></i></button>
      </div>

      <div class="tickets-table-container">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Support Team</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA Status</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.slice(0, 6).map(t => {
              const sla = calculateSLA(t);
              return `
                <tr class="dashboard-ticket-row" data-id="${t.id}" style="cursor: pointer;">
                  <td class="table-ticket-id">${t.id}</td>
                  <td>
                    <div class="table-ticket-title">${escapeHTML(t.title)}</div>
                    <div class="table-ticket-sub">
                      Created by <strong style="color: var(--text-main);">${escapeHTML(t.reporter ? t.reporter.name : 'Unknown')}</strong> on <span style="color: var(--text-main); font-weight: 600;">${formatDateTime(t.createdAt)}</span> (${formatTimeAgo(t.createdAt)}) • Client: ${escapeHTML(t.company || 'GEM Arena')}
                    </div>
                  </td>
                  <td><span class="badge badge-category" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border-color: rgba(56, 189, 248, 0.25);">${escapeHTML(t.supportTeam || 'sai Krishna Support Team')}</span></td>
                  <td><span class="badge badge-category">${escapeHTML(t.category)}</span></td>
                  <td><span class="badge badge-priority-${t.priority.toLowerCase()}">${t.priority}</span></td>
                  <td><span class="badge badge-status-${t.status.toLowerCase().replace(' ', '_')}">${t.status}</span></td>
                  <td>
                    <span class="sla-pill ${sla.badgeClass}">
                      <i class="fa-solid ${sla.icon}"></i> ${sla.text}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Event Listeners
  const viewAllBtn = container.querySelector('#btn-view-all-tickets');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      store.resetFilters();
      store.setView('tickets');
    });
  }

  // Stat Card Clicks
  container.querySelectorAll('.stat-card-clickable').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-filter-type');
      store.resetFilters();
      if (type === 'active') {
        store.setFilter('status', 'open');
      } else if (type === 'urgent') {
        store.setFilter('priority', 'urgent');
      }
      store.setView('tickets');
    });
  });

  // Category Bar Clicks
  container.querySelectorAll('.bar-column-clickable').forEach(bar => {
    bar.addEventListener('click', () => {
      const cat = bar.getAttribute('data-category');
      store.resetFilters();
      if (cat) {
        store.setFilter('category', cat.toLowerCase());
      }
      store.setView('tickets');
    });
  });

  // Support Team Row Clicks
  container.querySelectorAll('.team-stat-row').forEach(row => {
    row.addEventListener('click', () => {
      const team = row.getAttribute('data-team');
      store.resetFilters();
      if (team) {
        store.setSearchQuery(team);
      }
      store.setView('tickets');
    });
  });

  container.querySelectorAll('.dashboard-ticket-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-id');
      store.emit('openTicketDetailModal', id);
    });
  });
}

