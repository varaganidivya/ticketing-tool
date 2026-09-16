/* ==========================================================================
   ApexTicket - Seed Data Definitions (Incident, Change, Problem Categories)
   ========================================================================== */

export const INITIAL_COMPANIES = [
  "GEM Arena",
  "GEM Suzuki",
  "GEM Nexa"
];

export const INITIAL_CATEGORIES = [
  "Incident",
  "Change",
  "Problem",
  "Software Bug",
  "Hardware Issue",
  "Network & VPN",
  "ERP Access",
  "Billing & Invoice"
];

export const INITIAL_LOCATIONS = [
  "Kondapur",
  "Hydernagar",
  "Manikonda",
  "Vikarabad",
  "Chevella",
  "Moinabad",
  "Shabad",
  "Malakpet",
  "Kothapet",
  "Madhapur",
  "Kondapur SUZUKI",
  "Madhinaguda SUZUKI",
  "Erragadda SUZUKI",
  "SomajiGuda SUZUKI",
  "Krishna Nagar SUZUKI",
  "Vikarabad SUZUKI",
  "Shankarpally SUZUKI"
];

export const INITIAL_DEPARTMENTS = [
  "Accounts",
  "Sales",
  "Service",
  "HR",
  "Customer care Department",
  "insurances",
  "Body shop",
  "IT",
  "MDS",
  "Admin"
];

export const INITIAL_DESIGNATIONS = [
  "Executive",
  "Manager",
  "MD",
  "CEO",
  "CFO",
  "Incharge",
  "GM sales",
  "GM Service",
  "QM",
  "CCM",
  "QCM",
  "CCE",
  "Service Advisor",
  "IHT",
  "SDM",
  "SM",
  "RM",
  "SRM",
  "FLM",
  "EDP"
];

export const INITIAL_SUPPORT_TEAMS = [
  "Ravi kumar",
  "sai Krishna",
  "Teja"
];

export const INITIAL_TICKET_SCOPES = [
  "Internal",
  "External"
];

export const INITIAL_IMPACTS = [
  "Low",
  "Medium",
  "High"
];

export const INITIAL_AGENTS = [
  { id: "agent_1", name: "sai Krishna", email: "saikrishna@gemarena.com", avatar: "SK", role: "Support Engineer", department: "sai Krishna" },
  { id: "agent_2", name: "Ravi kumar", email: "ravikumar@gemsuzuki.com", avatar: "RK", role: "DevOps Engineer", department: "Ravi kumar" },
  { id: "agent_3", name: "Teja", email: "teja@gemarena.com", avatar: "TJ", role: "Support Specialist", department: "Teja" }
];

export const INITIAL_KB_ARTICLES = [
  {
    id: "kb_1",
    title: "How to Reset Your Dealership ERP & DMS Password",
    category: "Incident",
    icon: "fa-key",
    summary: "Step-by-step guide to resetting your dealership domain password and configuring MFA for GEM Arena, GEM Suzuki & GEM Nexa.",
    views: 1420,
    helpful: 238,
    tags: ["dms", "erp", "password", "vpn", "gem arena", "login"],
    content: `### Resetting Your Domain Password\n1. Visit the self-service portal at identity.gemarena.com.\n2. Click **Forgot Password** and authenticate via Okta MFA.`
  },
  {
    id: "kb_2",
    title: "Configuring Showroom Tablet & Nexa DMS Terminal",
    category: "Change",
    icon: "fa-laptop",
    summary: "Instructions for syncing sales tablets with GEM Nexa backend databases.",
    views: 980,
    helpful: 185,
    tags: ["nexa", "tablet", "showroom", "dms", "sync"],
    content: `### Setup Steps\n1. Connect tablet to GEM-Internal Wi-Fi.\n2. Open DMS App and scan dealership QR code.`
  }
];

export const INITIAL_TICKETS = [
  {
    id: "TCK-1001",
    title: "Login page returns 500 error after password reset on GEM Nexa Portal",
    description: "Steps to reproduce: 1. Go to Nexa login page. 2. Enter credentials. 3. System returns HTTP 500 internal server error. Expected: Redirect to sales dashboard.",
    company: "GEM Nexa",
    location: "Kondapur",
    department: "IT",
    designation: "Executive",
    createdBy: "Srinivas Theerthala",
    onBehalfOf: "sai Krishna",
    supportTeam: "sai Krishna",
    contactNo: "9381036252",
    category: "Incident",
    ticketScope: "External",
    priority: "Urgent",
    impact: "High",
    status: "In Progress",
    reporter: { name: "Srinivas Theerthala", email: "srinivas.t@gemarena.com", avatar: "ST" },
    assignee: INITIAL_AGENTS[0],
    createdAgoHours: 1.5,
    slaHours: 4,
    comments: [
      {
        id: "c_1",
        author: "Srinivas Theerthala",
        avatar: "ST",
        isAgent: false,
        text: "Issue observed at Nexa Kondapur showroom branch.",
        timestamp: "1 hour ago"
      }
    ]
  },
  {
    id: "TCK-1002",
    title: "Billing system invoice printer offline at GEM Suzuki workshop",
    description: "Thermal printer disconnected during peak delivery hours at GEM Suzuki Kondapur.",
    company: "GEM Suzuki",
    location: "Kondapur SUZUKI",
    department: "Service",
    designation: "Service Advisor",
    createdBy: "Srinivas Theerthala",
    onBehalfOf: "Ravi kumar",
    supportTeam: "Ravi kumar",
    contactNo: "9876543210",
    category: "Problem",
    ticketScope: "Internal",
    priority: "High",
    impact: "Medium",
    status: "Open",
    reporter: { name: "Srinivas Theerthala", email: "srinivas.t@gemarena.com", avatar: "ST" },
    assignee: INITIAL_AGENTS[1],
    createdAgoHours: 3.2,
    slaHours: 8,
    comments: []
  },
  {
    id: "TCK-1003",
    title: "DMS Customer Procurement Module Access Request",
    description: "Requesting role permissions for newly promoted Spare Parts manager at GEM Arena.",
    company: "GEM Arena",
    location: "Madhapur",
    department: "Sales",
    designation: "Manager",
    createdBy: "Srinivas Theerthala",
    onBehalfOf: "Teja",
    supportTeam: "Teja",
    contactNo: "9123456789",
    category: "Change",
    ticketScope: "Internal",
    priority: "Medium",
    impact: "Low",
    status: "Pending",
    reporter: { name: "Srinivas Theerthala", email: "srinivas.t@gemarena.com", avatar: "ST" },
    assignee: INITIAL_AGENTS[2],
    createdAgoHours: 18,
    slaHours: 24,
    comments: []
  }
];

export const CANNED_RESPONSES = [
  { label: "Need More Info", text: "Hi! Thanks for reaching out. Could you please provide additional screenshot/logs or exact reproduction steps so we can investigate further?" },
  { label: "Investigating SLA", text: "Hello, our engineering team has been dispatched and is currently investigating this issue. We will update you within the hour." },
  { label: "Resolved KB Link", text: "Hi! This issue has been addressed. You can find detailed steps to prevent this in our Knowledge Base article." }
];
