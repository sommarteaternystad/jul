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
  var overlay = document.getElementById('cal-modal-overlay');
  var panel = document.getElementById('cal-panel');
  var closeBtn = document.getElementById('cal-modal-close');
  if (!days.length || !overlay || !panel) return;

  var weekdayEl = document.getElementById('cal-panel-weekday');
  var dateEl = document.getElementById('cal-panel-date');
  var headingEl = document.getElementById('cal-panel-heading');
  var hoursEl = document.getElementById('cal-panel-hours-value');
  var textEl = document.getElementById('cal-panel-text');
  var badgeEl = document.getElementById('cal-panel-badge');

  function openModal(day) {
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

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  days.forEach(function (day) {
    day.addEventListener('click', function () { openModal(day); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
});
