/* ==========================================================================
   GEM Tracker - Login Page Component
   ========================================================================== */

import { store } from '../store.js';

export function renderLoginView(container) {
  container.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent 40%), var(--bg-main); padding: 1.5rem;">
      <div style="width: 100%; max-width: 440px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2.5rem 2rem; box-shadow: var(--shadow-md); backdrop-filter: blur(12px);">
        
        <!-- Header & Logo -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 56px; height: 56px; margin: 0 auto 1rem auto; background: linear-gradient(135deg, var(--brand-primary) 0%, #38bdf8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.6rem; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);">
            <span style="font-size: 1.8rem; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">G</span>
          </div>
          <h1 style="font-size: 1.65rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">IT<span style="color: var(--brand-primary);">Tracker</span></h1>
          <div style="font-size: 0.875rem; color: var(--text-muted);">Sign in to Enterprise Helpdesk System</div>
        </div>

        <!-- Role Quick Selectors -->
        <div style="margin-bottom: 1.5rem;">
          <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 8px;">Select User Profile</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button type="button" class="login-profile-pill active" data-name="Srinivas Theerthala" data-email="srinivas.t@gemarena.com" data-avatar="ST" data-role="admin" data-title="Lead Client Admin" style="padding: 10px 12px; border-radius: 10px; border: 1px solid var(--brand-primary); background: rgba(99, 102, 241, 0.12); color: var(--text-main); font-weight: 600; font-size: 0.8rem; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: var(--brand-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;">ST</span>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <div>Srinivas T.</div>
                <div style="font-size: 0.68rem; color: var(--text-dim);">Admin</div>
              </div>
            </button>

            <button type="button" class="login-profile-pill" data-name="sai Krishna" data-email="saikrishna@gemarena.com" data-avatar="SK" data-role="agent" data-title="Support Engineer" style="padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: #38bdf8; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;">SK</span>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <div>sai Krishna</div>
                <div style="font-size: 0.68rem; color: var(--text-dim);">Support</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form id="login-form">
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-weight: 700;">Work Email</label>
            <input type="email" id="login-email" class="form-input" value="" placeholder="Enter your work email (e.g. srinivas.t@gemarena.com)">
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-weight: 700; display: flex; justify-content: space-between;">
              <span>Password</span>
              <span style="color: var(--brand-primary); font-size: 0.78rem; font-weight: normal; cursor: pointer;">Forgot?</span>
            </label>
            <input type="password" id="login-password" class="form-input" value="" placeholder="Enter your password">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-weight: 700; font-size: 0.95rem; justify-content: center; gap: 8px;">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to IT Tracker
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.78rem; color: var(--text-dim);">
          Protected by IT Enterprise Security • v2.4
        </div>

      </div>
    </div>
  `;

  let selectedUser = {
    name: "Srinivas Theerthala",
    email: "srinivas.t@gemmotors.com",
    avatar: "ST",
    role: "admin",
    roleTitle: "Lead Client Admin"
  };

  const profileBtns = container.querySelectorAll('.login-profile-pill');
  const emailInput = container.querySelector('#login-email');

  profileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      profileBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'var(--border-color)';
        b.style.background = 'var(--bg-input)';
        b.style.color = 'var(--text-muted)';
      });

      btn.classList.add('active');
      btn.style.borderColor = 'var(--brand-primary)';
      btn.style.background = 'rgba(99, 102, 241, 0.12)';
      btn.style.color = 'var(--text-main)';

      selectedUser = {
        name: btn.getAttribute('data-name'),
        email: btn.getAttribute('data-email'),
        avatar: btn.getAttribute('data-avatar'),
        role: btn.getAttribute('data-role'),
        roleTitle: btn.getAttribute('data-title')
      };

      emailInput.placeholder = selectedUser.email;
    });
  });

  const form = container.querySelector('#login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      selectedUser.email = emailInput.value || selectedUser.email;
      store.login(selectedUser);
      store.setView('dashboard');
    });
  }
}
