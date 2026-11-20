const $ = (selector) => document.querySelector(selector);
const state = { events: [], registrations: [], currentView: 'events', loading: false };
const coverClasses = ['','cover-1','cover-2','cover-3','cover-4','cover-5','cover-6'];
const userInput = $('#user-id');
userInput.value = localStorage.getItem('campuspulse-user-id') || '';
userInput.addEventListener('input', () => {
  localStorage.setItem('campuspulse-user-id', userInput.value.trim());
  if (state.currentView === 'registrations') loadRegistrations();
  renderEvents();
  if (state.currentView === 'organizer') renderOrganizer();
});

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
function currentUserId() { return userInput.value.trim(); }
function setApiState(ok, message) { const el = $('#api-state'); el.textContent = message; el.style.color = ok ? '#277554' : '#a33a4d'; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function titleCase(value) { return String(value || 'open').replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
function isOpen(event) { return !['closed','cancelled','canceled','full','ended','draft'].includes(String(event.status || '').toLowerCase()); }
function capacity(event) { const n = Number(event.capacity); return Number.isFinite(n) && n > 0 ? n : null; }
function eventId(event) { return escapeHtml(event.id); }
function notify(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 3200); }
function showError(target, message) { target.innerHTML = `<div class="error-box">${escapeHtml(message)}</div>`; }

async function loadEvents() {
  const grid = $('#events-grid');
  grid.innerHTML = '<div class="empty-state"><strong>Finding your next event…</strong>Loading the campus calendar.</div>';
  try {
    const events = await api('/api/events');
    state.events = Array.isArray(events) ? events : [];
    setApiState(true, 'API connected');
    $('#event-count').textContent = state.events.length;
    $('#open-count').textContent = state.events.filter(isOpen).length;
    $('#ticker-copy').textContent = state.events.length ? `${state.events.length} events are on the campus calendar` : 'Your campus calendar is ready for its first event';
    renderEvents();
    if (state.currentView === 'organizer') renderOrganizer();
    if (state.currentView === 'analytics') await loadAnalytics();
  } catch (error) {
    setApiState(false, 'API unavailable');
    showError(grid, `${error.message}. Check that the backend and Supabase settings are available.`);
  }
}
function renderEvents() {
  const query = $('#search-events').value.trim().toLowerCase();
  const status = $('#status-filter').value;
  let events = state.events.filter((event) => {
    const matchesQuery = `${event.title || ''} ${event.organizer_id || ''}`.toLowerCase().includes(query);
    const currentStatus = String(event.status || 'open').toLowerCase();
    const matchesStatus = status === 'all' || (status === 'open' ? isOpen(event) : currentStatus.includes(status));
    return matchesQuery && matchesStatus;
  });
  $('#results-count').textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'}`;
  const joined = new Set(state.registrations.map((row) => String(row.event_id)));
  if (!events.length) {
    $('#events-grid').innerHTML = `<div class="empty-state"><strong>${state.events.length ? 'No events match those filters' : 'The calendar is quiet for now'}</strong>${state.events.length ? 'Try another search or status.' : 'Events will appear here as they are added to the database.'}</div>`;
    return;
  }
  $('#events-grid').innerHTML = events.map((event, index) => {
    const cap = capacity(event), hasCount = event.registration_count !== undefined && event.registration_count !== null, count = Number(event.registration_count || 0), pct = cap ? Math.min(100, Math.round(count / cap * 100)) : 0;
    const joinedAlready = joined.has(String(event.id));
    const statusText = titleCase(event.status || 'Open');
    return `<article class="event-card"><div class="event-cover ${coverClasses[(index % 6) + 1]}"><span class="cover-label">CAMPUS PICK</span><span class="status-pill ${isOpen(event) ? '' : 'closed'}">${escapeHtml(statusText)}</span><span class="cover-mark">✳</span></div><div class="event-body"><div class="organizer-line"><span>HOSTED BY</span><span class="event-id">${escapeHtml(event.organizer_id || 'Campus community')}</span></div><h3>${escapeHtml(event.title || 'Untitled event')}</h3><div class="event-meta"><span>◷ &nbsp;Campus event</span><span>♧ &nbsp;${cap ? `${cap} seats` : 'Open capacity'}</span></div>${cap && hasCount ? `<div class="capacity"><div class="capacity-label"><span>Capacity</span><span>${count} / ${cap} spots</span></div><div class="capacity-track"><span class="${pct >= 100 ? 'full' : ''}" style="width:${pct}%"></span></div></div>` : ''}<div class="card-actions"><small>Event · ${eventId(event).slice(0,8)}</small>${joinedAlready ? '<span class="already-joined">✓ Registered</span>' : `<button class="button button-primary" data-register="${eventId(event)}" ${!isOpen(event) ? 'disabled' : ''}>${isOpen(event) ? 'Reserve a spot →' : 'Registration closed'}</button>`}</div></div></article>`;
  }).join('');
  $('#events-grid').querySelectorAll('[data-register]').forEach((button) => button.addEventListener('click', () => registerFor(button.dataset.register, button)));
  $('#events-grid').querySelectorAll('.event-card h3').forEach((heading, index) => heading.addEventListener('click', () => openEventDetails(events[index])));
}
async function registerFor(eventId, button) {
  const userId = currentUserId();
  if (!userId) { notify('Add your user UUID in the top bar before registering.'); userInput.focus(); return; }
  button.disabled = true; button.textContent = 'Reserving…';
  try {
    await api('/api/registrations', { method: 'POST', body: JSON.stringify({ user_id: userId, event_id: eventId }) });
    notify('Your spot is reserved. See you there!');
    await Promise.all([loadEvents(), loadRegistrations()]);
  } catch (error) { notify(error.message); button.disabled = false; button.textContent = 'Reserve a spot →'; }
}
function openEventDetails(event) {
  if (!event) return;
  $('#dialog-content').innerHTML = `<span class="eyebrow">CAMPUS EVENT</span><h2>${escapeHtml(event.title || 'Untitled event')}</h2><p>Event details from the CampusPulse events table.</p><div class="detail-details"><span><b>Status</b> &nbsp;${escapeHtml(titleCase(event.status || 'Open'))}</span><span><b>Organizer ID</b> &nbsp;${escapeHtml(event.organizer_id || 'Not listed')}</span><span><b>Capacity</b> &nbsp;${capacity(event) ?? 'Not specified'}</span><span><b>Event ID</b> &nbsp;<code>${eventId(event)}</code></span></div><button class="button button-primary detail-cta" data-modal-register="${eventId(event)}" ${!isOpen(event) ? 'disabled' : ''}>${isOpen(event) ? 'Reserve a spot' : 'Registration closed'}</button>`;
  const dialog = $('#detail-dialog'); dialog.showModal();
  dialog.querySelector('[data-modal-register]')?.addEventListener('click', (e) => { dialog.close(); const fakeButton = e.currentTarget; registerFor(fakeButton.dataset.modalRegister, fakeButton); });
}

async function loadRegistrations() {
  const target = $('#registrations-list');
  $('#my-reg-count').textContent = '…';
  const userId = currentUserId();
  if (!userId) {
    state.registrations = []; $('#my-reg-count').textContent = '0';
    target.innerHTML = '<div class="empty-state"><strong>Add your user UUID to get started</strong>Your user ID is used to look up your registrations. This app does not sign you in.</div>';
    renderEvents(); return;
  }
  try {
    const rows = await api(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`);
    state.registrations = Array.isArray(rows) ? rows : [];
    $('#my-reg-count').textContent = state.registrations.length;
    if (!state.registrations.length) target.innerHTML = '<div class="empty-state"><strong>No registrations yet</strong>Browse the event calendar and reserve a spot when something catches your eye.</div>';
    else target.innerHTML = state.registrations.map((registration) => {
      const event = state.events.find((item) => String(item.id) === String(registration.event_id));
      const created = registration.created_at ? new Date(registration.created_at).toLocaleDateString(undefined, {month:'short',day:'numeric',year:'numeric'}) : 'Registration confirmed';
      return `<article class="registration-row"><div class="registration-icon">✳</div><div><h3>${escapeHtml(event?.title || `Event ${String(registration.event_id).slice(0,8)}`)}</h3><p>CampusPulse event · Reserved ${escapeHtml(created)}</p><div class="reg-id">Registration ${escapeHtml(registration.id || '')}</div></div><div class="registration-actions"><span class="confirmed">Confirmed</span><span class="event-id">${escapeHtml(String(registration.event_id).slice(0,8))}</span></div></article>`;
    }).join('');
    renderEvents();
  } catch (error) { $('#my-reg-count').textContent = '—'; showError(target, error.message); }
}

async function getEventRegistrations(eventId) {
  return api(`/api/events/${encodeURIComponent(eventId)}/registrations`);
}
async function renderOrganizer() {
  const id = currentUserId();
  const target = $('#organizer-events');
  if (!id) {
    $('#organizer-event-count').textContent = '—'; $('#organizer-reg-count').textContent = '—'; $('#organizer-fill').textContent = '—';
    target.innerHTML = '<div class="empty-state"><strong>Enter your organizer UUID</strong>Events are matched against the organizer_id column.</div>'; return;
  }
  const events = state.events.filter((event) => String(event.organizer_id || '') === id);
  $('#organizer-event-count').textContent = events.length;
  target.innerHTML = '<div class="empty-state">Loading attendee counts…</div>';
  try {
    const results = await Promise.all(events.map(async (event) => ({event, registrations: await getEventRegistrations(event.id)})));
    const total = results.reduce((sum, row) => sum + row.registrations.length, 0);
    const totalCapacity = events.reduce((sum, event) => sum + (capacity(event) || 0), 0);
    $('#organizer-reg-count').textContent = total;
    $('#organizer-fill').textContent = totalCapacity ? `${Math.round(total / totalCapacity * 100)}%` : '—';
    if (!results.length) { target.innerHTML = '<div class="empty-state"><strong>No hosted events found</strong>There are no events with this organizer ID.</div>'; return; }
    target.innerHTML = `<table class="data-table"><thead><tr><th>Event</th><th>Status</th><th>Capacity</th><th>Registrations</th><th>Attendees</th></tr></thead><tbody>${results.map(({event, registrations}) => `<tr><td><strong>${escapeHtml(event.title || 'Untitled event')}</strong><br><code class="event-id">${eventId(event)}</code></td><td>${escapeHtml(titleCase(event.status || 'Open'))}</td><td>${capacity(event) ?? '—'}</td><td>${registrations.length}</td><td><button class="button button-quiet attendee-button" data-event="${eventId(event)}">View list</button></td></tr>`).join('')}</tbody></table>`;
    target.querySelectorAll('.attendee-button').forEach((button, index) => button.addEventListener('click', () => showAttendees(results[index].event, results[index].registrations)));
  } catch (error) { showError(target, `Could not load organizer data: ${error.message}`); }
}
function showAttendees(event, registrations) {
  const ids = registrations.map((row) => `<li><code>${escapeHtml(row.user_id || 'User ID unavailable')}</code><small>${escapeHtml(row.created_at ? new Date(row.created_at).toLocaleString() : '')}</small></li>`).join('');
  $('#dialog-content').innerHTML = `<span class="eyebrow">ATTENDEE LIST</span><h2>${escapeHtml(event.title || 'Event attendees')}</h2><p>${registrations.length} ${registrations.length === 1 ? 'registration' : 'registrations'}</p><div class="detail-details"><ul class="attendee-list">${ids || '<li>No registrations yet.</li>'}</ul></div>`;
  $('#detail-dialog').showModal();
}

async function loadAnalytics() {
  try {
    const eventResults = await Promise.all(state.events.map(async (event) => ({event, rows: await getEventRegistrations(event.id)})));
    const registrationTotal = eventResults.reduce((sum, row) => sum + row.rows.length, 0);
    const openTotal = state.events.filter(isOpen).length;
    const totalCapacity = state.events.reduce((sum, event) => sum + (capacity(event) || 0), 0);
    const capacityUsed = totalCapacity ? Math.round(registrationTotal / totalCapacity * 100) : 0;
    $('#analytics-events').textContent = state.events.length;
    $('#analytics-regs').textContent = registrationTotal;
    $('#analytics-open').textContent = openTotal;
    $('#analytics-capacity').textContent = totalCapacity ? `${capacityUsed}%` : '—';
    $('#db-events').textContent = state.events.length;
    $('#db-registrations').textContent = registrationTotal;
    const bins = Array.from({length:7}, () => 0);
    for (const {rows} of eventResults) for (const row of rows) {
      const d = row.created_at ? new Date(row.created_at) : new Date();
      const age = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
      if (age < 7) bins[6 - age]++;
    }
    const peak = Math.max(1, ...bins);
    const labels = ['6d','5d','4d','3d','2d','1d','Today'];
    $('#activity-chart').innerHTML = bins.map((value,index) => `<div class="chart-column"><span class="chart-bar ${value ? '' : 'zero'}" style="height:${Math.max(3, value / peak * 100)}%" title="${value} registrations"></span><small>${labels[index]}</small></div>`).join('');
    $('.chart-legend')?.remove();
  } catch (error) {
    $('#activity-chart').innerHTML = `<div class="error-box">Could not load registration analytics: ${escapeHtml(error.message)}</div>`;
  }
}

function activateView(view) {
  state.currentView = view;
  document.querySelectorAll('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
  document.querySelectorAll('.nav-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
  if (view === 'registrations') loadRegistrations();
  if (view === 'organizer') renderOrganizer();
  if (view === 'analytics') loadAnalytics();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-tab').forEach((tab) => tab.addEventListener('click', () => activateView(tab.dataset.view)));
$('#search-events').addEventListener('input', renderEvents);
$('#status-filter').addEventListener('change', renderEvents);
$('#refresh-events').addEventListener('click', loadEvents);
$('#refresh-organizer').addEventListener('click', renderOrganizer);
$('#refresh-analytics').addEventListener('click', loadAnalytics);
$('#close-dialog').addEventListener('click', () => $('#detail-dialog').close());
$('#detail-dialog').addEventListener('click', (event) => { if (event.target === $('#detail-dialog')) $('#detail-dialog').close(); });
loadEvents().then(() => { if (currentUserId()) loadRegistrations(); });
