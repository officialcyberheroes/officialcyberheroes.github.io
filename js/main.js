/* ============================================================
   UiTM Cyberheroes Club — main.js
   All page content is driven from data/*.json files.
   To update site content, edit those JSON files only.
   ============================================================ */

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
(function initNavbar() {
  const nav  = document.querySelector('.navbar');
  const ham  = document.querySelector('.hamburger');
  const mNav = document.querySelector('.mobile-nav');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  });

  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    mNav?.classList.toggle('open');
  });

  mNav?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      ham?.classList.remove('open');
      mNav.classList.remove('open');
    })
  );

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
    if (page === '' && a.getAttribute('href') === 'index.html') a.classList.add('active');
  });
})();


/* ─────────────────────────────────────────
   HERO CANVAS NETWORK ANIMATION
───────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const NAVY = '#1b3a8f', RED = '#c91c1c';
  let nodes = [];

  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  const hexA  = v => Math.floor(v * 255).toString(16).padStart(2, '0');

  const makeNodes = () => {
    const count = Math.max(30, Math.floor((canvas.width * canvas.height) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 3.5 + 1.5,
      filled: Math.random() > 0.45,
      color: Math.random() > 0.5 ? NAVY : RED,
      alpha: Math.random() * 0.55 + 0.3,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 160) {
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(90,120,200,${(1 - d / 160) * 0.22})`; ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      const col = n.color + hexA(n.alpha);
      if (n.filled) { ctx.fillStyle = col; ctx.fill(); }
      else { ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  };

  resize(); makeNodes(); draw();
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { resize(); makeNodes(); }, 200); });
}


/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function initScrollReveal() {
  const sel = '.card,.hof-podium-item,.event-card,.writeup-card,.org-node,.member-card,.info-card,.social-link,.stat-card';
  const targets = document.querySelectorAll(sel);
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  targets.forEach((el, i) => {
    el.style.opacity = '0'; el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .5s ease ${(i % 8) * 0.06}s, transform .5s ease ${(i % 8) * 0.06}s`;
    obs.observe(el);
  });
}


/* ─────────────────────────────────────────
   FILTER TABS
───────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group || 'default';
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
      });
    });
  });
}


/* ─────────────────────────────────────────
   CUSTOM SELECT DROPDOWNS
───────────────────────────────────────── */
function initCustomSelects() {
  document.querySelectorAll('select.form-control:not([data-cs])').forEach(sel => {
    sel.dataset.cs = '1';

    const wrap = document.createElement('div');
    wrap.className = 'custom-select-wrap';

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';

    const valSpan = document.createElement('span');
    const placeholder = sel.options[0]?.text || 'Select…';
    valSpan.className = 'custom-select-value placeholder';
    valSpan.textContent = placeholder;

    const arrow = document.createElement('i');
    arrow.className = 'bi bi-chevron-down custom-select-arrow';

    trigger.append(valSpan, arrow);

    const panel = document.createElement('div');
    panel.className = 'custom-select-options';

    Array.from(sel.options).forEach((opt, i) => {
      if (i === 0) return; // skip placeholder option
      const div = document.createElement('div');
      div.className = 'custom-select-option';
      div.dataset.value = opt.value;
      div.textContent = opt.text;
      div.addEventListener('click', () => {
        sel.value = opt.value;
        valSpan.textContent = opt.text;
        valSpan.classList.remove('placeholder');
        panel.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
        div.classList.add('selected');
        wrap.classList.remove('open');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      panel.appendChild(div);
    });

    // Reset also clears the displayed value
    sel.addEventListener('_reset', () => {
      valSpan.textContent = placeholder;
      valSpan.classList.add('placeholder');
      panel.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
    });

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = wrap.classList.toggle('open');
      // Close all other open selects
      if (isOpen) document.querySelectorAll('.custom-select-wrap.open').forEach(w => { if (w !== wrap) w.classList.remove('open'); });
    });

    wrap.append(trigger, panel);
    sel.insertAdjacentElement('afterend', wrap);
  });

  // Close on outside click
  document.addEventListener('click', () =>
    document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'))
  );
}


/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  initCustomSelects(); // style all <select> on the page

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;

    // Basic client-side validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(el => { if (!el.value.trim()) valid = false; });
    if (!valid) {
      btn.innerHTML = '<i class="bi bi-exclamation-circle"></i> Please fill all required fields';
      setTimeout(() => { btn.innerHTML = orig; }, 2500);
      return;
    }

    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message Sent!';
        btn.style.background = 'var(--navy)';
        form.reset();
        form.querySelectorAll('select[data-cs]').forEach(s => s.dispatchEvent(new Event('_reset')));
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Failed — try again';
      btn.style.background = '#7f1d1d';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3500);
    }
  });
}


/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const badgeClass = { ctf:'badge-ctf', workshop:'badge-workshop', competition:'badge-competition', seminar:'badge-seminar', talk:'badge-talk' };
const badgeLabel = { ctf:'CTF', workshop:'Workshop', competition:'Competition', seminar:'Inar', talk:'Talk' };
const hof = { ctf:'badge-ctf', competition:'badge-competition', workshop:'badge-workshop' };

async function fetchJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed to load ${path}`);
  return r.json();
}

function loadingHTML() {
  return `<div style="text-align:center;padding:3rem;color:var(--text-muted);font-family:var(--font-mono);font-size:.82rem;">
    <div style="margin-bottom:.75rem;font-size:1.5rem;">⏳</div>Loading…</div>`;
}

function errorHTML(msg) {
  return `<div style="text-align:center;padding:3rem;color:var(--text-muted);">
    <div style="font-size:1.5rem;margin-bottom:.75rem;">⚠️</div>${msg}</div>`;
}


/* ─────────────────────────────────────────
   EVENTS  →  events.html + index.html preview
───────────────────────────────────────── */
function renderUpcomingCard(ev) {
  const bc   = badgeClass[ev.type] || 'badge-navy';
  const bl   = badgeLabel[ev.type] || ev.type;
  const free = ev.free ? `<span class="badge badge-green" style="font-size:.7rem;">Free</span>` : '';

  return `
  <div class="event-card" data-category="${ev.type}">
    <div class="event-date">
      <div class="event-day">${ev.day}</div>
      <div class="event-month">${ev.month}</div>
    </div>
    <div>
      <span class="badge ${bc}" style="margin-bottom:.5rem;">${bl}</span>
      <div class="event-title">${ev.title}</div>
      <div class="event-meta">
        <span><i class="bi bi-geo-alt-fill"></i> ${ev.location}</span>
        <span><i class="bi bi-clock-fill"></i> ${ev.time}</span>
        <span><i class="bi bi-${ev.access === 'Members Only' ? 'lock-fill' : 'people-fill'}"></i> ${ev.access}</span>
      </div>
      <p style="margin-top:.75rem;font-size:.85rem;color:var(--text-secondary);">${ev.description}</p>
    </div>
    ${free ? `<div style="align-self:center;">${free}</div>` : ''}
  </div>`;
}

function renderPastCard(ev) {
  const bc  = badgeClass[ev.type] || 'badge-navy';
  const bl  = badgeLabel[ev.type] || ev.type;
  const res = ev.result
    ? `<span><i class="bi bi-trophy-fill" style="color:#f59e0b"></i> ${ev.result}</span>` : '';
  const att = ev.attendees
    ? `<span><i class="bi bi-people-fill"></i> ${ev.attendees}</span>` : '';
  const btn = ev.writeupLink
    ? `<a href="${ev.writeupLink}" class="btn btn-outline btn-sm">Writeup</a>`
    : ev.galleryLink
      ? `<a href="${ev.galleryLink}" class="btn btn-outline btn-sm">Gallery</a>`
      : '';

  return `
  <div class="event-card" style="opacity:.8;" data-category="${ev.type}">
    <div class="event-date" style="opacity:.7;">
      <div class="event-day">${ev.day}</div>
      <div class="event-month">${ev.month}</div>
    </div>
    <div>
      <span class="badge ${bc}" style="margin-bottom:.5rem;">${bl}</span>
      <div class="event-title">${ev.title}</div>
      <div class="event-meta">
        <span><i class="bi bi-geo-alt-fill"></i> ${ev.location}</span>
        ${res}${att}
      </div>
      <p style="margin-top:.75rem;font-size:.85rem;color:var(--text-muted);">${ev.description}</p>
    </div>
    ${btn}
  </div>`;
}

async function loadEvents() {
  const upEl  = document.getElementById('upcoming-list');
  const paEl  = document.getElementById('past-list');
  if (!upEl && !paEl) return;

  if (upEl) upEl.innerHTML = loadingHTML();
  if (paEl) paEl.innerHTML = loadingHTML();

  try {
    const events   = await fetchJSON('data/events.json');
    const upcoming = events.filter(e => e.status === 'upcoming');
    const past     = events.filter(e => e.status === 'past');

    if (upEl) {
      upEl.innerHTML = upcoming.length
        ? upcoming.map(renderUpcomingCard).join('')
        : `<div class="empty-state"><div class="empty-state-icon">📅</div><p>No upcoming events right now. Check back soon!</p></div>`;
    }
    if (paEl) {
      paEl.innerHTML = past.length
        ? past.map(renderPastCard).join('')
        : `<div class="empty-state"><div class="empty-state-icon">📁</div><p>No past events recorded yet.</p></div>`;
    }
    initScrollReveal();
    initFilters();
  } catch (err) {
    console.error('[loadEvents]', err);
    const msg = location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message;
    if (upEl) upEl.innerHTML = errorHTML(msg);
    if (paEl) paEl.innerHTML = errorHTML(msg);
  }
}

/* index.html — show first 2 upcoming events */
async function loadEventsPreview() {
  const el = document.getElementById('events-preview');
  if (!el) return;
  el.innerHTML = loadingHTML();
  try {
    const events   = await fetchJSON('data/events.json');
    const upcoming = events.filter(e => e.status === 'upcoming').slice(0, 2);
    el.innerHTML = upcoming.length
      ? upcoming.map(ev => {
          const bc = badgeClass[ev.type] || 'badge-navy';
          const bl = badgeLabel[ev.type] || ev.type;
          return `
          <div class="event-card">
            <div class="event-date">
              <div class="event-day">${ev.day}</div>
              <div class="event-month">${ev.month}</div>
            </div>
            <div>
              <span class="badge ${bc}">${bl}</span>
              <div class="event-title">${ev.title}</div>
              <div class="event-meta">
                <span><i class="bi bi-geo-alt"></i> ${ev.location}</span>
                <span><i class="bi bi-people"></i> ${ev.access}</span>
              </div>
            </div>
            <a href="events.html" class="btn btn-outline btn-sm">Details</a>
          </div>`;
        }).join('')
      : `<p style="text-align:center;color:var(--text-muted);padding:2rem;">No upcoming events right now.</p>`;
  } catch (err) {
    console.error('[loadEventsPreview]', err);
    el.innerHTML = errorHTML(location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message);
  }
}


/* ─────────────────────────────────────────
   BLOG  →  blog.html
───────────────────────────────────────── */
const blogCategoryIcon = {
  writeup:   'bi-flag-fill',
  research:  'bi-journal-text',
  event:     'bi-camera-fill',
  awareness: 'bi-megaphone-fill',
};
const blogCategoryLabel = {
  writeup:   'Writeup',
  research:  'Research',
  event:     'Event',
  awareness: 'Awareness',
};
const blogLinkLabel = {
  writeup:   'Read Writeup',
  research:  'Read',
  event:     'View Gallery',
  awareness: 'View',
};

function renderBlogCard(w) {
  const icon  = blogCategoryIcon[w.category]  || 'bi-file-text-fill';
  const cLabel= blogCategoryLabel[w.category] || w.category;
  const btnLbl= blogLinkLabel[w.category]     || 'View';
  const subTag = w.tag ? `<span class="tag tag-${w.tag.toLowerCase().replace(/\s+/g,'-')}">${w.tag}</span>` : '';
  const dateStr = w.date ? `<span style="font-family:var(--font-mono);font-size:.72rem;color:var(--text-muted);">${w.date}</span>` : '';
  return `
  <div class="writeup-card" data-category="${w.category}" data-title="${w.title}">
    <div class="writeup-tags">
      <span class="tag tag-${w.category}"><i class="bi ${icon}" style="margin-right:.25rem;"></i>${cLabel}</span>
      ${subTag}
    </div>
    <div class="writeup-event">${w.event || ''}</div>
    <h3 class="writeup-title">${w.title}</h3>
    <p class="writeup-excerpt">${w.excerpt}</p>
    <div class="writeup-footer">
      <span style="display:flex;align-items:center;gap:.75rem;">
        <span><i class="bi bi-person-fill"></i> ${w.author}</span>
        ${dateStr}
      </span>
      ${w.link ? `<a href="${w.link}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="padding:.3rem .75rem;">
        ${btnLbl} <i class="bi bi-arrow-right"></i>
      </a>` : ''}
    </div>
  </div>`;
}

async function loadBlog() {
  const grid    = document.getElementById('blog-grid');
  const countEl = document.getElementById('blog-count');
  const noEl    = document.getElementById('no-posts');
  if (!grid) return;

  grid.innerHTML = loadingHTML();

  try {
    const posts = await fetchJSON('data/blog.json');
    grid.innerHTML = posts.length
      ? posts.map(renderBlogCard).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📂</div><p>No posts yet. Check back soon!</p></div>`;

    if (countEl) countEl.textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;

    // Search
    const searchInput = document.getElementById('blog-search');
    const updateCount = () => {
      const vis = grid.querySelectorAll('.writeup-card:not([style*="display: none"])').length;
      if (countEl) countEl.textContent = `${vis} post${vis !== 1 ? 's' : ''}`;
      if (noEl) noEl.style.display = vis === 0 ? 'block' : 'none';
    };
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      grid.querySelectorAll('.writeup-card').forEach(card => {
        card.style.display = (card.dataset.title + card.textContent).toLowerCase().includes(q) ? '' : 'none';
      });
      updateCount();
    });

    initScrollReveal();
    initFilters();
    updateCount();
  } catch (err) {
    console.error('[loadBlog]', err);
    grid.innerHTML = errorHTML(location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message);
  }
}


/* ─────────────────────────────────────────
   ORG CHART + MEMBERS  →  org-chart.html
───────────────────────────────────────── */
function orgNodeHTML(person, extra = '') {
  const init = person.initials || person.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const mData = JSON.stringify({
    name: person.name, role: person.role, initials: init,
    codename: person.codename || '', course: person.course || '',
    email: person.email || '', photo: person.photo || ''
  }).replace(/'/g, '&#39;');
  // icon = casual avatar for the circle node; photo = real photo for modal only
  const avatar = person.icon
    ? `<div class="org-avatar" style="padding:0;overflow:hidden;"><img src="${person.icon}" alt="${person.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"></div>`
    : `<div class="org-avatar">${init}</div>`;
  // Show codename on the card (shorter); full name lives inside the modal via mData
  const displayName = person.codename ? person.codename : person.name;
  return `
  <div class="org-node ${extra}" data-member='${mData}' tabindex="0" role="button" aria-label="View ${person.name}&#39;s profile">
    ${avatar}
    <div class="org-node-name">${displayName}</div>
    <div class="org-node-role">${person.role}</div>
  </div>`;
}

function renderOrgChart(chart) {
  const { president, vicePresidents, secretariat, committees } = chart;

  // Centered vertical gradient stem between levels
  const vline = `<div style="width:2px;height:36px;background:linear-gradient(180deg,var(--navy),var(--red));margin:0 auto;"></div>`;

  // A horizontal row: H-bar at top, vertical drops to each node
  const levelRow = (nodes, gap = '1.5rem') => `
    <div style="position:relative;">
      <div style="position:absolute;top:0;left:8%;right:8%;height:2px;
        background:linear-gradient(90deg,var(--navy),var(--red));"></div>
      <div style="display:flex;gap:${gap};flex-wrap:wrap;justify-content:center;">
        ${nodes.map(n => `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="width:2px;height:36px;background:var(--navy);"></div>
            ${orgNodeHTML(n)}
          </div>`).join('')}
      </div>
    </div>`;

  // Exec committees row — each with a label node + sub-members below
  const committeesRow = `
    <div style="position:relative;width:100%;">
      <div style="position:absolute;top:0;left:2%;right:2%;height:2px;
        background:linear-gradient(90deg,var(--navy),var(--red));"></div>
      <div style="display:flex;gap:1.25rem;flex-wrap:wrap;justify-content:center;">
        ${committees.map(c => `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="width:2px;height:36px;background:var(--navy);"></div>
            <div class="org-node">
              <div class="org-node-name">${c.label}</div>
              <div class="org-node-role">Exec Committee</div>
            </div>
            ${c.members.length ? `
              <div style="width:2px;height:24px;background:var(--navy);margin:0 auto;"></div>
              <div style="position:relative;">
                <div style="position:absolute;top:0;left:10%;right:10%;height:2px;background:var(--navy);"></div>
                <div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;">
                  ${c.members.map(m => `
                    <div style="display:flex;flex-direction:column;align-items:center;">
                      <div style="width:2px;height:24px;background:var(--navy);"></div>
                      ${orgNodeHTML(m)}
                    </div>`).join('')}
                </div>
              </div>` : ''}
          </div>`).join('')}
      </div>
    </div>`;

  return `
  <div style="display:flex;flex-direction:column;align-items:center;">
    ${orgNodeHTML(president, 'is-president')}
    ${vline}
    ${levelRow(vicePresidents)}
    ${vline}
    ${levelRow(secretariat, '1.25rem')}
    ${vline}
    ${committeesRow}
  </div>`;
}

function memberCardHTML(m) {
  const init = m.initials || m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const mData = JSON.stringify({
    name: m.name, role: m.role, initials: init,
    codename: m.codename || '', course: m.course || '',
    email: m.email || '', photo: m.photo || ''
  }).replace(/'/g, '&#39;');
  return `
  <div class="member-card" data-member='${mData}' tabindex="0" role="button" aria-label="View ${m.name}&#39;s profile">
    ${m.icon
      ? `<div class="org-avatar" style="width:64px;height:64px;padding:0;overflow:hidden;margin:0 auto 1rem;"><img src="${m.icon}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"></div>`
      : `<div class="org-avatar" style="width:64px;height:64px;font-size:1.4rem;margin:0 auto 1rem;">${init}</div>`}
    <div class="member-card-name">${m.name}</div>
    <div class="member-card-role">${m.role}</div>
    <p class="member-card-desc">${m.specialty ? `<span style="color:var(--text-muted);font-family:var(--font-mono);font-size:.72rem;">${m.specialty}</span><br><br>` : ''}${m.bio}</p>
  </div>`;
}

async function loadMembers() {
  const chartEl = document.getElementById('org-chart-render');
  const gridEl  = document.getElementById('members-grid');
  if (!chartEl && !gridEl) return;

  if (chartEl) chartEl.innerHTML = loadingHTML();
  if (gridEl)  gridEl.innerHTML  = loadingHTML();

  try {
    const data = await fetchJSON('data/members.json');

    if (chartEl) chartEl.innerHTML = renderOrgChart(data.chart);

    if (gridEl) {
      gridEl.innerHTML = data.sections.map(sec => `
        <div class="dept-section">
          <div class="dept-label">${sec.label}</div>
          <div class="grid-${Math.min(sec.members.length, 4)}">
            ${sec.members.map(memberCardHTML).join('')}
          </div>
        </div>`).join('');
    }

    initScrollReveal();
    initOrgModal();
  } catch (err) {
    console.error('[loadMembers]', err);
    const msg = location.protocol === 'file:'
      ? 'Open via a local server (e.g. VS Code Live Server) — fetch() does not work with file://'
      : err.message || 'Could not load org chart.';
    if (chartEl) chartEl.innerHTML = errorHTML(msg);
    if (gridEl)  gridEl.innerHTML  = errorHTML(msg);
  }
}


/* ─────────────────────────────────────────
   MEMBER MODAL  (org-chart.html)
───────────────────────────────────────── */
function initOrgModal() {
  /* Build overlay DOM once */
  if (document.getElementById('member-modal-overlay')) {
    /* overlay already exists — just re-attach click handlers for newly rendered nodes */
    attachModalTriggers();
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'member-modal-overlay';
  overlay.className = 'member-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-member-name');
  overlay.innerHTML = `
    <div class="member-modal">
      <div class="member-modal-photo" id="modal-photo">
        <div class="member-modal-initials" id="modal-initials"></div>
        <div class="member-modal-photo-bar"></div>
      </div>
      <div class="member-modal-body">
        <button class="member-modal-close" id="modal-close" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="member-modal-badge" id="modal-role"></div>
        <h2 class="member-modal-name" id="modal-member-name"></h2>
        <div class="member-modal-codename" id="modal-codename"></div>
        <hr class="member-modal-divider">
        <div class="member-modal-row">
          <div class="member-modal-icon"><i class="bi bi-mortarboard-fill"></i></div>
          <div>
            <div class="member-modal-label">Course / Programme</div>
            <div class="member-modal-value" id="modal-course"></div>
          </div>
        </div>
        <div class="member-modal-row" style="margin-top:.625rem;">
          <div class="member-modal-icon"><i class="bi bi-envelope-fill"></i></div>
          <div>
            <div class="member-modal-label">Email</div>
            <div class="member-modal-value" id="modal-email"></div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const closeModal = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  attachModalTriggers();
}

function attachModalTriggers() {
  document.querySelectorAll('[data-member]').forEach(el => {
    if (el.dataset.modalBound) return; // prevent double-binding
    el.dataset.modalBound = '1';
    el.addEventListener('click', () => openMemberModal(el.dataset.member));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMemberModal(el.dataset.member); }
    });
  });
}

function openMemberModal(memberJson) {
  const m = JSON.parse(memberJson);
  const overlay = document.getElementById('member-modal-overlay');

  document.getElementById('modal-role').textContent        = m.role;
  document.getElementById('modal-member-name').textContent = m.name;
  document.getElementById('modal-codename').textContent    = m.codename ? `@${m.codename}` : '';
  document.getElementById('modal-course').textContent      = m.course  || '—';

  const emailEl = document.getElementById('modal-email');
  emailEl.innerHTML = m.email
    ? `<a href="mailto:${m.email}">${m.email}</a>`
    : '—';

  /* Photo or initials fallback */
  const photoEl    = document.getElementById('modal-photo');
  const initialsEl = document.getElementById('modal-initials');
  const oldImg     = photoEl.querySelector('img');
  if (oldImg) oldImg.remove();

  initialsEl.style.display = '';
  initialsEl.textContent   = m.initials;

  if (m.photo) {
    const img = document.createElement('img');
    img.src   = m.photo;
    img.alt   = m.name;
    img.onerror = () => { img.remove(); initialsEl.style.display = ''; };
    photoEl.insertBefore(img, initialsEl);
    initialsEl.style.display = 'none';
  }

  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}


/* ─────────────────────────────────────────
   HALL OF FAME  →  hall-of-fame.html
───────────────────────────────────────── */
function renderPodium(podium) {
  const order  = [1, 0, 2]; // Silver left, Gold center, Bronze right
  const scales = ['scale(1.07)', 'scale(1)', 'scale(1)'];
  const colors = [
    'rgba(245,158,11,.15)',  // gold
    'rgba(148,163,184,.12)', // silver
    'rgba(205,127,50,.12)',  // bronze
  ];
  const borders = [
    'rgba(245,158,11,.4)',
    'rgba(148,163,184,.3)',
    'rgba(205,127,50,.3)',
  ];

  return order.filter(i => podium[i]).map(i => {
    const p = podium[i];
    return `
    <div class="hof-podium-item">
      <div class="podium-trophy">${p.trophy}</div>
      <div class="podium-card podium-${p.place}" style="transform:${scales[i]};">
        <div class="podium-name">${p.name}</div>
        <div class="podium-event">${p.event}</div>
        <div class="podium-detail">${p.detail}</div>
      </div>
    </div>`;
  }).join('');
}

function renderHofRow(a) {
  const typeClass = hof[a.type] || 'badge-navy';
  const typeLabel = badgeLabel[a.type] || a.type;
  const levelCls  = a.level === 'international' ? 'badge-red' : 'badge-navy';
  const levelLbl  = a.level === 'international' ? 'International' : 'National';

  return `
  <tr data-category="${a.year}">
    <td><span class="hof-place" style="color:${a.placeColor};">${a.placeEmoji} ${a.place}</span></td>
    <td>
      <div style="font-weight:600;font-family:var(--font-head);">${a.competition}</div>
      <div style="font-size:.78rem;color:var(--text-muted);">${a.organizer}</div>
    </td>
    <td style="font-size:.875rem;">${a.team}</td>
    <td><span class="badge ${typeClass}">${typeLabel}</span></td>
    <td><span class="badge ${levelCls}">${levelLbl}</span></td>
    <td class="hof-year">${a.year}</td>
  </tr>`;
}

function renderStarCard(s) {
  const init = s.initials || s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `
  <div class="card" style="text-align:center;">
    <div style="font-size:3rem;margin-bottom:.75rem;">${s.emoji}</div>
    <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--navy),var(--red));
      display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;
      font-family:var(--font-head);color:#fff;margin:0 auto .875rem;">${init}</div>
    <h3 style="font-family:var(--font-head);margin-bottom:.25rem;">${s.name}</h3>
    <div style="font-size:.78rem;color:var(--red-bright);font-family:var(--font-mono);margin-bottom:.5rem;">${s.award}</div>
    <p class="card-desc">${s.bio}</p>
  </div>`;
}

async function loadAchievements() {
  const podiumEl = document.getElementById('hof-podium');
  const tbodyEl  = document.getElementById('hof-tbody');
  const starsEl  = document.getElementById('hof-stars');
  if (!podiumEl && !tbodyEl && !starsEl) return;

  try {
    const data = await fetchJSON('data/achievements.json');
    if (podiumEl) podiumEl.innerHTML = renderPodium(data.podium);
    if (tbodyEl)  tbodyEl.innerHTML  = data.history.map(renderHofRow).join('');
    if (starsEl)  starsEl.innerHTML  = data.stars.map(renderStarCard).join('');
    initScrollReveal();
    initFilters();
  } catch (err) {
    console.error('[loadAchievements]', err);
    const msg = location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message;
    if (podiumEl) podiumEl.innerHTML = errorHTML(msg);
    if (tbodyEl)  tbodyEl.innerHTML  = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">${msg}</td></tr>`;
  }
}


/* ─────────────────────────────────────────
   LEADERBOARD  →  leaderboard.html
───────────────────────────────────────── */
async function loadLeaderboard() {
  const tbody   = document.getElementById('lb-body');
  const podium3 = document.getElementById('top3-podium');
  if (!tbody && !podium3) return;

  try {
    const players = await fetchJSON('data/players.json');
    if (tbody)   renderLbTable(players, tbody);
    if (podium3) renderTop3(players.slice(0, 3), podium3);
  } catch (err) {
    console.error('[loadLeaderboard]', err);
    const msg = location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message;
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">${msg}</td></tr>`;
  }
}

function renderLbTable(players, tbody) {
  const max = players[0]?.points || 1;
  tbody.innerHTML = players.map(p => {
    const rc   = p.rank <= 3 ? `rank-${p.rank}` : 'rank-n';
    const pct  = Math.round((p.points / max) * 100);
    const init = p.handle.slice(0, 2).toUpperCase();
    return `
    <tr>
      <td><span class="rank-badge ${rc}">${p.rank}</span></td>
      <td>
        <div class="player-cell">
          <div class="player-av">${init}</div>
          <div>
            <div class="player-name">@${p.handle}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="points-col">${p.points.toLocaleString()}</div>
        <div class="score-bar"><div class="score-fill" data-w="${pct}"></div></div>
      </td>
      <td class="font-mono text-sec">${p.solves}</td>
      <td class="text-muted" style="font-size:.82rem;">${p.specialty}</td>
    </tr>`;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.score-fill').forEach(el => { el.style.width = el.dataset.w + '%'; });
  }, 200);
}

function renderTop3(players, el) {
  const emojis  = ['🥇','🥈','🥉'];
  const scales  = ['scale(1.07)','scale(1)','scale(1)'];
  const order   = [1, 0, 2];
  el.innerHTML = order.filter(i => players[i]).map(i => {
    const p    = players[i];
    const init = p.handle.slice(0, 2).toUpperCase();
    return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:.75rem;">
      <div style="font-size:2.5rem;">${emojis[i]}</div>
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);
        padding:1.75rem 1.5rem;text-align:center;min-width:175px;transform:${scales[i]};">
        <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--navy),var(--red));
          display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:800;
          font-family:var(--font-head);color:#fff;margin:0 auto .875rem;">${init}</div>
        <div style="font-weight:700;font-family:var(--font-head);margin-bottom:.75rem;">@${p.handle}</div>
        <div style="font-size:1.5rem;font-weight:900;font-family:var(--font-head);color:var(--red-bright);">${p.points.toLocaleString()}</div>
        <div style="font-size:.7rem;color:var(--text-muted);font-family:var(--font-mono);">points</div>
      </div>
    </div>`;
  }).join('');
}


/* ─────────────────────────────────────────
   CODE COPY (writeup detail pages)
───────────────────────────────────────── */
function initCodeCopy() {
  document.querySelectorAll('pre code').forEach(block => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn'; btn.textContent = 'copy';
    block.parentNode.style.position = 'relative';
    block.parentNode.appendChild(btn);
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        btn.textContent = 'copied!';
        setTimeout(() => btn.textContent = 'copy', 2000);
      });
    });
  });
}


/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   GAMES  →  games.html
───────────────────────────────────────── */
const gameTypeColor = {
  puzzle:     'linear-gradient(90deg,#f59e0b,#fbbf24)',
  quiz:       'linear-gradient(90deg,#3b82f6,#60a5fa)',
  simulation: 'linear-gradient(90deg,#14b8a6,#2dd4bf)',
  challenge:  'linear-gradient(90deg,var(--red),var(--red-bright))',
  tool:       'linear-gradient(90deg,#a855f7,#c084fc)',
};
const gameThumbIcon = {
  puzzle: '🧩', quiz: '❓', simulation: '🖥️', challenge: '🚩', tool: '🛠️',
};

function renderGameCard(g) {
  const barGrad = gameTypeColor[g.type] || gameTypeColor.challenge;
  const icon    = gameThumbIcon[g.type] || '🎮';
  const thumb   = g.thumbnail
    ? `<img src="${g.thumbnail}" alt="${g.title}" loading="lazy">`
    : `<div class="game-card-thumb-icon">${icon}</div>`;
  const typeTag = g.type
    ? `<span class="tag tag-${g.type}">${g.type}</span>` : '';
  const diffTag = g.difficulty
    ? `<span class="tag tag-${g.difficulty}">${g.difficulty}</span>` : '';
  const techStr = g.tech
    ? `<span class="game-card-meta"><i class="bi bi-code-slash" style="margin-right:.3rem;"></i>${g.tech}</span>` : '';
  const playBtn = g.playLink
    ? `<a href="${g.playLink}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="bi bi-play-fill"></i> Play</a>` : '';
  const srcBtn  = g.sourceLink
    ? `<a href="${g.sourceLink}" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="bi bi-github"></i> Source</a>` : '';
  return `
  <div class="game-card" data-category="${g.type}" data-title="${g.title}">
    <div class="game-card-bar" style="background:${barGrad};"></div>
    <div class="game-card-thumb">${thumb}</div>
    <div class="game-card-body">
      <div class="game-card-tags">${typeTag}${diffTag}</div>
      <div class="game-card-title">${g.title}</div>
      <p class="game-card-desc">${g.description}</p>
      <div class="game-card-footer">
        ${techStr}
        <div style="display:flex;gap:.5rem;">${playBtn}${srcBtn}</div>
      </div>
    </div>
  </div>`;
}

async function loadGames() {
  const grid    = document.getElementById('games-grid');
  const countEl = document.getElementById('games-count');
  if (!grid) return;

  grid.innerHTML = loadingHTML();

  try {
    const games = await fetchJSON('data/games.json');
    grid.innerHTML = games.length
      ? games.map(renderGameCard).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🎮</div><p>No games yet — coming soon!</p></div>`;

    if (countEl) countEl.textContent = `${games.length} game${games.length !== 1 ? 's' : ''}`;

    initScrollReveal();
    initFilters();
  } catch (err) {
    console.error('[loadGames]', err);
    grid.innerHTML = errorHTML(location.protocol === 'file:' ? 'Open via a local server — fetch() does not work with file://' : err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initScrollReveal();
  initFilters();
  initContactForm();
  initCodeCopy();

  loadEventsPreview();  // index.html
  loadEvents();         // events.html
  loadBlog();           // blog.html
  loadMembers();        // org-chart.html
  loadAchievements();   // hall-of-fame.html
  loadLeaderboard();    // leaderboard.html
  loadGames();          // games.html
});
