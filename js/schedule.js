/* ══════════════════════════════════════════════
   JUL HOS SOMMARTETERN — dagsdata
   Enda källan för öppettider, kalender och händelser.
══════════════════════════════════════════════ */

var JUL_TICKET_URL = 'https://tickets.nortic.se/ticket/organizer/1010';

var JUL_SCHEDULE = {
  start: '2026-11-21',
  end: '2026-12-24',

  // Vanliga öppettider per veckodag (0 = måndag)
  weekdayHours: ['16.00–19.00', '16.00–19.00', '16.00–19.00', '16.00–19.00', '11.00–19.00', '11.00–17.00', '11.00–17.00'],

  // Avvikelser från veckodag
  overrides: {
    '2026-12-22': { hours: '11.00–19.00', special: true },
    '2026-12-23': { hours: '10.00–12.00', special: true },
    '2026-12-24': {
      hours: null,
      last: true,
      heading: 'Julgransförsäljning – sista chansen',
      text: 'Området är stängt, men du kan köpa de granar som finns kvar obemannat.'
    }
  },

  // Händelser (affischen 2026)
  events: {
    '2026-12-05': [
      { time: '11.00–17.00', title: 'Julmarknad med utställare', free: true, href: 'julmarknad.html' },
      { time: '16.00', title: 'Julkonsert NIMT', ticket: true, url: 'https://tickets.nortic.se/ticket/show/363142', href: 'konserter.html' }
    ],
    '2026-12-06': [
      { time: '11.00–15.00', title: 'Adventsmys & barnteater', detail: 'Träffa tomten · Måla julbilder · Barnteater 13.00 · Julklappsdamm', ticket: true, url: 'https://tickets.nortic.se/ticket/show/363146', href: 'konserter.html' }
    ],
    '2026-12-12': [
      { time: '11.00–17.00', title: 'Julmarknad med utställare', free: true, href: 'julmarknad.html' },
      { time: '12.00', title: 'Barnjulkonsert', ticket: true, url: 'https://tickets.nortic.se/ticket/show/363150', href: 'konserter.html' },
      { time: '15.00', title: 'Julteater: Har du också julspel', detail: 'Kultur för alla Syd', ticket: true, url: 'https://tickets.nortic.se/ticket/show/363151', href: 'konserter.html' }
    ]
  }
};

var JUL_WEEKDAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
var JUL_MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

// Datum som "ÅÅÅÅ-MM-DD" i svensk tid
function julTodayYMD() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

// Mån = 0 … Sön = 6
function julWeekdayIndex(ymd) {
  var d = new Date(ymd + 'T12:00:00Z').getUTCDay();
  return (d + 6) % 7;
}

function julDayInfo(ymd) {
  var s = JUL_SCHEDULE;
  var wd = julWeekdayIndex(ymd);
  var parts = ymd.split('-');
  var day = parseInt(parts[2], 10);
  var month = parseInt(parts[1], 10);
  var o = s.overrides[ymd] || {};
  var inSale = ymd >= s.start && ymd <= s.end;

  return {
    ymd: ymd,
    day: day,
    month: month,
    weekdayIdx: wd,
    weekday: JUL_WEEKDAYS[wd],
    label: JUL_WEEKDAYS[wd] + ' ' + day + ' ' + JUL_MONTHS[month - 1],
    inSale: inSale,
    hours: 'hours' in o ? o.hours : s.weekdayHours[wd],
    special: !!o.special,
    last: !!o.last,
    weekend: wd >= 5,
    heading: o.heading || '',
    text: o.text || 'Vårt område är öppet – kom och titta, känn och kläm på din julgran!',
    events: s.events[ymd] || []
  };
}

// Status för headern och startsidan, baserat på dagens datum
function julStatus() {
  var s = JUL_SCHEDULE;
  var today = julTodayYMD();

  if (today < s.start) return { state: 'before', today: today };
  if (today > s.end) return { state: 'after', today: today };
  return { state: 'open', today: today, day: julDayInfo(today) };
}
