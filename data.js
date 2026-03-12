// ============================================================
// DATA STORE — Edit this file to update holidays, leave, milestones
// ============================================================

const DATA = {

  // ── Date range ──
  startDate: '2026-03-01',
  endDate: '2026-05-31',

  // ── Team members ──
  // Add/remove members here. location: 'SL' or 'CA' (or any code)
  team: [
    { id: 'shashila',    name: 'Shashila Heshan',       short: 'Shashila',    role: 'CC / AI / Integrations',       location: 'SL', tz: 'GMT+5:30' },
    { id: 'kalpa',       name: 'Kalpa Thathsara',       short: 'Kalpa',       role: 'Mobile (Backend/Logic)',       location: 'SL', tz: 'GMT+5:30' },
    { id: 'yasiru',      name: 'Yasiru Nilan',          short: 'Yasiru',      role: 'Airline Validation',           location: 'SL', tz: 'GMT+5:30' },
    { id: 'waruna',      name: 'Waruna Samarasinghe',   short: 'Waruna',      role: 'Mobile UI/UX (Front-end)',     location: 'CA', tz: 'GMT-6' },
    { id: 'thiranjaya',  name: 'Thiranjaya Munasinghe', short: 'Thiranjaya',  role: 'Flights / CC / Validation',   location: 'SL', tz: 'GMT+5:30' },
    { id: 'pasindu',     name: 'Pasindu',               short: 'Pasindu',     role: 'TBD',                          location: 'SL', tz: 'GMT+5:30' },
    { id: 'tharaka',     name: 'Tharaka',               short: 'Tharaka',     role: 'TBD',                          location: 'SL', tz: 'GMT+5:30' },
    { id: 'kugapriyan',  name: 'Kugapriyan',            short: 'Kugapriyan',  role: 'TBD',                          location: 'SL', tz: 'GMT+5:30' },
    { id: 'thilini',     name: 'Thilini',               short: 'Thilini',     role: 'QA',                           location: 'SL', tz: 'GMT+5:30' },
  ],

  // ── Public holidays ──
  // regions: which location codes are affected. Weekends are auto-excluded.
  publicHolidays: [
    { date: '2026-04-01', name: 'Bak Full Moon Poya Day',          regions: ['SL'] },
    { date: '2026-04-13', name: 'Day before Sinhala/Tamil New Year', regions: ['SL'] },
    { date: '2026-04-14', name: 'Sinhala/Tamil New Year',          regions: ['SL'] },
    { date: '2026-05-01', name: 'Labour Day / Vesak Poya',         regions: ['SL'] },
  ],

  // ── Personal leave ──
  // type: 'confirmed' or 'tentative'
  personalLeave: [
    { memberId: 'waruna', date: '2026-05-12', type: 'confirmed', reason: 'Personal leave' },
    { memberId: 'waruna', date: '2026-05-13', type: 'confirmed', reason: 'Personal leave' },
    { memberId: 'waruna', date: '2026-05-14', type: 'confirmed', reason: 'Personal leave' },
    { memberId: 'waruna', date: '2026-05-15', type: 'tentative', reason: 'Personal leave (TBC)' },
    { memberId: 'thilini', date: '2026-04-15', type: 'confirmed', reason: 'Planned leave' },
    { memberId: 'thilini', date: '2026-04-16', type: 'confirmed', reason: 'Planned leave' },
    { memberId: 'thilini', date: '2026-04-17', type: 'confirmed', reason: 'Planned leave' },
  ],

  // ── Release milestones ──
  // Vertical markers on the Gantt chart. Source: Notion — Dynamic Trip Page PRD
  milestones: [
    { date: '2026-04-15', name: 'Dynamic Trip Pages V1 Ship', detail: 'Cornerstone mobile app feature — trip header, At a Glance timeline, day-by-day itinerary, component cards, detail view, feedback modals', color: '#dc2626' },
  ],

  // ── Sprint definitions ──
  // Note: From Sprint 9 onwards, cycles changed from 1 week to 2 weeks.
  sprints: [
    { name: 'Sprint 7',  start: '2026-03-01', end: '2026-03-07', weeks: 1 },
    { name: 'Sprint 8',  start: '2026-03-08', end: '2026-03-14', weeks: 1, note: 'Last 1-week sprint' },
    { name: 'Sprint 9',  start: '2026-03-15', end: '2026-03-28', weeks: 2, note: 'First 2-week sprint' },
    { name: 'Sprint 10', start: '2026-03-29', end: '2026-04-11', weeks: 2 },
    { name: 'Sprint 11', start: '2026-04-12', end: '2026-04-25', weeks: 2 },
    { name: 'Sprint 12', start: '2026-04-26', end: '2026-05-09', weeks: 2 },
    { name: 'Sprint 13', start: '2026-05-10', end: '2026-05-23', weeks: 2 },
    { name: 'Sprint 14', start: '2026-05-24', end: '2026-06-06', weeks: 2 },
  ],
};
