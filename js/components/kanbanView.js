/* ==========================================================================
   ApexTicket - Visual Drag-and-Drop Kanban View Component
   ========================================================================== */

import { store } from '../store.js';
import { calculateSLA, escapeHTML, showToast } from '../utils/helpers.js';

export function renderKanbanView(container) {
  const tickets = store.getFilteredTickets();
  const columns = [
    { key: 'Open', title: 'Open', icon: 'fa-folder-open', color: 'var(--status-open-text)' },
    { key: 'In Progress', title: 'In Progress', icon: 'fa-spinner', color: 'var(--status-in-progress-text)' },
    { key: 'Pending', title: 'Pending User', icon: 'fa-hourglass-start', color: 'var(--status-pending-text)' },
    { key: 'Resolved', title: 'Resolved / Closed', icon: 'fa-circle-check', color: 'var(--status-resolved-text)' }
  ];

  container.innerHTML = `
    <div class="view-header fade-in">
      <div class="view-title-group">
        <h1><i class="fa-solid fa-table-columns" style="color: var(--brand-primary)"></i> Visual Kanban Board</h1>
        <div class="view-subtitle">Drag and drop tickets between columns to update status instantly</div>
      </div>
      <div>
        <button id="btn-create-ticket-kanban" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> New Ticket
        </button>
      </div>
    </div>

    <!-- Kanban Grid -->
    <div class="kanban-board fade-in">
      ${columns.map(col => {
        const colTickets = tickets.filter(t => {
          if (col.key === 'Resolved') return t.status === 'Resolved' || t.status === 'Closed';
          return t.status === col.key;
        });

        return `
          <div class="kanban-column" data-status="${col.key}">
            <div class="kanban-column-header">
              <div class="kanban-column-title">
                <i class="fa-solid ${col.icon}" style="color: ${col.color}"></i>
                <span>${col.title}</span>
              </div>
              <span class="nav-count">${colTickets.length}</span>
            </div>

            <div class="kanban-cards-wrapper" data-status-drop="${col.key}">
              ${colTickets.map(t => {
                const sla = calculateSLA(t);
                return `
                  <div class="kanban-card" draggable="true" data-id="${t.id}">
                    <div class="kanban-card-meta">
                      <span class="table-ticket-id">${t.id}</span>
                      <span class="badge badge-priority-${t.priority.toLowerCase()}">${t.priority}</span>
                    </div>

                    <div class="kanban-card-title">${escapeHTML(t.title)}</div>

                    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                      <span class="badge badge-category">${t.category}</span>
                    </div>

                    <div class="kanban-card-footer">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <div class="user-avatar" style="width: 22px; height: 22px; font-size: 0.65rem;">${t.assignee ? t.assignee.avatar : '??'}</div>
                        <span>${t.assignee ? t.assignee.name.split(' ')[0] : 'Unassigned'}</span>
                      </div>

                      <span class="sla-pill ${sla.badgeClass}" style="font-size: 0.68rem; padding: 2px 7px;">
                        ${sla.text}
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach Kanban Drag-and-Drop Event Listeners
  const cards = container.querySelectorAll('.kanban-card');
  const dropZoneContainers = container.querySelectorAll('.kanban-cards-wrapper');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
      card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });

    card.addEventListener('click', (e) => {
      const id = card.getAttribute('data-id');
      store.emit('openTicketDetailModal', id);
    });
  });

  dropZoneContainers.forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.background = 'rgba(99, 102, 241, 0.08)';
      dropZone.style.borderRadius = 'var(--radius-md)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.background = 'transparent';
      const ticketId = e.dataTransfer.getData('text/plain');
      const targetStatus = dropZone.getAttribute('data-status-drop');

      if (ticketId && targetStatus) {
        store.updateTicketStatus(ticketId, targetStatus);
        showToast(`Ticket ${ticketId} status updated to ${targetStatus}`, 'success');
      }
    });
  });

  container.querySelector('#btn-create-ticket-kanban').addEventListener('click', () => {
    store.emit('openCreateTicketModal');
  });
}
