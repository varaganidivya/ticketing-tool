/* ==========================================================================
   ApexTicket - Ticket Detail Modal Drawer Component
   ========================================================================== */

import { store } from '../store.js';
import { calculateSLA, escapeHTML, formatDateTime, formatTimeAgo, showToast } from '../utils/helpers.js';
import { CANNED_RESPONSES } from '../utils/seedData.js';

export function renderTicketDetailModal(modalContainer, ticketId) {
  const ticket = store.getTicketById(ticketId);
  if (!ticket) return;

  const isAgent = store.state.currentRole === 'agent';
  const sla = calculateSLA(ticket);
  const agents = store.state.agents;

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="detail-modal-overlay">
      <div class="modal-card" style="max-width: 920px; height: 85vh;">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="table-ticket-id" style="font-size: 1.1rem;">${ticket.id}</span>
            <span class="badge badge-status-${ticket.status.toLowerCase().replace(' ', '_')}">${ticket.status}</span>
            <span class="badge badge-priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span>
            <span class="badge badge-category">${ticket.category}</span>
          </div>

          <button class="modal-close" id="btn-close-modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="modal-body">
          <div class="ticket-detail-grid">
            
            <!-- Left Column: Main Timeline & Conversation -->
            <div>
              <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem; line-height: 1.3;">${escapeHTML(ticket.title)}</h2>
              
              <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.25rem;">
                <span>Reported by <strong>${escapeHTML(ticket.reporter.name)}</strong> (${ticket.reporter.email})</span>
                <span>•</span>
                <span>Created ${formatTimeAgo(ticket.createdAt)}</span>
              </div>

              <!-- Ticket Initial Description Box -->
              <div class="timeline-content-box" style="margin-bottom: 1.5rem; background: var(--bg-input);">
                <div class="timeline-item-header">
                  <span class="timeline-author">${escapeHTML(ticket.reporter.name)} (Original Issue)</span>
                  <span class="timeline-time">${formatTimeAgo(ticket.createdAt)}</span>
                </div>
                <div class="timeline-body">${escapeHTML(ticket.description)}</div>
              </div>

              <!-- Activity Timeline Feed -->
              <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-comments" style="color: var(--brand-primary)"></i> Conversation Activity
              </h4>

              <div class="timeline-feed">
                ${(ticket.comments || []).map(c => {
                  if (c.isPrivate && !isAgent) return ''; // Hide internal notes from customer mode
                  return `
                    <div class="timeline-item">
                      <div class="timeline-avatar" style="${c.isAgent ? 'background: var(--brand-primary)' : 'background: #06b6d4'}">${c.avatar}</div>
                      <div class="timeline-content-box ${c.isPrivate ? 'internal-note' : ''}">
                        <div class="timeline-item-header">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="timeline-author">${escapeHTML(c.author)}</span>
                            ${c.isPrivate ? '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;"><i class="fa-solid fa-lock"></i> Internal Note</span>' : ''}
                          </div>
                          <span class="timeline-time">${c.timestamp}</span>
                        </div>
                        <div class="timeline-body">${escapeHTML(c.text)}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Response Input Box -->
              <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                ${isAgent ? `
                  <div class="canned-responses">
                    <span style="font-size: 0.75rem; color: var(--text-dim); align-self: center; font-weight: 600;">Quick Responses:</span>
                    ${CANNED_RESPONSES.map((cr, idx) => `
                      <button class="btn btn-ghost btn-sm canned-btn" data-idx="${idx}">${cr.label}</button>
                    `).join('')}
                  </div>
                ` : ''}

                <div class="form-group" style="margin-bottom: 0.75rem;">
                  <textarea id="comment-text-input" class="form-textarea" placeholder="${isAgent ? 'Type a reply to customer or add private note...' : 'Type your reply here...'}" style="min-height: 80px;"></textarea>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between;">
                  ${isAgent ? `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.825rem; color: #f59e0b; cursor: pointer; font-weight: 600;">
                      <input type="checkbox" id="chk-internal-note">
                      <span><i class="fa-solid fa-lock"></i> Make Private Agent Note</span>
                    </label>
                  ` : '<div></div>'}

                  <button id="btn-post-comment" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-paper-plane"></i> Post Response
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Column: Sidebar Metadata Controls -->
            <div style="background: var(--bg-input); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1.25rem; height: fit-content;">
              
              <!-- SLA Widget -->
              <div>
                <label class="form-label"><i class="fa-solid fa-clock"></i> SLA Target</label>
                <div style="margin-top: 4px;">
                  <span class="sla-pill ${sla.badgeClass}" style="font-size: 0.85rem;">
                    <i class="fa-solid ${sla.icon}"></i> ${sla.text}
                  </span>
                </div>
              </div>

              <!-- Location & Dept Info -->
              <div style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px; font-size: 0.825rem;">
                <div><strong style="color: var(--text-dim);"><i class="fa-solid fa-user-pen" style="color: var(--brand-primary); margin-right: 4px;"></i>Ticket Created By:</strong> <span style="color: var(--text-main); font-weight: 700; font-size: 0.875rem;">${escapeHTML(ticket.createdBy || (ticket.reporter ? ticket.reporter.name : 'Srinivas Theerthala'))}</span></div>
                <div><strong style="color: var(--text-dim);"><i class="fa-regular fa-calendar-days" style="color: var(--brand-primary); margin-right: 4px;"></i>Created Date:</strong> <span style="color: var(--text-main); font-weight: 600;">${formatDateTime(ticket.createdAt)}</span> <span style="color: var(--text-dim); font-size: 0.75rem;">(${formatTimeAgo(ticket.createdAt)})</span></div>
                ${ticket.onBehalfOf ? `<div><strong style="color: var(--text-dim);">On Behalf Of:</strong> <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(ticket.onBehalfOf)}</span></div>` : ''}
                <div><strong style="color: var(--text-dim);">Location:</strong> <span style="color: var(--text-main); font-weight: 600;"><i class="fa-solid fa-location-dot" style="color: var(--brand-primary); margin-right: 4px;"></i>${escapeHTML(ticket.location || 'Kondapur')}</span></div>
                <div><strong style="color: var(--text-dim);">Department:</strong> <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(ticket.department || 'IT')}</span></div>
                <div><strong style="color: var(--text-dim);">Designation:</strong> <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(ticket.designation || 'Executive')}</span></div>
                <div><strong style="color: var(--text-dim);">Support Team:</strong> <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(ticket.supportTeam || 'sai Krishna')}</span></div>
              </div>

              <!-- Status Control -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Status</label>
                <select id="detail-status-select" class="form-select">
                  <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                  <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Pending" ${ticket.status === 'Pending' ? 'selected' : ''}>Pending User</option>
                  <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                  <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
              </div>

              <!-- Priority Control -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Priority</label>
                <select id="detail-priority-select" class="form-select">
                  <option value="Low" ${ticket.priority === 'Low' ? 'selected' : ''}>Low</option>
                  <option value="Medium" ${ticket.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="High" ${ticket.priority === 'High' ? 'selected' : ''}>High</option>
                  <option value="Urgent" ${ticket.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
                </select>
              </div>

              <!-- Assignee Control -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Assignee</label>
                <select id="detail-assignee-select" class="form-select">
                  <option value="">Unassigned</option>
                  ${agents.map(a => `
                    <option value="${a.id}" ${ticket.assignee && ticket.assignee.id === a.id ? 'selected' : ''}>${a.name}</option>
                  `).join('')}
                </select>
              </div>

              <!-- CSAT Rating Component if Resolved -->
              ${(ticket.status === 'Resolved' || ticket.status === 'Closed') ? `
                <div style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
                  <label class="form-label">Customer Satisfaction (CSAT)</label>
                  <div id="csat-rating-stars" style="display: flex; gap: 6px; margin-top: 6px; font-size: 1.25rem; color: #f59e0b; cursor: pointer;">
                    ${[1, 2, 3, 4, 5].map(star => `
                      <i class="fa-solid fa-star ${star <= (ticket.rating || 0) ? '' : 'fa-regular'}" data-star="${star}"></i>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  // Attach Modal Listeners
  const close = () => {
    modalContainer.innerHTML = '';
    if (window.location.hash.startsWith('#ticket/')) {
      window.location.hash = `#${store.state.currentView || 'tickets'}`;
    }
  };

  modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
  modalContainer.querySelector('#detail-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal-overlay') close();
  });

  // Post Comment Action
  const textarea = modalContainer.querySelector('#comment-text-input');
  const postBtn = modalContainer.querySelector('#btn-post-comment');
  postBtn.addEventListener('click', () => {
    const val = textarea.value.trim();
    if (!val) return;
    const isPrivate = isAgent && modalContainer.querySelector('#chk-internal-note')?.checked;
    store.addComment(ticket.id, val, isPrivate);
    showToast('Response posted successfully', 'success');
    renderTicketDetailModal(modalContainer, ticket.id);
  });

  // Canned Responses fill
  modalContainer.querySelectorAll('.canned-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (CANNED_RESPONSES[idx]) {
        textarea.value = CANNED_RESPONSES[idx].text;
      }
    });
  });

  // Controls Event Binding
  modalContainer.querySelector('#detail-status-select').addEventListener('change', (e) => {
    store.updateTicketStatus(ticket.id, e.target.value);
    showToast(`Status updated to ${e.target.value}`, 'info');
    renderTicketDetailModal(modalContainer, ticket.id);
  });

  modalContainer.querySelector('#detail-priority-select').addEventListener('change', (e) => {
    store.updateTicketPriority(ticket.id, e.target.value);
    showToast(`Priority updated to ${e.target.value}`, 'info');
    renderTicketDetailModal(modalContainer, ticket.id);
  });

  modalContainer.querySelector('#detail-assignee-select').addEventListener('change', (e) => {
    store.updateTicketAssignee(ticket.id, e.target.value);
    showToast(`Assignee updated`, 'info');
    renderTicketDetailModal(modalContainer, ticket.id);
  });

  // Rating Stars
  const starsContainer = modalContainer.querySelector('#csat-rating-stars');
  if (starsContainer) {
    starsContainer.querySelectorAll('.fa-star').forEach(starEl => {
      starEl.addEventListener('click', () => {
        const starVal = parseInt(starEl.getAttribute('data-star'));
        store.rateTicket(ticket.id, starVal);
        showToast(`Thank you for rating ${starVal} / 5 stars!`, 'success');
        renderTicketDetailModal(modalContainer, ticket.id);
      });
    });
  }
}
