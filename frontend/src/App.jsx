import { useEffect, useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const categories = ['All Pulse', 'Tech & Hackathons', 'Cultural & Social', 'Career & Networking', 'Workshops'];
const navigation = [
  ['discover', 'Explore events', 'explore'],
  ['registrations', 'My registrations', 'confirmation_number'],
  ['organizer', 'Organizer view', 'dashboard'],
  ['analytics', 'Analytics', 'query_stats'],
];

function icon(name, extra = '') { return <span className={`material-symbols-outlined ${extra}`}>{name}</span>; }
function text(value, fallback = '') { return value === null || value === undefined || value === '' ? fallback : String(value); }
function eventDate(event) {
  const raw = event.date || event.start_date || event.starts_at || event.event_date;
  if (!raw) return { month: 'TBA', day: '—', full: 'Date to be announced' };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return { month: 'TBA', day: '—', full: text(raw) };
  return { month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(), day: date.getDate(), full: date.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' }) };
}
function eventTitle(event) { return text(event.title || event.name, 'Campus event'); }
function eventCategory(event) { return text(event.category || event.type, 'Campus life'); }
function eventLocation(event) { return text(event.location || event.venue, 'Location to be announced'); }
function eventImage(event, index) {
  return event.image_url || event.image || [
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=85',
  ][index % 4];
}
function errorMessage(error) { return error?.message || 'Something went wrong. Please try again.'; }

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options?.body ? { 'Content-Type': 'application/json' } : {}), ...options?.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload;
}

function App() {
  const [view, setView] = useState('discover');
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [userId, setUserId] = useState(() => localStorage.getItem('campuspulse-user-id') || '');
  const [userInput, setUserInput] = useState(() => localStorage.getItem('campuspulse-user-id') || '');
  const [selectedCategory, setSelectedCategory] = useState('All Pulse');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyEvent, setBusyEvent] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadEvents = async () => {
    setLoading(true); setError('');
    try { const data = await api('/api/events'); setEvents(Array.isArray(data) ? data : []); setApiStatus('online'); }
    catch (err) { setError(errorMessage(err)); setApiStatus('offline'); }
    finally { setLoading(false); }
  };

  const loadRegistrations = async (id = userId) => {
    if (!id) { setRegistrations([]); return; }
    try {
      const data = await api(`/api/me/registrations?user_id=${encodeURIComponent(id)}`);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) { setError(errorMessage(err)); }
  };

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { if (userId) loadRegistrations(userId); }, [userId]);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const category = eventCategory(event).toLowerCase();
    const matchesCategory = selectedCategory === 'All Pulse' || category.includes(selectedCategory.split(' ')[0].toLowerCase()) || (selectedCategory === 'Tech & Hackathons' && /tech|hack|robot|ai/i.test(category)) || (selectedCategory === 'Cultural & Social' && /social|cultur|music|film/i.test(category)) || (selectedCategory === 'Career & Networking' && /career|network|professional/i.test(category)) || (selectedCategory === 'Workshops' && /workshop|class|seminar/i.test(category));
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [eventTitle(event), eventCategory(event), eventLocation(event), event.description].some((value) => text(value).toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  }), [events, selectedCategory, search]);

  const submitUser = (event) => {
    event.preventDefault();
    const id = userInput.trim();
    if (!id) { setError('Enter your database user ID to view or create registrations.'); return; }
    localStorage.setItem('campuspulse-user-id', id);
    setUserId(id); setError(''); setNotice('User ID saved on this device. No account or sign-in is used.');
    window.setTimeout(() => setNotice(''), 3500);
  };

  const register = async (event) => {
    if (!userId) { setError('Enter your database user ID in the header before registering.'); return; }
    setBusyEvent(String(event.id)); setError(''); setNotice('');
    try {
      await api('/api/registrations', { method: 'POST', body: JSON.stringify({ user_id: userId, event_id: event.id }) });
      setNotice(`You're registered for ${eventTitle(event)}.`);
      await loadRegistrations(userId);
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusyEvent(''); }
  };

  const title = navigation.find(([id]) => id === view)?.[1] || 'Explore events';
  const registeredEventIds = new Set(registrations.map((row) => String(row.event_id)));
  const userEvents = events.filter((event) => registeredEventIds.has(String(event.id)));
  const organizerEvents = userId ? events.filter((event) => String(event.organizer_id || '') === userId) : [];
  const registrationTotal = events.reduce((sum, event) => sum + (Number(event.registration_count ?? event.registrations_count ?? 0) || 0), 0);

  return <div className="app-shell">
    <header className={`topbar ${menuOpen ? 'nav-open' : ''}`}>
      <a className="brand" href="#discover" onClick={(e) => { e.preventDefault(); setView('discover'); }}><span className="brand-mark">✳</span><span>Campus<span>Pulse</span></span></a>
      <nav className="main-nav" aria-label="Main navigation">{navigation.map(([id, label, glyph]) => <button key={id} className={`nav-link ${view === id ? 'active' : ''}`} onClick={() => { setView(id); setMenuOpen(false); }}>{icon(glyph)}{label}</button>)}</nav>
      <div className="user-controls">
        <span className={`api-indicator api-${apiStatus}`}><i /> API {apiStatus}</span>
        <form className="user-form" onSubmit={submitUser}>
          <label className="sr-only" htmlFor="user-id">Database user ID</label>
          <input id="user-id" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Your database user ID" />
          <button aria-label="Save user ID" title="Save user ID">{icon('arrow_forward')}</button>
        </form>
      </div>
      <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{icon(menuOpen ? 'close' : 'menu')}</button>
    </header>

    <main>
      <div className="ticker"><div className="ticker-inner"><span className="ticker-icon">{icon('bolt')}</span><strong>YOUR CAMPUS, IN MOTION</strong><span className="ticker-separator">/</span><span>Find your next favorite thing to do.</span><span className="ticker-right">{events.length} events in the pulse <span className="live-dot" /></span></div></div>
      <div className="page-wrap">
        {(error || notice) && <div className={`notice ${error ? 'notice-error' : 'notice-success'}`} role="status"><span>{error || notice}</span><button aria-label="Dismiss" onClick={() => { setError(''); setNotice(''); }}>×</button></div>}
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> CAMPUS LIFE, RIGHT NOW</div><h1>{view === 'discover' ? <>Discover what’s happening <span>on campus.</span></> : title}</h1><p>{view === 'discover' ? 'Good things happen when you show up. Find a room, a community, or your next big idea.' : 'A live view of campus activity, powered by your event data.'}</p></div><div className="heading-art" aria-hidden="true"><span>✳</span><b>MAKE<br/>YOUR<br/>MOMENT</b></div></div>

        <section className="stats-row" aria-label="Campus stats">
          <div className="stat-card"><div className="stat-icon indigo">{icon('local_activity')}</div><div><span className="stat-value">{events.length}</span><span className="stat-label">Events to explore</span></div><span className="stat-note">LIVE DATA</span></div>
          <div className="stat-card"><div className="stat-icon gold">{icon('confirmation_number')}</div><div><span className="stat-value">{userId ? registrations.length : '—'}</span><span className="stat-label">Your registrations</span></div><span className="stat-note">{userId ? 'YOUR ID' : 'ADD YOUR ID'}</span></div>
          <div className="stat-card"><div className="stat-icon coral">{icon('groups')}</div><div><span className="stat-value">{registrationTotal || '—'}</span><span className="stat-label">Registrations tracked</span></div><span className="stat-note">FROM API</span></div>
        </section>

        {view === 'discover' && <>
          <section className="search-row"><div><h2>Find your people.</h2><p>There’s a seat with your name on it.</p></div><label className="search-box">{icon('search')}<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events, places, interests..." /><kbd>⌘ K</kbd></label></section>
          <div className="category-row" role="group" aria-label="Filter by category">{categories.map((cat, i) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`category-chip ${selectedCategory === cat ? 'selected' : ''}`}>{icon(['auto_awesome', 'terminal', 'celebration', 'work', 'draw'][i])}{cat}</button>)}</div>
          <section className="section-heading"><div><span className="section-kicker">THE GOOD STUFF</span><h2>Happening around campus <span className="count-pill">{filteredEvents.length}</span></h2></div><button className="text-button" onClick={loadEvents}>Refresh {icon('refresh')}</button></section>
          {loading ? <div className="state-panel"><div className="spinner" />Loading events from your backend…</div> : filteredEvents.length ? <div className="event-grid">{filteredEvents.map((event, i) => <EventCard key={event.id || i} event={event} index={i} registered={registeredEventIds.has(String(event.id))} busy={busyEvent === String(event.id)} onRegister={() => register(event)} />)}</div> : <div className="state-panel">{error ? 'Could not load events. Check that your backend is running and the URL is correct.' : 'No events match this filter yet.'}</div>}
        </>}

        {view === 'registrations' && <section className="dashboard-section"><div className="section-heading"><div><span className="section-kicker">YOUR CAMPUS PLANS</span><h2>My registrations</h2><p className="section-copy">Your saved event passes linked to the database user ID you entered above.</p></div><button className="text-button" onClick={() => loadRegistrations()}>Refresh {icon('refresh')}</button></div>{!userId ? <div className="state-panel">Enter your database user ID above to see registrations. This does not sign you in.</div> : userEvents.length ? <div className="event-grid">{userEvents.map((event, i) => <EventCard key={event.id || i} event={event} index={i} registered busy={false} onRegister={() => {}} />)}</div> : <div className="empty-card"><div className="empty-icon">{icon('confirmation_number')}</div><h3>Your next good story starts here.</h3><p>You don’t have any registrations yet. Explore campus events and claim your spot.</p><button className="primary-button" onClick={() => setView('discover')}>Explore events {icon('arrow_forward')}</button></div>}</section>}

        {view === 'organizer' && <section className="dashboard-section"><div className="section-heading"><div><span className="section-kicker">MADE BY YOU</span><h2>Organizer dashboard</h2><p className="section-copy">Events whose organizer ID matches the database user ID in the header.</p></div></div>{!userId ? <div className="state-panel">Enter your organizer database user ID above to see events you manage.</div> : organizerEvents.length ? <div className="data-table-wrap"><table><thead><tr><th>EVENT</th><th>DATE</th><th>LOCATION</th><th>CAPACITY</th><th>STATUS</th></tr></thead><tbody>{organizerEvents.map((event) => <tr key={event.id}><td><strong>{eventTitle(event)}</strong><small>{eventCategory(event)}</small></td><td>{eventDate(event).full}</td><td>{eventLocation(event)}</td><td>{text(event.capacity, '—')}</td><td><span className="status-pill">Published</span></td></tr>)}</tbody></table></div> : <div className="empty-card"><div className="empty-icon">{icon('event_available')}</div><h3>No events found for this organizer ID.</h3><p>Organizer event creation is not available in the current backend API.</p></div>}</section>}

        {view === 'analytics' && <section className="dashboard-section"><div className="section-heading"><div><span className="section-kicker">THE CAMPUS PULSE</span><h2>Event analytics</h2><p className="section-copy">Summary based on the events returned by your backend.</p></div><button className="text-button" onClick={loadEvents}>Refresh {icon('refresh')}</button></div><div className="analytics-grid"><div className="analytics-card"><span>Total events</span><strong>{events.length}</strong><small>Loaded from <code>/api/events</code></small></div><div className="analytics-card"><span>My registrations</span><strong>{userId ? registrations.length : '—'}</strong><small>{userId ? 'Loaded from /api/me/registrations' : 'Add your user ID to view'}</small></div><div className="analytics-card"><span>Organizer events</span><strong>{userId ? organizerEvents.length : '—'}</strong><small>Matched by organizer ID</small></div></div><div className="data-table-wrap"><table><thead><tr><th>EVENT</th><th>CATEGORY</th><th>DATE</th><th>REGISTRATIONS</th></tr></thead><tbody>{events.map((event, i) => <tr key={event.id || i}><td><strong>{eventTitle(event)}</strong><small>{eventLocation(event)}</small></td><td>{eventCategory(event)}</td><td>{eventDate(event).full}</td><td>{text(event.registration_count ?? event.registrations_count, '—')}</td></tr>)}</tbody></table></div></section>}
      </div>
    </main>
    <footer><span className="brand brand-footer"><span className="brand-mark">✳</span><span>Campus<span>Pulse</span></span></span><span>Show up. Find your people. Make it count.</span><span>Campus events · Live from your backend</span></footer>
  </div>;
}

function EventCard({ event, index, registered, busy, onRegister }) {
  const date = eventDate(event);
  const capacity = Number(event.capacity);
  const current = Number(event.registration_count ?? event.registrations_count ?? 0);
  const remaining = Number.isFinite(capacity) && capacity > 0 ? Math.max(capacity - current, 0) : null;
  return <article className="event-card">
    <div className={`event-cover cover-${index % 4}`} style={{ backgroundImage: `linear-gradient(180deg,rgba(18,22,48,.02),rgba(18,22,48,.55)),url("${eventImage(event, index)}")` }}>
      <span className="date-stamp"><b>{date.day}</b><small>{date.month}</small></span><span className="category-label">{eventCategory(event)}</span><button className="save-button" aria-label="Save event" title="Save event">{icon('favorite')}</button>
    </div>
    <div className="event-body"><div className="event-meta"><span>{icon('schedule')}{date.full}{event.time ? ` · ${event.time}` : ''}</span><span>{icon('location_on')}{eventLocation(event)}</span></div><h3>{eventTitle(event)}</h3><p className="event-description">{text(event.description, 'Come along, meet new people, and be part of something happening on campus.')}</p>
      <div className="event-footer"><div className="host"><span className="host-avatar">{text(event.organizer_name, 'C').charAt(0).toUpperCase()}</span><span><small>HOSTED BY</small><b>{text(event.organizer_name || event.organizer, 'Campus community')}</b></span></div><div className="event-action">{remaining !== null && <span className={`seats ${remaining < 10 ? 'urgent' : ''}`}>{remaining} seats left</span>}<button className={`register-button ${registered ? 'is-registered' : ''}`} disabled={registered || busy} onClick={onRegister}>{registered ? <>You’re in {icon('check')}</> : busy ? 'Joining…' : <>Count me in {icon('arrow_forward')}</>}</button></div></div>
    </div>
  </article>;
}

export default App;
