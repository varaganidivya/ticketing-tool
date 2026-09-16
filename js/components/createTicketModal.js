/* ==========================================================================
   ApexTicket - Enterprise Ticket Creation Component (Incident, Change, Problem Categories)
   ========================================================================== */

import { store } from '../store.js';
import { escapeHTML, showToast } from '../utils/helpers.js';
import { INITIAL_COMPANIES, INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_DEPARTMENTS, INITIAL_DESIGNATIONS, INITIAL_SUPPORT_TEAMS, INITIAL_TICKET_SCOPES, INITIAL_IMPACTS } from '../utils/seedData.js';

export function getCreateTicketHTML(isModal = true) {
  const kbArticles = store.state.kbArticles;

  return `
    <div class="${isModal ? 'modal-overlay' : 'fade-in'}" id="create-modal-overlay">
      <div class="${isModal ? 'modal-card' : 'card-container'}" style="${isModal ? 'max-width: 1040px; height: 90vh;' : 'width: 100%;'}">
        
        <div class="modal-header">
          <div class="modal-title" style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-square-plus" style="color: var(--brand-primary)"></i>
            <span>Create New Support Ticket</span>
          </div>
          ${isModal ? `
            <button class="modal-close" id="btn-close-create-modal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
        </div>

        <form id="create-ticket-form">
          <div class="modal-body" style="padding: 1.5rem;">
            
            <!-- 1. Title Field -->
            <div class="form-group">
              <label class="form-label" for="ticket-title" style="font-weight: 700;">Title <span style="color: #ef4444;">*</span></label>
              <input type="text" id="ticket-title" class="form-input" placeholder="e.g. Login page returns 500 error after password reset" required autocomplete="off">
            </div>

            <!-- Smart Deflection Suggestion Container -->
            <div id="deflection-box" class="hidden" style="margin-bottom: 1.25rem; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-lightbulb"></i> Recommended KB Solutions (Instant Deflection)
              </div>
              <div id="deflection-results" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>

            <!-- 2. Description Field -->
            <div class="form-group">
              <label class="form-label" for="ticket-description" style="font-weight: 700;">Description <span style="color: #ef4444;">*</span></label>
              <textarea id="ticket-description" class="form-textarea" placeholder="Steps to reproduce, expected vs. actual behavior, error messages..." style="min-height: 110px;" required></textarea>
            </div>

            <!-- 3. ASSIGNMENT & LOCATION SECTION -->
            <div class="form-section">
              <div class="form-section-title">
                <i class="fa-solid fa-id-card" style="color: var(--brand-primary)"></i> LOCATION & ASSIGNMENT
              </div>
              <div class="form-section-subtitle">Ticket creator person name, client, location, department, designation, team, due date and contact</div>

              <!-- Ticket Created By Field (Separate Input) -->
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" for="ticket-created-by" style="font-weight: 700;">
                  <i class="fa-solid fa-user-pen" style="color: var(--brand-primary); margin-right: 4px;"></i>
                  Ticket Created By (Person Name) <span style="color: #ef4444;">*</span>
                </label>
                <input type="text" id="ticket-created-by" class="form-input" value="Srinivas Theerthala" placeholder="Enter person name creating this ticket (e.g. Srinivas Theerthala)" required>
              </div>

              <!-- Row 1: Client, Location, Department, Designation -->
              <div class="form-grid-4" style="margin-bottom: 1rem;">
                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Client <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-company" class="form-select" required>
                    <option value="" disabled selected>Select Client / Company</option>
                    ${INITIAL_COMPANIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Location <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-location" class="form-select" required>
                    <option value="" disabled selected>Select Location</option>
                    ${INITIAL_LOCATIONS.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Department <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-department" class="form-select" required>
                    <option value="" disabled selected>Select department</option>
                    ${INITIAL_DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Designation <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-designation" class="form-select" required>
                    <option value="" disabled selected>Select designation</option>
                    ${INITIAL_DESIGNATIONS.map(des => `<option value="${des}">${des}</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Row 2: Support Team, On Behalf Of, Due Date, Contact No -->
              <div class="form-grid-4" style="margin-bottom: 0;">
                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Assign to Support Team</label>
                  <select id="ticket-support-team" class="form-select">
                    <option value="">Select support team</option>
                    ${INITIAL_SUPPORT_TEAMS.map(st => `<option value="${st}">${st}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">On Behalf Of <span style="color: var(--text-dim); font-weight: normal;">(optional)</span></label>
                  <select id="ticket-on-behalf" class="form-select">
                    <option value="">Select user</option>
                    ${INITIAL_SUPPORT_TEAMS.map(st => `<option value="${st}">${st}</option>`).join('')}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" for="ticket-due-date">Due Date <span style="color: #ef4444;">*</span></label>
                  <div style="position: relative; display: flex; align-items: center;">
                    <i class="fa-solid fa-calendar-days" style="position: absolute; left: 12px; color: var(--brand-primary); pointer-events: none; font-size: 0.95rem;"></i>
                    <input type="date" id="ticket-due-date" class="form-input" style="padding-left: 38px; cursor: pointer;" required onclick="if (this.showPicker) this.showPicker();">
                  </div>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Contact No. <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="ticket-contact-no" class="form-input" value="9381036252" placeholder="e.g. 9381036252" required>
                </div>
              </div>
            </div>

            <!-- 4. CLASSIFICATION SECTION (With Incident, Change, Problem) -->
            <div class="form-section">
              <div class="form-section-title">
                <i class="fa-solid fa-tags" style="color: var(--brand-accent)"></i> CLASSIFICATION
              </div>
              <div class="form-section-subtitle">Category, scope and priority</div>

              <div class="form-grid-4" style="margin-bottom: 0;">
                
                <!-- Ticket Category with Incident, Change, Problem -->
                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Ticket Category <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-category" class="form-select" required>
                    <option value="" disabled selected>Select ticket category</option>
                    ${INITIAL_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Ticket Scope <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-scope" class="form-select" required>
                    <option value="" disabled selected>Select ticket scope</option>
                    ${INITIAL_TICKET_SCOPES.map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>

                <!-- Priority Dropdown -->
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-weight: 700;">Priority <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-priority" class="form-select" required>
                    <option value="" disabled selected>Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label">Impact <span style="color: #ef4444;">*</span></label>
                  <select id="ticket-impact" class="form-select" required>
                    <option value="" disabled selected>Select impact</option>
                    ${INITIAL_IMPACTS.map(i => `<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- 5. ATTACHMENTS SECTION -->
            <div class="form-section">
              <div class="form-section-title" style="margin-bottom: 0.5rem;">
                <i class="fa-solid fa-paperclip" style="color: var(--brand-primary)"></i> ATTACHMENTS & FILES
              </div>
              <div class="form-section-subtitle">Upload screenshots, logs, or diagnostic reports</div>

              <div class="file-dropzone" id="file-dropzone">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.8rem; color: var(--brand-primary);"></i>
                <div style="font-size: 0.875rem; font-weight: 600;">Drag & drop files here, or click to browse</div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">Supports PNG, JPG, PDF, TXT (Max 25MB)</div>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-browse-files" style="margin-top: 4px;">
                  <i class="fa-solid fa-upload"></i> Attach files
                </button>
                <input type="file" id="file-upload-input" multiple style="display: none;">
              </div>

              <div id="attached-files-container" class="attached-files-list"></div>
            </div>

            <!-- 6. APPROVER CHECKBOX -->
            <div class="approver-check-box">
              <input type="checkbox" id="chk-require-approver" checked>
              <label for="chk-require-approver" style="cursor: pointer;">
                <strong>Require approver check</strong> — <span style="color: var(--text-dim);">ticket goes through approval before being actioned</span>
              </label>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-create">
              <i class="fa-solid fa-xmark"></i> Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-paper-plane"></i> Submit ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}

export function renderCreateTicketModal(modalContainer) {
  modalContainer.innerHTML = getCreateTicketHTML(true);
  bindCreateFormEvents(modalContainer, () => { modalContainer.innerHTML = ''; });
}

export function bindCreateFormEvents(container, closeCallback) {
  const kbArticles = store.state.kbArticles;
  let attachedFiles = [];

  const dueDateInput = container.querySelector('#ticket-due-date');
  if (dueDateInput && !dueDateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const closeBtn = container.querySelector('#btn-close-create-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeCallback);

  const cancelBtn = container.querySelector('#btn-cancel-create');
  if (cancelBtn) cancelBtn.addEventListener('click', closeCallback);

  const overlay = container.querySelector('#create-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.id === 'create-modal-overlay') closeCallback();
    });
  }

  const dropzone = container.querySelector('#file-dropzone');
  const browseBtn = container.querySelector('#btn-browse-files');
  const fileInput = container.querySelector('#file-upload-input');
  const filesContainer = container.querySelector('#attached-files-container');

  const updateFilesUI = () => {
    filesContainer.innerHTML = '';
    if (attachedFiles.length === 0) return;

    attachedFiles.forEach((file, index) => {
      const chip = document.createElement('div');
      chip.className = 'file-chip';
      chip.innerHTML = `
        <i class="fa-solid fa-paperclip"></i>
        <span>${escapeHTML(file.name)} (${(file.size / 1024).toFixed(1)} KB)</span>
        <i class="fa-solid fa-xmark file-chip-remove" data-index="${index}"></i>
      `;
      filesContainer.appendChild(chip);
    });

    filesContainer.querySelectorAll('.file-chip-remove').forEach(removeBtn => {
      removeBtn.addEventListener('click', (e) => {
        const idx = parseInt(removeBtn.getAttribute('data-index'));
        attachedFiles.splice(idx, 1);
        updateFilesUI();
      });
    });
  };

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('click', (e) => {
      if (e.target !== browseBtn && !browseBtn.contains(e.target)) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(f => attachedFiles.push(f));
        updateFilesUI();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--brand-primary)';
      dropzone.style.background = 'rgba(99, 102, 241, 0.1)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-color)';
      dropzone.style.background = 'var(--bg-input)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-color)';
      dropzone.style.background = 'var(--bg-input)';
      if (e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach(f => attachedFiles.push(f));
        updateFilesUI();
      }
    });
  }

  const titleInput = container.querySelector('#ticket-title');
  const deflectionBox = container.querySelector('#deflection-box');
  const deflectionResults = container.querySelector('#deflection-results');

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      const val = titleInput.value.trim().toLowerCase();
      if (val.length < 3) {
        deflectionBox.classList.add('hidden');
        return;
      }

      const matches = kbArticles.filter(art => 
        art.title.toLowerCase().includes(val) ||
        art.tags.some(tag => tag.includes(val))
      );

      if (matches.length > 0) {
        deflectionBox.classList.remove('hidden');
        deflectionResults.innerHTML = matches.slice(0, 2).map(m => `
          <div style="font-size: 0.825rem; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-file-lines" style="color: var(--brand-primary); margin-right: 6px;"></i> ${escapeHTML(m.title)}</span>
            <button type="button" class="btn btn-ghost btn-sm view-deflection-kb" data-id="${m.id}" style="font-size: 0.75rem; padding: 2px 6px;">Read Article</button>
          </div>
        `).join('');

        deflectionResults.querySelectorAll('.view-deflection-kb').forEach(btn => {
          btn.addEventListener('click', () => {
            closeCallback();
            store.setView('kb');
          });
        });
      } else {
        deflectionBox.classList.add('hidden');
      }
    });
  }

  const form = container.querySelector('#create-ticket-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = titleInput.value.trim();
      const description = container.querySelector('#ticket-description').value.trim();
      const createdBy = container.querySelector('#ticket-created-by')?.value.trim() || "Srinivas Theerthala";
      const company = container.querySelector('#ticket-company').value || "GEM Arena";
      const location = container.querySelector('#ticket-location')?.value || "Kondapur";
      const department = container.querySelector('#ticket-department')?.value || "IT";
      const designation = container.querySelector('#ticket-designation')?.value || "Executive";
      const supportTeam = container.querySelector('#ticket-support-team')?.value || "sai Krishna";
      const onBehalfOf = container.querySelector('#ticket-on-behalf')?.value;
      const dueDate = container.querySelector('#ticket-due-date').value;
      const contactNo = container.querySelector('#ticket-contact-no').value;
      const category = container.querySelector('#ticket-category').value || "Incident";
      const ticketScope = container.querySelector('#ticket-scope').value || "Internal";
      const priority = container.querySelector('#ticket-priority').value || "Medium";
      const impact = container.querySelector('#ticket-impact').value || "Medium";
      const requireApproverCheck = container.querySelector('#chk-require-approver').checked;

      if (!title || !description) return;

      const newTicket = store.createTicket({
        title,
        description,
        createdBy,
        company,
        location,
        onBehalfOf,
        department,
        designation,
        supportTeam,
        dueDate,
        contactNo,
        category,
        ticketScope,
        priority,
        impact,
        requireApproverCheck
      });

      const filesCountMsg = attachedFiles.length > 0 ? ` with ${attachedFiles.length} file(s) attached` : '';
      showToast(`Ticket ${newTicket.id} (${category}) created for ${company}${filesCountMsg}!`, 'success');
      closeCallback();

      store.setView('tickets');
      store.emit('openTicketDetailModal', newTicket.id);
    });
  }
}
