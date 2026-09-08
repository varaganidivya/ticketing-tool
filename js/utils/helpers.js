/* ==========================================================================
   ApexTicket - Helper Utilities & SLA Calculators
   ========================================================================== */

/**
 * Calculates SLA timer remaining status and formatting for a ticket.
 */
export function calculateSLA(ticket) {
  if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
    return { status: 'on-track', text: 'SLA Met', badgeClass: 'on-track', icon: 'fa-check-circle' };
  }

  const createdTime = new Date(ticket.createdAt || Date.now() - (ticket.createdAgoHours * 3600 * 1000)).getTime();
  const slaDeadline = createdTime + (ticket.slaHours * 3600 * 1000);
  const diffMs = slaDeadline - Date.now();

  if (diffMs <= 0) {
    const overdueMins = Math.abs(Math.floor(diffMs / (1000 * 60)));
    const hours = Math.floor(overdueMins / 60);
    const mins = overdueMins % 60;
    const text = hours > 0 ? `Breached by ${hours}h ${mins}m` : `Breached by ${mins}m`;
    return { status: 'breached', text, badgeClass: 'breached', icon: 'fa-triangle-exclamation' };
  }

  const remMins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(remMins / 60);
  const mins = remMins % 60;

  let badgeClass = 'on-track';
  let icon = 'fa-clock';

  if (hours < 1) {
    badgeClass = 'warning';
    icon = 'fa-hourglass-half';
  }

  const text = hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;
  return { status: badgeClass, text, badgeClass, icon };
}

/**
 * Formats ISO or epoch timestamp into human readable relative string.
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  if (typeof timestamp === 'string' && timestamp.includes('ago')) return timestamp;

  const time = new Date(timestamp).getTime();
  const diffSecs = Math.floor((Date.now() - time) / 1000);

  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return `${Math.floor(diffSecs / 86400)}d ago`;
}

/**
 * Shows a toast message on screen.
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: 'fa-circle-check',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}"></i>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Truncates string to specified length.
 */
export function truncate(str, length = 80) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}
