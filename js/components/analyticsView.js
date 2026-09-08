/* ==========================================================================
   ApexTicket - Analytics & Metrics View Component
   ========================================================================== */

import { store } from '../store.js';

export function renderAnalyticsView(container) {
  const agents = store.state.agents;
  const tickets = store.getTickets();

  container.innerHTML = `
    <div class="view-header fade-in">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-chart-line" style="color: var(--brand-primary)"></i> Analytics & Agent Leaderboard</h1>
        <div class="view-subtitle">Detailed support team performance, resolution efficiency, and CSAT breakdown</div>
      </div>
    </div>

    <!-- Analytics Top Cards -->
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-indigo">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <div class="stat-value">14 min</div>
          <div class="stat-label">Avg First Response Time</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-cyan">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div>
          <div class="stat-value">2.4 hrs</div>
          <div class="stat-label">Avg Resolution Time</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-emerald">
          <i class="fa-solid fa-star"></i>
        </div>
        <div>
          <div class="stat-value">4.9 / 5.0</div>
          <div class="stat-label">CSAT Satisfaction Score</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-amber">
          <i class="fa-solid fa-bullseye"></i>
        </div>
        <div>
          <div class="stat-value">96.4%</div>
          <div class="stat-label">First Contact Resolution</div>
        </div>
      </div>
    </div>

    <!-- Agent Leaderboard Table -->
    <div class="chart-card fade-in">
      <div class="card-title-bar">
        <h3><i class="fa-solid fa-trophy" style="color: #f59e0b"></i> Support Agent Performance Leaderboard</h3>
      </div>

      <div class="tickets-table-container">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Department</th>
              <th>Assigned Tickets</th>
              <th>Resolved Count</th>
              <th>Avg Response</th>
              <th>CSAT Rating</th>
            </tr>
          </thead>
          <tbody>
            ${agents.map((agent, index) => {
              const assigned = tickets.filter(t => t.assignee && t.assignee.id === agent.id).length;
              const resolved = tickets.filter(t => t.assignee && t.assignee.id === agent.id && (t.status === 'Resolved' || t.status === 'Closed')).length;
              const csat = (4.7 + (index % 3) * 0.1).toFixed(1);

              return `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">${agent.avatar}</div>
                      <div>
                        <div style="font-weight: 700;">${agent.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-dim);">${agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-category">${agent.department}</span></td>
                  <td style="font-weight: 700; font-family: monospace;">${assigned}</td>
                  <td style="font-weight: 700; color: #22c55e; font-family: monospace;">${resolved}</td>
                  <td>${12 + index * 3} mins</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 4px; color: #f59e0b; font-weight: 700;">
                      <i class="fa-solid fa-star"></i> ${csat}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
