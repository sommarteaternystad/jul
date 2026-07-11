document.addEventListener('DOMContentLoaded', function () {
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
});

document.addEventListener('DOMContentLoaded', function () {
  var days = document.querySelectorAll('.cal-day--active');
  var panel = document.getElementById('cal-panel');
  if (!days.length || !panel) return;

  var weekdayEl = document.getElementById('cal-panel-weekday');
  var dateEl = document.getElementById('cal-panel-date');
  var headingEl = document.getElementById('cal-panel-heading');
  var hoursEl = document.getElementById('cal-panel-hours-value');
  var textEl = document.getElementById('cal-panel-text');
  var badgeEl = document.getElementById('cal-panel-badge');

  function select(day) {
    days.forEach(function (d) { d.classList.remove('is-selected'); });
    day.classList.add('is-selected');

    var label = day.dataset.label || '';
    var parts = label.split(' ');
    weekdayEl.textContent = parts[0] || '';
    dateEl.textContent = parts.slice(1).join(' ');

    if (day.dataset.heading) {
      headingEl.textContent = day.dataset.heading;
      headingEl.hidden = false;
      panel.classList.add('cal-panel--last');
    } else {
      headingEl.hidden = true;
      panel.classList.remove('cal-panel--last');
    }

    hoursEl.textContent = day.dataset.hours || '';
    textEl.textContent = day.dataset.text || '';

    if (day.dataset.badge) {
      badgeEl.textContent = day.dataset.badge;
      badgeEl.hidden = false;
    } else {
      badgeEl.hidden = true;
    }
  }

  days.forEach(function (day) {
    day.addEventListener('click', function () { select(day); });
  });

  var initial = document.querySelector('.cal-day--active[data-date="2026-11-21"]') || days[0];
  select(initial);
});
