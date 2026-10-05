document.addEventListener('DOMContentLoaded', function () {
  renderHeaderStatus();
  renderTodayBox();
  setupNav();
  setupCalendar();
});

/* ── Navigation (mobilmeny) ─────────────────── */

function setupNav() {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
    });
  });
}

/* ── Status i headern ───────────────────────── */

function renderHeaderStatus() {
  var el = document.getElementById('header-status');
  if (!el || typeof julStatus !== 'function') return;

  var st = julStatus();
  if (st.state === 'before') {
    el.textContent = 'Öppnar 21 november';
  } else if (st.state === 'after') {
    el.textContent = 'Säsongen är slut';
  } else if (!st.day.hours) {
    el.textContent = 'Obemannat idag';
  } else {
    el.textContent = 'Öppet idag ' + st.day.hours;
  }
  el.hidden = false;
}

/* ── Idag-brickan på startsidan ─────────────── */

function renderTodayBox() {
  var box = document.getElementById('today-box');
  if (!box || typeof julStatus !== 'function') return;

  var st = julStatus();
  var label = document.getElementById('today-label');
  var hours = document.getElementById('today-hours');
  var text = document.getElementById('today-text');
  var events = document.getElementById('today-events');

  events.innerHTML = '';

  if (st.state === 'before') {
    label.textContent = 'Julgransförsäljningen öppnar';
    hours.textContent = '21 november';
    text.textContent = 'Välkommen tillbaka – vi ser fram emot att möta dig i Öja.';
    return;
  }

  if (st.state === 'after') {
    label.textContent = 'Julgransförsäljningen';
    hours.textContent = 'Säsongen är slut';
    text.textContent = 'Tack för i år! Vi ses nästa jul.';
    return;
  }

  var day = st.day;
  label.textContent = 'Idag · ' + day.label;
  hours.textContent = day.hours ? 'Öppet ' + day.hours : (day.heading || 'Obemannat');
  text.textContent = day.text;

  day.events.forEach(function (ev) {
    var li = document.createElement('li');
    li.innerHTML = '<strong></strong><span></span>';
    li.querySelector('strong').textContent = ev.time;
    li.querySelector('span').textContent = ev.title;
    events.appendChild(li);
  });
}

/* ── Kalender ──────────────────────────────── */

function setupCalendar() {
  var grid11 = document.getElementById('cal-grid-11');
  var grid12 = document.getElementById('cal-grid-12');
  var overlay = document.getElementById('cal-modal-overlay');
  if (!grid11 || !grid12 || !overlay || typeof julDayInfo !== 'function') return;

  renderMonth(grid11, 2026, 11);
  renderMonth(grid12, 2026, 12);

  var panel = document.getElementById('cal-panel');
  var closeBtn = document.getElementById('cal-modal-close');
  var weekdayEl = document.getElementById('cal-panel-weekday');
  var dateEl = document.getElementById('cal-panel-date');
  var headingEl = document.getElementById('cal-panel-heading');
  var hoursEl = document.getElementById('cal-panel-hours-value');
  var textEl = document.getElementById('cal-panel-text');
  var badgeEl = document.getElementById('cal-panel-badge');
  var eventsEl = document.getElementById('cal-panel-events');

  function openModal(info, btn) {
    document.querySelectorAll('.cal-day--active').forEach(function (d) { d.classList.remove('is-selected'); });
    btn.classList.add('is-selected');

    var parts = info.label.split(' ');
    weekdayEl.textContent = parts[0];
    dateEl.textContent = parts.slice(1).join(' ');

    if (info.heading) {
      headingEl.textContent = info.heading;
      headingEl.hidden = false;
      panel.classList.add('cal-panel--last');
    } else {
      headingEl.hidden = true;
      panel.classList.remove('cal-panel--last');
    }

    hoursEl.textContent = info.hours || 'Obemannat';
    textEl.textContent = info.text;

    if (info.weekend) {
      badgeEl.textContent = 'Korvgrillning 11.00–14.00';
      badgeEl.hidden = false;
    } else {
      badgeEl.hidden = true;
    }

    eventsEl.innerHTML = '';
    info.events.forEach(function (ev) {
      var item = document.createElement('div');
      item.className = 'cal-event-item';
      item.innerHTML = '<span class="cal-event-time"></span><span class="cal-event-title"></span>' +
        '<span class="cal-event-detail"></span><div class="cal-event-actions"></div>';
      item.querySelector('.cal-event-time').textContent = ev.time;
      item.querySelector('.cal-event-title').textContent = ev.title;
      var detail = item.querySelector('.cal-event-detail');
      if (ev.detail) detail.textContent = ev.detail; else detail.remove();

      var actions = item.querySelector('.cal-event-actions');
      if (ev.free) {
        var tag = document.createElement('span');
        tag.className = 'cal-event-tag';
        tag.textContent = 'Gratis inträde';
        actions.appendChild(tag);
      }
      if (ev.ticket) {
        var buy = document.createElement('a');
        buy.className = 'btn btn-gold cal-event-btn';
        buy.href = JUL_TICKET_URL;
        buy.target = '_blank';
        buy.rel = 'noopener';
        buy.textContent = 'Köp biljett';
        actions.appendChild(buy);
      }
      var info2 = document.createElement('a');
      info2.className = 'cal-event-link';
      info2.href = ev.href;
      info2.textContent = 'Läs mer →';
      actions.appendChild(info2);

      eventsEl.appendChild(item);
    });

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  grid11.addEventListener('click', onDayClick);
  grid12.addEventListener('click', onDayClick);

  function onDayClick(e) {
    var btn = e.target.closest('.cal-day--active');
    if (!btn) return;
    openModal(julDayInfo(btn.dataset.date), btn);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
}

function renderMonth(container, year, month) {
  var s = JUL_SCHEDULE;
  var first = new Date(Date.UTC(year, month - 1, 1));
  var offset = (first.getUTCDay() + 6) % 7;
  var total = new Date(Date.UTC(year, month, 0)).getUTCDate();
  var html = '';

  for (var p = 0; p < offset; p++) {
    html += '<span class="cal-day cal-day--pad"></span>';
  }

  for (var d = 1; d <= total; d++) {
    var ymd = year + '-' + String(month).padStart(2, '0') + '-' + String(d).padStart(2, '0');

    if (ymd < s.start || ymd > s.end) {
      html += '<span class="cal-day cal-day--inactive"><span class="cal-day-num">' + d + '</span></span>';
      continue;
    }

    var info = julDayInfo(ymd);
    var classes = 'cal-day cal-day--active';
    var dot = '';

    if (info.weekend) { classes += ' cal-day--weekend'; dot = 'cal-day-dot--weekend'; }
    if (info.special) { classes += ' cal-day--special'; dot = 'cal-day-dot--special'; }
    if (info.last) { classes += ' cal-day--last'; dot = 'cal-day-dot--last'; }
    if (info.events.length) { classes += ' cal-day--event'; }

    html += '<button type="button" class="' + classes + '" data-date="' + ymd + '">' +
      '<span class="cal-day-num">' + d + '</span>' +
      (dot ? '<span class="cal-day-dot ' + dot + '"></span>' : '') +
      (info.events.length ? '<span class="cal-day-event-dot"></span>' : '') +
      '</button>';
  }

  container.innerHTML = html;
}
