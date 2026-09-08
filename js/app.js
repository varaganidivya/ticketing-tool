import { store } from './store.js';
import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderTicketListView } from './components/ticketListView.js';
import { renderKanbanView } from './components/kanbanView.js';
import { renderKbView } from './components/kbView.js';
import { renderAnalyticsView } from './components/analyticsView.js';
import { renderTicketDetailModal } from './components/ticketDetailModal.js';
import { renderCreateTicketModal, getCreateTicketHTML, bindCreateFormEvents } from './components/createTicketModal.js';
import { renderLoginView } from './components/loginView.js';

class GEMTrackerApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.headerContainer = document.getElementById('header-container');
    this.sidebarContainer = document.getElementById('sidebar-container');
    this.viewContainer = document.getElementById('view-container');
    this.modalContainer = document.getElementById('modal-container');

    this.init();
  }

  init() {
    this.handleHashRoute(false);
    this.renderApp();
    this.bindEvents();
    window.addEventListener('hashchange', () => this.handleHashRoute(true));
  }

  handleHashRoute(isHashChange = true) {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (!rawHash) return;

    if (rawHash.startsWith('ticket/')) {
      const ticketId = rawHash.replace('ticket/', '').trim();
      store.setView('tickets', false);
      if (ticketId) {
        setTimeout(() => {
          store.emit('openTicketDetailModal', ticketId);
        }, 100);
      }
      return;
    }

    if (rawHash === 'global') {
      store.resetFilters();
      store.setView('dashboard', false);
      return;
    }

    const validViews = ['dashboard', 'tickets', 'kanban', 'create', 'kb', 'analytics'];
    if (validViews.includes(rawHash)) {
      store.setView(rawHash, false);
    }
  }

  renderApp() {
    if (!store.state.isAuthenticated) {
      this.headerContainer.style.display = 'none';
      this.sidebarContainer.style.display = 'none';
      this.viewContainer.innerHTML = '';
      renderLoginView(this.viewContainer);
      return;
    }

    this.headerContainer.style.display = '';
    this.sidebarContainer.style.display = '';
    this.renderShell();
    this.renderCurrentView();
  }

  renderShell() {
    renderHeader(this.headerContainer);
    renderSidebar(this.sidebarContainer);
  }

  renderCurrentView() {
    if (!store.state.isAuthenticated) return;
    const viewName = store.state.currentView;
    this.viewContainer.innerHTML = '';

    switch (viewName) {
      case 'dashboard':
        renderDashboardView(this.viewContainer);
        break;
      case 'tickets':
        renderTicketListView(this.viewContainer);
        break;
      case 'kanban':
        renderKanbanView(this.viewContainer);
        break;
      case 'create':
        this.viewContainer.innerHTML = getCreateTicketHTML(false);
        bindCreateFormEvents(this.viewContainer, () => store.setView('tickets'));
        break;
      case 'kb':
        renderKbView(this.viewContainer);
        break;
      case 'analytics':
        renderAnalyticsView(this.viewContainer);
        break;
      default:
        renderDashboardView(this.viewContainer);
    }
  }

  bindEvents() {
    store.subscribe('authChanged', () => {
      this.renderApp();
    });

    store.subscribe('viewChanged', () => {
      this.renderApp();
    });

    store.subscribe('roleChanged', () => {
      this.renderApp();
    });

    store.subscribe('globalAccessChanged', () => {
      this.renderApp();
    });

    store.subscribe('themeChanged', () => {
      this.renderShell();
    });

    store.subscribe('filterChanged', () => {
      this.renderApp();
    });

    store.subscribe('ticketsChanged', () => {
      this.renderApp();
    });

    store.subscribe('ticketUpdated', () => {
      this.renderApp();
    });

    store.subscribe('openTicketDetailModal', (ticketId) => {
      if (window.location.hash !== `#ticket/${ticketId}`) {
        window.location.hash = `#ticket/${ticketId}`;
      }
      renderTicketDetailModal(this.modalContainer, ticketId);
    });

    store.subscribe('openCreateTicketModal', () => {
      renderCreateTicketModal(this.modalContainer);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new GEMTrackerApp();
});
