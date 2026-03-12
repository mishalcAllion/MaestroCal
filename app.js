// ============================================================
// RENDER LOGIC — Reads from DATA (defined in data.js)
// ============================================================

(function() {
  // ── Utility functions ──
  function parseDate(str) { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d); }
  function formatDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function dayNames() { return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; }
  function monthNames() { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; }
  function sameDay(a, b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  const today = new Date(); today.setHours(0,0,0,0);
  const startDate = parseDate(DATA.startDate);
  const endDate = parseDate(DATA.endDate);

  // Generate all days in range
  const days = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  // Build lookup maps
  const holidayMap = {};
  DATA.publicHolidays.forEach(h => { holidayMap[h.date] = h; });

  const leaveMap = {};
  DATA.personalLeave.forEach(l => {
    if (!leaveMap[l.memberId]) leaveMap[l.memberId] = {};
    leaveMap[l.memberId][l.date] = { type: l.type, reason: l.reason || '' };
  });

  // ── Set generated date ──
  document.getElementById('generated-date').textContent = `Generated: ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

  // ── Render team names panel ──
  const teamNamesEl = document.getElementById('team-names');
  DATA.team.forEach((member, idx) => {
    const bgClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50';
    const badgeClass = member.location === 'CA' ? 'location-badge-ca' : 'location-badge-sl';
    teamNamesEl.innerHTML += `
      <div class="h-11 border-b border-slate-100 flex items-center px-3 gap-2 ${bgClass}">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-slate-800 truncate">${member.short}</div>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeClass} flex-shrink-0">${member.location} ${member.tz}</span>
      </div>`;
  });

  // ── Render calendar grid ──
  const calGrid = document.getElementById('calendar-grid');
  let html = '';
  const colW = 34;
  const totalW = days.length * colW;

  // ── Month header row ──
  html += `<div class="flex h-8 border-b border-slate-200 bg-slate-50" style="width:${totalW}px;">`;
  let monthStart = 0;
  for (let i = 0; i <= days.length; i++) {
    if (i === days.length || (i > 0 && days[i].getMonth() !== days[i-1].getMonth())) {
      const span = i - monthStart;
      const mName = monthNames()[days[monthStart].getMonth()] + ' ' + days[monthStart].getFullYear();
      html += `<div class="flex items-center justify-center text-xs font-bold text-slate-600 border-r border-slate-200" style="width:${span*colW}px;">${mName}</div>`;
      monthStart = i;
    }
  }
  html += `</div>`;

  // ── Sprint header row ──
  html += `<div class="flex h-9 border-b border-slate-200" style="width:${totalW}px;">`;
  let dayIdx = 0;
  DATA.sprints.forEach((sprint, sIdx) => {
    const sStart = parseDate(sprint.start);
    const sEnd = parseDate(sprint.end);
    let count = 0;
    let firstInRange = -1;
    days.forEach((d, di) => {
      if (d >= sStart && d <= sEnd) {
        count++;
        if (firstInRange === -1) firstInRange = di;
      }
    });
    if (count > 0) {
      if (firstInRange > dayIdx) {
        const gap = firstInRange - dayIdx;
        html += `<div style="width:${gap*colW}px;"></div>`;
        dayIdx = firstInRange;
      }
      const bgColor = sIdx % 2 === 0 ? 'bg-blue-50' : 'bg-emerald-50';
      const borderColor = sIdx % 2 === 0 ? 'border-blue-200' : 'border-emerald-200';
      const textColor = sIdx % 2 === 0 ? 'text-blue-700' : 'text-emerald-700';
      const dateRange = `${sStart.getDate()}/${sStart.getMonth()+1} - ${sEnd.getDate()}/${sEnd.getMonth()+1}`;
      const label = count >= 4 ? `<div class="text-[10px] font-bold ${textColor}">${sprint.name}</div><div class="text-[8px] ${textColor} opacity-70">${dateRange}</div>` :
                    count >= 2 ? `<div class="text-[9px] font-bold ${textColor}">${sprint.name}</div>` :
                    `<div class="text-[8px] font-bold ${textColor}">S</div>`;
      html += `<div class="${bgColor} border-x ${borderColor} flex flex-col items-center justify-center leading-tight" style="width:${count*colW}px;">${label}</div>`;
      dayIdx = firstInRange + count;
    }
  });
  html += `</div>`;

  // ── Day headers (number + day name) ──
  html += `<div class="flex h-12 border-b border-slate-300 bg-slate-50" style="width:${totalW}px;">`;
  days.forEach(d => {
    const isToday = sameDay(d, today);
    const isWE = isWeekend(d);
    const dayNum = d.getDate();
    const dayName = dayNames()[d.getDay()][0];
    const bg = isToday ? 'bg-blue-100' : isWE ? 'bg-slate-100' : 'bg-slate-50';
    const textW = isToday ? 'font-bold text-blue-700' : isWE ? 'text-slate-400' : 'text-slate-600';
    const border = d.getDate() === 1 ? 'border-l-2 border-l-slate-400' : '';
    html += `<div class="day-col flex flex-col items-center justify-center ${bg} ${border} border-r border-slate-100">
      <span class="text-[10px] font-semibold ${textW}">${dayNum}</span>
      <span class="text-[9px] ${textW}">${dayName}</span>
    </div>`;
  });
  html += `</div>`;

  // ── Team member rows ──
  DATA.team.forEach((member, mIdx) => {
    const rowBg = mIdx % 2 === 0 ? '' : 'bg-slate-50/30';
    html += `<div class="flex h-11 border-b border-slate-100 ${rowBg}" style="width:${totalW}px;">`;

    days.forEach(d => {
      const dateStr = formatDate(d);
      const isToday = sameDay(d, today);
      const isWE = isWeekend(d);
      const holiday = holidayMap[dateStr];
      const leave = leaveMap[member.id] ? leaveMap[member.id][dateStr] : null;
      const border = d.getDate() === 1 ? 'border-l-2 border-l-slate-300' : '';

      let cellClass = 'cell-working';
      let tooltip = '';
      let cellContent = '';

      if (isWE) {
        cellClass = 'cell-weekend';
      } else if (holiday && holiday.regions.includes(member.location)) {
        cellClass = 'cell-holiday';
        tooltip = holiday.name;
        cellContent = '<span class="text-red-600 text-[9px] font-bold">H</span>';
      } else if (leave) {
        if (leave.type === 'tentative') {
          cellClass = 'cell-tentative';
          tooltip = leave.reason + ' (Tentative)';
          cellContent = '<span class="text-yellow-700 text-[9px] font-bold">?</span>';
        } else {
          cellClass = 'cell-leave';
          tooltip = leave.reason;
          cellContent = '<span class="text-orange-800 text-[9px] font-bold">L</span>';
        }
      }

      const todayClass = isToday ? 'cell-today' : '';
      const tooltipHtml = tooltip ? `<div class="tooltip">${cellContent}<span class="tooltip-text">${tooltip}</span></div>` : cellContent;

      html += `<div class="day-col flex items-center justify-center ${cellClass} ${todayClass} ${border} border-r border-slate-50">${tooltipHtml}</div>`;
    });

    html += `</div>`;
  });

  calGrid.innerHTML = html;

  // ── Render milestone markers ──
  if (DATA.milestones && DATA.milestones.length) {
    DATA.milestones.forEach(ms => {
      const msDate = parseDate(ms.date);
      const dayIndex = days.findIndex(d => sameDay(d, msDate));
      if (dayIndex === -1) return;

      const leftPx = dayIndex * colW + Math.floor(colW / 2);

      // Vertical line
      const line = document.createElement('div');
      line.className = 'milestone-line';
      line.style.left = leftPx + 'px';
      line.style.background = ms.color;
      line.style.opacity = '0.45';
      calGrid.appendChild(line);

      // Flag label
      const flag = document.createElement('div');
      flag.className = 'milestone-flag tooltip';
      flag.style.left = leftPx + 'px';
      flag.style.transform = 'translateX(-50%)';
      flag.innerHTML = `<span class="milestone-flag-label" style="background:${ms.color};color:#fff;">${ms.name}</span><span class="tooltip-text" style="background:#1e293b;color:#fff;font-weight:400;font-size:10px;max-width:240px;white-space:normal;">${ms.detail}</span>`;
      calGrid.appendChild(flag);
    });
  }

  // ── Render holiday summary ──
  const summaryEl = document.getElementById('holiday-summary');
  let summaryHtml = '';

  DATA.publicHolidays.forEach(h => {
    const d = parseDate(h.date);
    if (!isWeekend(d)) {
      const dayName = dayNames()[d.getDay()];
      const affectedMembers = DATA.team.filter(m => h.regions.includes(m.location)).map(m => m.short).join(', ');
      summaryHtml += `<div class="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
        <span class="w-2 h-2 mt-1 rounded-full bg-red-400 flex-shrink-0"></span>
        <div><strong>${h.name}</strong> — ${dayName}, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br/>
        <span class="text-slate-500">Affects: ${affectedMembers}</span></div>
      </div>`;
    }
  });

  const leaveByMember = {};
  DATA.personalLeave.forEach(l => {
    if (!leaveByMember[l.memberId]) leaveByMember[l.memberId] = [];
    leaveByMember[l.memberId].push(l);
  });
  Object.keys(leaveByMember).forEach(mId => {
    const member = DATA.team.find(m => m.id === mId);
    const leaves = leaveByMember[mId];
    const confirmed = leaves.filter(l => l.type === 'confirmed');
    const tentative = leaves.filter(l => l.type === 'tentative');
    let desc = '';
    if (confirmed.length) {
      const dates = confirmed.map(l => {
        const d = parseDate(l.date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }).join(', ');
      desc += `Confirmed: ${dates}`;
    }
    if (tentative.length) {
      const dates = tentative.map(l => {
        const d = parseDate(l.date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }).join(', ');
      desc += (desc ? ' | ' : '') + `Tentative: ${dates}`;
    }
    summaryHtml += `<div class="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
      <span class="w-2 h-2 mt-1 rounded-full bg-orange-400 flex-shrink-0"></span>
      <div><strong>${member ? member.name : mId}</strong> — Personal Leave<br/>
      <span class="text-slate-500">${desc}</span></div>
    </div>`;
  });

  summaryEl.innerHTML = summaryHtml;

  // ── Render milestone summary ──
  const mileSummaryEl = document.getElementById('milestone-summary');
  if (mileSummaryEl && DATA.milestones) {
    let mileHtml = '';
    DATA.milestones.forEach(ms => {
      const d = parseDate(ms.date);
      const dayName = dayNames()[d.getDay()];
      const sprint = DATA.sprints.find(s => d >= parseDate(s.start) && d <= parseDate(s.end));
      const sprintLabel = sprint ? sprint.name : '';
      mileHtml += `<div class="flex items-start gap-2 p-2 rounded-lg" style="background:${ms.color}10;border:1px solid ${ms.color}30;">
        <span class="w-2 h-2 mt-1 rounded-full flex-shrink-0" style="background:${ms.color};"></span>
        <div><strong style="color:${ms.color};">${ms.name}</strong> — ${dayName}, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${sprintLabel})<br/>
        <span class="text-slate-500">${ms.detail}</span></div>
      </div>`;
    });
    mileSummaryEl.innerHTML = mileHtml;
  }

  // ── Render sprint impact summary ──
  const impactEl = document.getElementById('impact-table');
  let impactHtml = '<table class="w-full text-xs"><thead><tr class="text-left text-slate-500 border-b border-slate-200">';
  impactHtml += '<th class="py-2 pr-3 font-semibold">Sprint</th><th class="py-2 pr-3 font-semibold">Dates</th><th class="py-2 pr-3 font-semibold">Working Days</th><th class="py-2 pr-3 font-semibold">Holidays/Leave Impact</th><th class="py-2 font-semibold">Team Capacity</th>';
  impactHtml += '</tr></thead><tbody>';

  DATA.sprints.forEach(sprint => {
    const sStart = parseDate(sprint.start);
    const sEnd = parseDate(sprint.end) > endDate ? endDate : parseDate(sprint.end);
    if (sStart > endDate) return;

    let totalWorkingDays = 0;
    let totalAvailableDays = 0;
    const teamSize = DATA.team.length;
    let impactNotes = [];

    let d = new Date(sStart);
    while (d <= sEnd) {
      if (!isWeekend(d)) {
        totalWorkingDays++;
        const dateStr = formatDate(d);
        const holiday = holidayMap[dateStr];

        DATA.team.forEach(member => {
          const memberLeave = leaveMap[member.id] ? leaveMap[member.id][dateStr] : null;
          const isHoliday = holiday && holiday.regions.includes(member.location);

          if (!isHoliday && (!memberLeave || memberLeave.type === 'tentative')) {
            totalAvailableDays++;
          }
        });

        if (holiday) {
          const affected = DATA.team.filter(m => holiday.regions.includes(m.location)).length;
          if (!impactNotes.find(n => n.includes(holiday.name))) {
            impactNotes.push(`${holiday.name} (-${affected} devs)`);
          }
        }
      }
      d = addDays(d, 1);
    }

    DATA.personalLeave.forEach(l => {
      const ld = parseDate(l.date);
      if (ld >= sStart && ld <= sEnd && !isWeekend(ld) && l.type === 'confirmed') {
        const member = DATA.team.find(m => m.id === l.memberId);
        if (member && !impactNotes.find(n => n.includes(member.short + ' leave'))) {
          const leaveCount = DATA.personalLeave.filter(ll => {
            const lld = parseDate(ll.date);
            return ll.memberId === l.memberId && lld >= sStart && lld <= sEnd && ll.type === 'confirmed';
          }).length;
          impactNotes.push(`${member.short} leave (${leaveCount}d)`);
        }
      }
    });

    const maxCapacity = totalWorkingDays * teamSize;
    const capacityPct = maxCapacity > 0 ? Math.round((totalAvailableDays / maxCapacity) * 100) : 100;
    const capacityColor = capacityPct >= 90 ? 'text-green-700 bg-green-50' : capacityPct >= 75 ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50';
    const dateRange = `${sStart.toLocaleDateString('en-US', {month:'short',day:'numeric'})} - ${sEnd.toLocaleDateString('en-US', {month:'short',day:'numeric'})}`;
    const impactText = impactNotes.length ? impactNotes.join(', ') : '<span class="text-slate-400">None</span>';

    impactHtml += `<tr class="border-b border-slate-100">
      <td class="py-2 pr-3 font-semibold text-slate-700">${sprint.name}</td>
      <td class="py-2 pr-3 text-slate-500">${dateRange}</td>
      <td class="py-2 pr-3">${totalWorkingDays} days</td>
      <td class="py-2 pr-3">${impactText}</td>
      <td class="py-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${capacityColor}">${capacityPct}%</span></td>
    </tr>`;
  });

  impactHtml += '</tbody></table>';
  impactEl.innerHTML = impactHtml;
})();
