/* ==========================================================================
   ApexTicket - Application State Store & LocalStorage Persistence
   ========================================================================== */

import { INITIAL_TICKETS, INITIAL_AGENTS, INITIAL_KB_ARTICLES } from './utils/seedData.js';

const STORAGE_KEYS = {
  TICKETS: 'ittracker_tickets_v1',
  THEME: 'ittracker_theme_v1',
  ROLE: 'ittracker_role_v1',
  AUTH: 'ittracker_auth_v1',
  USER: 'ittracker_user_v1'
};

class AppStore {
  constructor() {
    this.listeners = {};
    const savedUser = this.loadCurrentUser();
    const isAuthSaved = localStorage.getItem(STORAGE_KEYS.AUTH);
    this.state = {
      tickets: this.loadTickets(),
      agents: INITIAL_AGENTS,
      kbArticles: INITIAL_KB_ARTICLES,
      isAuthenticated: isAuthSaved !== null ? isAuthSaved === 'true' : true,
      currentUser: savedUser,
      currentRole: savedUser.role || 'admin',
      currentTheme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
      currentView: 'dashboard',
      globalAccess: true,
      searchQuery: '',
      filters: {
        status: 'all',
        priority: 'all',
        category: 'all',
        scope: 'all',
        assignee: 'all',
        company: 'all',
        location: 'all',
        department: 'all',
        designation: 'all'
      },
      selectedTicketId: null
    };

    document.documentElement.setAttribute('data-theme', this.state.currentTheme);
  }

  // --- Subscriptions ---
  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data, this.state));
    }
  }

  loadCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing localStorage user:", e);
      }
    }
    const defaultUser = {
      name: "Srinivas Theerthala",
      email: "srinivas.t@gemarena.com",
      avatar: "ST",
      role: "admin",
      roleTitle: "Lead Client Admin"
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    return defaultUser;
  }

  login(userObj) {
    this.state.currentUser = userObj;
    this.state.currentRole = userObj.role || 'admin';
    this.state.isAuthenticated = true;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    this.emit('authChanged', true);
  }

  logout() {
    this.state.isAuthenticated = false;
    localStorage.setItem(STORAGE_KEYS.AUTH, 'false');
    this.emit('authChanged', false);
  }

  // --- Persistence ---
  loadTickets() {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing localStorage tickets:", e);
      }
    }
    const seeded = INITIAL_TICKETS.map(t => ({
      ...t,
      createdAt: t.createdAt || new Date(Date.now() - (t.createdAgoHours * 3600 * 1000)).toISOString()
    }));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(seeded));
    return seeded;
  }

  saveTickets() {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(this.state.tickets));
    this.emit('ticketsChanged', this.state.tickets);
  }

  getTickets() {
    return this.state.tickets;
  }

  getFilteredTickets() {
    let list = [...this.state.tickets];
    const { searchQuery, filters } = this.state;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        (t.location && t.location.toLowerCase().includes(q)) ||
        (t.department && t.department.toLowerCase().includes(q)) ||
        (t.designation && t.designation.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      list = list.filter(t => t.status.toLowerCase().replace(' ', '_') === filters.status.toLowerCase().replace(' ', '_'));
    }

    if (filters.priority !== 'all') {
      list = list.filter(t => t.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    if (filters.category !== 'all') {
      list = list.filter(t => t.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.scope && filters.scope !== 'all') {
      list = list.filter(t => t.ticketScope && t.ticketScope.toLowerCase() === filters.scope.toLowerCase());
    }

    if (filters.company !== 'all') {
      list = list.filter(t => t.company && t.company.toLowerCase() === filters.company.toLowerCase());
    }

    if (filters.location && filters.location !== 'all') {
      list = list.filter(t => t.location && t.location.toLowerCase() === filters.location.toLowerCase());
    }

    if (filters.department && filters.department !== 'all') {
      list = list.filter(t => t.department && t.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.designation && filters.designation !== 'all') {
      list = list.filter(t => t.designation && t.designation.toLowerCase() === filters.designation.toLowerCase());
    }

    if (filters.assignee !== 'all') {
      list = list.filter(t => t.assignee && t.assignee.id === filters.assignee);
    }

    return list;
  }

  getTicketById(id) {
    return this.state.tickets.find(t => t.id === id);
  }

  toggleTheme() {
    const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
    this.state.currentTheme = newTheme;
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    this.emit('themeChanged', newTheme);
  }

  toggleRole() {
    const newRole = this.state.currentRole === 'agent' ? 'customer' : 'agent';
    this.state.currentRole = newRole;
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    this.emit('roleChanged', newRole);
  }

  toggleGlobalAccess() {
    this.state.globalAccess = !this.state.globalAccess;
    this.resetFilters();
    this.emit('globalAccessChanged', this.state.globalAccess);
  }

  setView(viewName, updateHash = true) {
    this.state.currentView = viewName;
    if (updateHash && window.location.hash !== `#${viewName}`) {
      window.location.hash = `#${viewName}`;
    }
    this.emit('viewChanged', viewName);
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.emit('filterChanged', this.state.filters);
  }

  setFilter(key, value) {
    this.state.filters[key] = value;
    this.emit('filterChanged', this.state.filters);
  }

  resetFilters() {
    this.state.filters = { status: 'all', priority: 'all', category: 'all', scope: 'all', assignee: 'all', company: 'all', location: 'all', department: 'all', designation: 'all' };
    this.state.searchQuery = '';
    this.emit('filterChanged', this.state.filters);
  }

  createTicket(ticketData) {
    const newId = `TCK-${1000 + this.state.tickets.length + 1}`;
    const newTicket = {
      id: newId,
      title: ticketData.title,
      description: ticketData.description,
      company: ticketData.company || "GEM Arena",
      location: ticketData.location || "Kondapur",
      onBehalfOf: ticketData.onBehalfOf || "Direct User",
      department: ticketData.department || "IT",
      designation: ticketData.designation || "Executive",
      supportTeam: ticketData.supportTeam || "sai Krishna",
      dueDate: ticketData.dueDate || "",
      contactNo: ticketData.contactNo || "9381036252",
      category: ticketData.category || "Software Bug",
      ticketScope: ticketData.ticketScope || "Internal",
      priority: ticketData.priority || "Medium",
      impact: ticketData.impact || "Medium",
      requireApproverCheck: ticketData.requireApproverCheck || false,
      status: "Open",
      reporter: ticketData.reporter || { name: this.state.currentUser.name || "Srinivas Theerthala", email: this.state.currentUser.email || "srinivas.t@gemmotors.com", avatar: this.state.currentUser.avatar || "ST" },
      assignee: ticketData.assignee || this.state.agents[0],
      createdAt: new Date().toISOString(),
      createdAgoHours: 0,
      slaHours: ticketData.priority === "Urgent" ? 2 : (ticketData.priority === "High" ? 8 : 24),
      comments: []
    };

    this.state.tickets.unshift(newTicket);
    this.saveTickets();
    return newTicket;
  }

  updateTicketStatus(ticketId, newStatus) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return;

    ticket.status = newStatus;
    this.saveTickets();
    this.emit('ticketUpdated', ticket);
  }

  updateTicketAssignee(ticketId, agentId) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return;

    const agent = this.state.agents.find(a => a.id === agentId);
    ticket.assignee = agent || null;
    this.saveTickets();
    this.emit('ticketUpdated', ticket);
  }

  updateTicketPriority(ticketId, priority) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return;

    ticket.priority = priority;
    this.saveTickets();
    this.emit('ticketUpdated', ticket);
  }

  addComment(ticketId, text, isPrivate = false) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return;

    const currentUser = this.state.currentUser || { name: "Srinivas Theerthala", avatar: "ST" };
    const isAgent = this.state.currentRole === 'agent';
    const authorName = isAgent ? "Sai (Agent)" : `${currentUser.name} (Admin)`;
    const avatar = isAgent ? "SA" : currentUser.avatar;

    const comment = {
      id: `c_${Date.now()}`,
      author: authorName,
      avatar: avatar,
      isAgent: isAgent,
      isPrivate: isAgent ? isPrivate : false,
      text: text,
      timestamp: "Just now"
    };

    if (!ticket.comments) ticket.comments = [];
    ticket.comments.push(comment);
    this.saveTickets();
    this.emit('ticketUpdated', ticket);
  }

  rateTicket(ticketId, rating) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return;

    ticket.rating = rating;
    this.saveTickets();
    this.emit('ticketUpdated', ticket);
  }
}

export const store = new AppStore();
