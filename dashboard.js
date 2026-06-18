
const pages = {
  overview:'Overview', appointments:'Appointments', patients:'Patients',
  doctors:'Doctors', billing:'Billing', reports:'Reports',
  inventory:'Inventory', emergency:'Emergency', messages:'Messages', settings:'Settings'
};

function navigate(id, el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('breadcrumb-label').textContent = pages[id];
  // close mobile sidebar
  if(window.innerWidth <= 900) closeSidebar();
}

/* ══════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════ */
let sidebarCollapsed = false;
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');
const topbar = document.getElementById('topbar');
const overlay = document.getElementById('overlay');

function toggleSidebar(){
  if(window.innerWidth <= 900){
    // mobile: slide in/out
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  } else {
    // desktop: collapse/expand
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    main.classList.toggle('collapsed', sidebarCollapsed);
    topbar.style.left = sidebarCollapsed ? '68px' : 'var(--sidebar)';
  }
}

function closeSidebar(){
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('active');
}

/* ══════════════════════════════
   MESSAGE PANEL
══════════════════════════════ */
function showMsg(el, sender, subject, body){
  document.querySelectorAll('#page-messages .card:first-child [onclick]').forEach(x=>x.style.background='');
  el.style.background = 'var(--teal-light)';
  document.getElementById('msg-panel').innerHTML = `
    <div class="card-header" style="border-bottom:1px solid var(--border-soft);padding-bottom:1rem;margin-bottom:1rem">
      <div>
        <div class="card-title">${subject}</div>
        <div style="font-size:.78rem;color:var(--text-soft);margin-top:.2rem">From: <strong>${sender}</strong> · Today</div>
      </div>
      <span class="badge-pill badge-amber"><i class="fa-solid fa-clock" style="font-size:.5rem"></i> Unread</span>
    </div>
    <p style="font-size:.875rem;color:var(--text-mid);line-height:1.75;margin-bottom:1.5rem">${body}</p>
    <div style="border-top:1px solid var(--border-soft);padding-top:1rem">
      <label class="form-label">Reply</label>
      <textarea class="form-input" style="width:100%;resize:none;height:80px;margin-bottom:.75rem" placeholder="Type your reply…"></textarea>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i> Send Reply</button>
        <button class="btn btn-outline btn-sm"><i class="fa-solid fa-tag"></i> Tag</button>
        <button class="btn btn-outline btn-sm"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
  `;
}

/* ══════════════════════════════
   RESPONSIVE TOPBAR LEFT ADJUSTMENT
══════════════════════════════ */
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 900){
    topbar.style.left = sidebarCollapsed ? '68px' : 'var(--sidebar)';
    overlay.classList.remove('active');
    sidebar.classList.remove('mobile-open');
  } else {
    topbar.style.left = '0';
  }
});
