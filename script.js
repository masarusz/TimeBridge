/* ============================================================
   TimeBridge — script.js
   ============================================================ */

// ── Timezone definitions (ordered by UTC offset desc = closest to JST first) ──
const TZ_PRESETS = [
  { key: 'japan',      label: 'Japan',      iana: 'Asia/Tokyo'          },
  { key: 'india',      label: 'India',      iana: 'Asia/Kolkata'        },
  { key: 'uk',         label: 'UK',         iana: 'Europe/London'       },
  { key: 'us-eastern', label: 'US Eastern', iana: 'America/New_York'    },
  { key: 'us-central', label: 'US Central', iana: 'America/Chicago'     },
  { key: 'us-pacific', label: 'US Pacific', iana: 'America/Los_Angeles' },
];

// Additional zones for "More" dropdown
const TZ_EXTRA = [
  { key: 'australia-sydney',  label: 'Australia (Sydney)',  iana: 'Australia/Sydney'    },
  { key: 'australia-perth',   label: 'Australia (Perth)',   iana: 'Australia/Perth'     },
  { key: 'china',             label: 'China',               iana: 'Asia/Shanghai'       },
  { key: 'korea',             label: 'Korea',               iana: 'Asia/Seoul'          },
  { key: 'singapore',         label: 'Singapore',           iana: 'Asia/Singapore'      },
  { key: 'dubai',             label: 'Dubai / UAE',         iana: 'Asia/Dubai'          },
  { key: 'istanbul',          label: 'Turkey',              iana: 'Europe/Istanbul'     },
  { key: 'moscow',            label: 'Russia (Moscow)',     iana: 'Europe/Moscow'       },
  { key: 'paris',             label: 'France / Germany',    iana: 'Europe/Paris'        },
  { key: 'brazil',            label: 'Brazil (São Paulo)',  iana: 'America/Sao_Paulo'   },
  { key: 'us-mountain',       label: 'US Mountain',         iana: 'America/Denver'      },
  { key: 'canada-atlantic',   label: 'Canada (Atlantic)',   iana: 'America/Halifax'     },
  { key: 'mexico-city',       label: 'Mexico City',         iana: 'America/Mexico_City' },
  { key: 'argentina',         label: 'Argentina',           iana: 'America/Argentina/Buenos_Aires' },
  { key: 'hawaii',            label: 'Hawaii',              iana: 'Pacific/Honolulu'    },
  { key: 'new-zealand',       label: 'New Zealand',         iana: 'Pacific/Auckland'    },
  { key: 'south-africa',      label: 'South Africa',        iana: 'Africa/Johannesburg' },
  { key: 'nigeria',           label: 'Nigeria',             iana: 'Africa/Lagos'        },
  { key: 'kenya',             label: 'Kenya',               iana: 'Africa/Nairobi'      },
  { key: 'indonesia',         label: 'Indonesia (Jakarta)', iana: 'Asia/Jakarta'        },
  { key: 'thailand',          label: 'Thailand',            iana: 'Asia/Bangkok'        },
  { key: 'vietnam',           label: 'Vietnam',             iana: 'Asia/Ho_Chi_Minh'    },
  { key: 'pakistan',          label: 'Pakistan',            iana: 'Asia/Karachi'        },
  { key: 'bangladesh',        label: 'Bangladesh',          iana: 'Asia/Dhaka'          },
  { key: 'sri-lanka',         label: 'Sri Lanka',           iana: 'Asia/Colombo'        },
  { key: 'nepal',             label: 'Nepal',               iana: 'Asia/Kathmandu'      },
  { key: 'iran',              label: 'Iran',                iana: 'Asia/Tehran'         },
  { key: 'israel',            label: 'Israel',              iana: 'Asia/Jerusalem'      },
  { key: 'portugal',          label: 'Portugal',            iana: 'Europe/Lisbon'       },
  { key: 'spain',             label: 'Spain',               iana: 'Europe/Madrid'       },
  { key: 'sweden',            label: 'Sweden / Denmark',    iana: 'Europe/Stockholm'    },
  { key: 'finland',           label: 'Finland',             iana: 'Europe/Helsinki'     },
  { key: 'romania',           label: 'Romania / Greece',    iana: 'Europe/Bucharest'    },
  { key: 'ukraine',           label: 'Ukraine',             iana: 'Europe/Kyiv'         },
  { key: 'egypt',             label: 'Egypt',               iana: 'Africa/Cairo'        },
  { key: 'philippines',       label: 'Philippines',         iana: 'Asia/Manila'         },
  { key: 'hong-kong',         label: 'Hong Kong',           iana: 'Asia/Hong_Kong'      },
  { key: 'taiwan',            label: 'Taiwan',              iana: 'Asia/Taipei'         },
];

// English translations for Japanese public holiday names
const HOLIDAY_NAMES_EN = {
  '元日':         "New Year's Day",
  '成人の日':     'Coming of Age Day',
  '建国記念の日': 'National Foundation Day',
  '天皇誕生日':   "Emperor's Birthday",
  '春分の日':     'Vernal Equinox Day',
  '昭和の日':     'Showa Day',
  '憲法記念日':   'Constitution Memorial Day',
  'みどりの日':   'Greenery Day',
  'こどもの日':   "Children's Day",
  '海の日':       'Marine Day',
  '山の日':       'Mountain Day',
  '敬老の日':     'Respect for the Aged Day',
  '秋分の日':     'Autumnal Equinox Day',
  'スポーツの日': 'Sports Day',
  '体育の日':     'Sports Day',
  '文化の日':     'Culture Day',
  '勤労感謝の日': 'Labour Thanksgiving Day',
  '振替休日':     'Public Holiday',
};

// Slot definitions
const SLOT_AM      = 'am';
const SLOT_PM      = 'pm';
const SLOT_ALLDAY  = 'allday';
const SLOT_CUSTOM  = 'custom';

// Dynamic — reads from state.slotTimes
function getSlotTimes(type) {
  if (type === SLOT_AM)     return state.slotTimes.am;
  if (type === SLOT_PM)     return state.slotTimes.pm;
  if (type === SLOT_ALLDAY) return state.slotTimes.allday;
  return null;
}

// ── App State ──────────────────────────────────────────────────────────────────
let state = {
  lang: 'ja',
  year: new Date().getFullYear(),
  month: new Date().getMonth(), // 0-indexed
  // selectedDates: Map<'YYYY-MM-DD', { am, pm, allday, customs: [{id, start, end}] }>
  selectedDates: new Map(),
  // activeTzKeys: string[] (ordered by proximity to JST)
  activeTzKeys: ['japan'],
  // Per-language header text (independently editable)
  headerTexts: {
    ja: I18N.ja.headerPlaceholder,
    en: I18N.en.headerPlaceholder,
  },
  // Japanese holidays: { 'YYYY-MM-DD': '祝日名' }
  holidays: {},
  // Years for which a fetch has been attempted (avoid duplicate requests)
  holidayYearsFetched: new Set(),
  // Customisable default time ranges for preset slots
  slotTimes: {
    am:     { start: '10:00', end: '12:00' },
    pm:     { start: '13:00', end: '18:00' },
    allday: { start: '10:00', end: '18:00' },
  },
};

let customIdCounter = 0;

// ── Helpers ────────────────────────────────────────────────────────────────────
const t = (key) => I18N[state.lang][key];

function getTzByKey(key) {
  return TZ_PRESETS.find(z => z.key === key)
      || TZ_EXTRA.find(z => z.key === key);
}

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function getDowIndex(y, m, d) {
  // Returns 0=Mon … 6=Sun
  const dow = new Date(y, m, d).getDay(); // 0=Sun
  return dow === 0 ? 6 : dow - 1;
}

function getDowLabel(y, m, d) {
  return I18N[state.lang].days[getDowIndex(y, m, d)];
}

function isToday(y, m, d) {
  const now = new Date();
  return y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
}

function isPast(y, m, d) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(y, m, d) < today;
}

function formatDateLabel(key) {
  const { year: y, month: m, day: d } = parseKey(key);
  const dow = getDowLabel(y, m, d);
  if (state.lang === 'ja') {
    return `${m + 1}月${d}日（${dow}）`;
  } else {
    const months = I18N.en.months;
    return `${months[m]} ${d}${ordinal(d)} (${dow})`;
  }
}

function formatDateShort(date) {
  // date is a Date object; format for cross-tz display
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  if (state.lang === 'ja') {
    return `${m + 1}月${d}日`;
  } else {
    return `${MONTHS_EN_SHORT[m]} ${d}`;
  }
}

function timeStrToMinutes(str) {
  const [h, mm] = str.split(':').map(Number);
  return h * 60 + mm;
}

function minutesToTimeStr(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function getTimeOptions() {
  const opts = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    opts.push(minutesToTimeStr(m));
  }
  return opts;
}

// ── Timezone conversion ────────────────────────────────────────────────────────
// Convert a time slot (start/end strings like '10:00') on a given date key
// from Japan timezone to a target IANA timezone.
// Returns { startStr, endStr, startDate, endDate } where dates are Date objects.
function convertSlot(dateKey, startStr, endStr, targetIana) {
  const { year: y, month: m, day: d } = parseKey(dateKey);

  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);

  // Build UTC times from JST (Asia/Tokyo)
  // We create the date in JST by using the Intl API trick
  const startUtc = toUtcFromIana(y, m, d, sh, sm, 'Asia/Tokyo');
  const endUtc   = toUtcFromIana(y, m, d, eh, em, 'Asia/Tokyo');

  const startLocal = utcToIana(startUtc, targetIana);
  const endLocal   = utcToIana(endUtc,   targetIana);

  return { startLocal, endLocal };
}

// Convert local date+time in a given IANA zone to a UTC timestamp (ms)
function toUtcFromIana(y, mo, d, h, mi, iana) {
  // Use Intl to find the offset at that moment
  // We approximate by formatting a known UTC time and comparing
  // Strategy: binary search is complex — instead use the offset from a reference point
  const approxUtc = Date.UTC(y, mo, d, h, mi, 0);
  const offset = getIanaOffsetMinutes(new Date(approxUtc), iana);
  return approxUtc - offset * 60000;
}

function utcToIana(utcMs, iana) {
  return new Date(utcMs);
}

// Get the UTC offset in minutes for a given timezone at a given UTC time
function getIanaOffsetMinutes(utcDate, iana) {
  // Format the date in the target timezone, then compare to UTC
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: iana,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = fmt.formatToParts(utcDate);
  const p = {};
  parts.forEach(({ type, value }) => { p[type] = value; });
  const localMs = Date.UTC(
    Number(p.year), Number(p.month) - 1, Number(p.day),
    p.hour === '24' ? 0 : Number(p.hour), Number(p.minute)
  );
  return Math.round((localMs - utcDate.getTime()) / 60000);
}

// Format a converted slot for output
function formatConvertedSlot(sourceDateKey, startStr, endStr, tzInfo) {
  const { startLocal, endLocal } = convertSlot(sourceDateKey, startStr, endStr, tzInfo.iana);

  const { year: srcY, month: srcM, day: srcD } = parseKey(sourceDateKey);

  // Get local date components in target tz
  const fmtDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: tzInfo.iana,
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const fmtTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: tzInfo.iana,
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const startDateStr = fmtDate.format(startLocal);
  const endDateStr   = fmtDate.format(endLocal);
  const startTimeStr = fmtTime.format(startLocal).replace(/^0/, '');
  const endTimeStr   = fmtTime.format(endLocal).replace(/^0/, '');

  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);

  // Japan source date
  const srcDate = new Date(srcY, srcM, srcD);
  const startDate = new Date(sY, sM - 1, sD);
  const endDate   = new Date(eY, eM - 1, eD);

  const startDiffDays = Math.round((startDate - srcDate) / 86400000);
  const endDiffDays   = Math.round((endDate - srcDate) / 86400000);

  let result = '';

  // Prefix date if start is on a different day than Japan source
  if (startDiffDays !== 0) {
    result += formatDateShortFromParts(sM - 1, sD) + ' ';
  }
  result += startTimeStr + '~';

  // End time (no (+1) notation — date prefix on start already makes it clear)
  result += endTimeStr;

  result += ' ' + tzInfo.label;
  return result;
}

function formatDateShortFromParts(monthIdx, day) {
  if (state.lang === 'ja') {
    return `${monthIdx + 1}月${day}日`;
  } else {
    return `${MONTHS_EN_SHORT[monthIdx]} ${day}`;
  }
}

// ── Sorted active timezones (closest to JST first) ────────────────────────────
function getSortedActiveTzs() {
  return state.activeTzKeys
    .map(key => {
      const tz = getTzByKey(key);
      // Get current real offset using Intl
      const offsetMins = getIanaOffsetMinutes(new Date(), tz.iana);
      return { ...tz, currentOffset: offsetMins };
    })
    .sort((a, b) => b.currentOffset - a.currentOffset);
}

// ── Output generation ──────────────────────────────────────────────────────────
function generateOutput() {
  const header = (state.headerTexts[state.lang] || '').trim()
    || t('headerPlaceholder');

  if (state.selectedDates.size === 0) return '';

  const multiTz = state.activeTzKeys.length > 1;
  const sortedTzs = getSortedActiveTzs();
  const otherTzs = sortedTzs.filter(z => z.key !== 'japan');
  const japanLabel = state.lang === 'ja' ? '日本' : 'Japan';

  const lines = [header];

  // Sort dates chronologically
  const sortedKeys = [...state.selectedDates.keys()].sort();

  for (const key of sortedKeys) {
    const slots = state.selectedDates.get(key);
    const dateLabel = formatDateLabel(key);

    // Collect active slot entries
    const entries = [];
    if (slots.allday) {
      entries.push({ type: SLOT_ALLDAY, ...getSlotTimes(SLOT_ALLDAY) });
    } else {
      if (slots.am) entries.push({ type: SLOT_AM, ...getSlotTimes(SLOT_AM) });
      if (slots.pm) entries.push({ type: SLOT_PM, ...getSlotTimes(SLOT_PM) });
    }
    for (const c of slots.customs) {
      entries.push({ type: SLOT_CUSTOM, start: c.start, end: c.end });
    }

    if (entries.length === 0) continue;

    // Build one content string per slot
    const slotContents = entries.map(entry => {
      const slotLabel = buildSlotLabel(entry);
      if (!multiTz) return slotLabel;
      let content = `${slotLabel} ${japanLabel}`;
      for (const tz of otherTzs) {
        content += ' / ' + formatConvertedSlot(key, entry.start, entry.end, tz);
      }
      return content;
    });

    // First slot: ・ (JA) or "- " (EN); continuation: same-width prefix
    const bullet = state.lang === 'ja' ? '・' : '- ';
    const cont   = state.lang === 'ja' ? '　' : '  ';
    lines.push(`${bullet}${dateLabel} ${slotContents[0]}`);
    for (let i = 1; i < slotContents.length; i++) {
      lines.push(`${cont}${dateLabel} ${slotContents[i]}`);
    }
  }

  return lines.join('\n');
}

function buildSlotLabel(entry) {
  // All slot types: output just the time range
  return `${entry.start}~${entry.end}`;
}

// ── Render ─────────────────────────────────────────────────────────────────────
function render() {
  renderCalendar();
  renderSlots();
  renderSlotSettings();
  renderTimezones();
  renderOutput();
  renderI18n();
}

// ── Slot Settings ──────────────────────────────────────────────────────────────
function renderSlotSettings() {
  document.getElementById('slotSettingsTitle').textContent = t('slotSettingsTitle');

  const defs = [
    { id: 'settingsAM',     key: 'am',     label: () => t('slotAM') },
    { id: 'settingsPM',     key: 'pm',     label: () => t('slotPM') },
    { id: 'settingsAllDay', key: 'allday', label: () => t('slotAllDay') },
  ];

  for (const def of defs) {
    const container = document.getElementById(def.id);
    container.innerHTML = '';

    const lbl = document.createElement('span');
    lbl.className = 'slot-settings__label';
    lbl.textContent = def.label();
    container.appendChild(lbl);

    const fromSel = makeSettingsSelect(state.slotTimes[def.key].start, (val) => {
      state.slotTimes[def.key].start = val;
      if (timeStrToMinutes(val) >= timeStrToMinutes(state.slotTimes[def.key].end)) {
        state.slotTimes[def.key].end = minutesToTimeStr(timeStrToMinutes(val) + 30);
        toSel.value = state.slotTimes[def.key].end;
      }
      filterToOptions(toSel, val);
      renderSlots();
      renderOutput();
    });
    container.appendChild(fromSel);

    const sep = document.createElement('span');
    sep.className = 'slot-settings__sep';
    sep.textContent = '~';
    container.appendChild(sep);

    const toSel = makeSettingsSelect(state.slotTimes[def.key].end, (val) => {
      state.slotTimes[def.key].end = val;
      renderSlots();
      renderOutput();
    });
    filterToOptions(toSel, state.slotTimes[def.key].start);
    container.appendChild(toSel);

    // Keep reference so fromSel onChange can update toSel
    fromSel.addEventListener('change', () => filterToOptions(toSel, fromSel.value));
  }
}

function makeSettingsSelect(selectedVal, onChange) {
  const sel = document.createElement('select');
  sel.className = 'slot-settings__select';
  getTimeOptions().forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if (opt === selectedVal) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener('change', () => onChange(sel.value));
  return sel;
}

// ── i18n ───────────────────────────────────────────────────────────────────────
function renderI18n() {
  document.getElementById('appName').textContent =
    state.lang === 'ja' ? 'タイムブリッジ' : 'TimeBridge';
  document.documentElement.lang = state.lang === 'ja' ? 'ja' : 'en';
  document.getElementById('langToggle').textContent = t('langToggle');
  document.getElementById('todayBtn').textContent = t('todayBtn');
  document.getElementById('tzTitle').textContent = t('timezonesTitle');
  document.getElementById('copyBtn').textContent = t('copyBtn');
  document.getElementById('resetBtn').textContent = t('resetBtn');
  const headerInput = document.getElementById('headerMessage');
  headerInput.value = state.headerTexts[state.lang];
  headerInput.placeholder = t('headerPlaceholder');
  document.getElementById('headerLabel').textContent = t('headerLabel');
  document.getElementById('headerHint').textContent  = t('headerHint');

  const moreSelect = document.getElementById('tzMoreSelect');
  moreSelect.options[0].text = t('addMore');
}

// ── Calendar ───────────────────────────────────────────────────────────────────
function renderCalendar() {
  const { year: y, month: m } = state;
  const lang = state.lang;

  // Disable "Today" button when already on the current month
  const now = new Date();
  const isCurrentMonth = y === now.getFullYear() && m === now.getMonth();
  document.getElementById('todayBtn').disabled = isCurrentMonth;

  // Title
  const titleEl = document.getElementById('calendarTitle');
  if (lang === 'ja') {
    titleEl.textContent = `${y}年 ${m + 1}月`;
  } else {
    titleEl.textContent = `${I18N.en.months[m]} ${y}`;
  }

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  // Day headers
  const days = I18N[lang].days;
  days.forEach((day, i) => {
    const el = document.createElement('div');
    el.className = 'calendar__day-header' +
      (i === 5 ? ' calendar__day-header--sat' : '') +
      (i === 6 ? ' calendar__day-header--sun' : '');
    el.textContent = day;
    grid.appendChild(el);
  });

  // First day offset (Mon=0)
  const firstDow = getDowIndex(y, m, 1);
  for (let i = 0; i < firstDow; i++) {
    const el = document.createElement('div');
    el.className = 'calendar__cell calendar__cell--empty';
    grid.appendChild(el);
  }

  // Days
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(y, m, d);
    const dow = getDowIndex(y, m, d);
    const past = isPast(y, m, d);
    const today = isToday(y, m, d);
    const selected = state.selectedDates.has(key);

    const holidayNameJa = state.holidays[key];
    const holidayName = holidayNameJa
      ? (state.lang === 'ja' ? holidayNameJa : (HOLIDAY_NAMES_EN[holidayNameJa] || holidayNameJa))
      : undefined;

    const el = document.createElement('div');
    let cls = 'calendar__cell';
    if (past)        cls += ' calendar__cell--past';
    if (today)       cls += ' calendar__cell--today';
    if (selected)    cls += ' calendar__cell--selected';
    if (dow === 5)   cls += ' calendar__cell--sat';
    if (dow === 6)   cls += ' calendar__cell--sun';
    if (holidayName) cls += ' calendar__cell--holiday';

    el.className = cls;
    el.textContent = d;
    el.dataset.key = key;
    if (holidayName) el.dataset.holiday = holidayName;

    if (!past) {
      el.addEventListener('click', () => toggleDate(key));
    }
    grid.appendChild(el);
  }
}

// ── Slots ──────────────────────────────────────────────────────────────────────
function renderSlots() {
  const list = document.getElementById('slotsList');
  const empty = document.getElementById('slotsEmpty');
  list.innerHTML = '';

  const sortedKeys = [...state.selectedDates.keys()].sort();

  if (sortedKeys.length === 0) {
    empty.textContent = t('noSlots');
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  for (const key of sortedKeys) {
    const slots = state.selectedDates.get(key);
    const row = document.createElement('div');
    row.className = 'slot-row';

    // Header
    const header = document.createElement('div');
    header.className = 'slot-row__header';

    const dateLabel = document.createElement('span');
    dateLabel.className = 'slot-row__date';
    dateLabel.textContent = formatDateLabel(key);
    header.appendChild(dateLabel);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'slot-row__remove';
    removeBtn.textContent = '×';
    removeBtn.title = state.lang === 'ja' ? 'この日を削除' : 'Remove date';
    removeBtn.addEventListener('click', () => removeDate(key));
    header.appendChild(removeBtn);
    row.appendChild(header);

    // Slot buttons
    const btnRow = document.createElement('div');
    btnRow.className = 'slot-row__btns';

    // Presets (AM / PM / AllDay) are mutually exclusive with Custom slots
    const blockedByCustom = slots.customs.length > 0;

    // AM
    const amTimes = state.slotTimes.am;
    const amBtn = makeSlotBtn(
      `${t('slotAM')}  ${amTimes.start}~${amTimes.end}`,
      slots.am, slots.allday || blockedByCustom, () => toggleSlot(key, SLOT_AM)
    );
    btnRow.appendChild(amBtn);

    // PM
    const pmTimes = state.slotTimes.pm;
    const pmBtn = makeSlotBtn(
      `${t('slotPM')}  ${pmTimes.start}~${pmTimes.end}`,
      slots.pm, slots.allday || blockedByCustom, () => toggleSlot(key, SLOT_PM)
    );
    btnRow.appendChild(pmBtn);

    // AllDay
    const allTimes = state.slotTimes.allday;
    const allBtn = makeSlotBtn(
      `${t('slotAllDay')}  ${allTimes.start}~${allTimes.end}`,
      slots.allday, blockedByCustom, () => toggleSlot(key, SLOT_ALLDAY)
    );
    btnRow.appendChild(allBtn);

    // + Custom button: visible only when no custom slots exist yet
    if (slots.customs.length === 0) {
      const customAddBtn = document.createElement('button');
      customAddBtn.className = 'slot-btn';
      customAddBtn.textContent = t('slotCustom');
      customAddBtn.addEventListener('click', () => addCustomSlot(key));
      btnRow.appendChild(customAddBtn);
    }

    row.appendChild(btnRow);

    // Custom slot rows
    for (const c of slots.customs) {
      row.appendChild(makeCustomSlotRow(key, c));
    }

    // "+ Add another time range" appears below last custom row
    if (slots.customs.length > 0) {
      const moreBtn = document.createElement('button');
      moreBtn.className = 'slot-custom-more';
      moreBtn.textContent = t('slotCustomMore');
      moreBtn.addEventListener('click', () => addCustomSlot(key));
      row.appendChild(moreBtn);
    }

    list.appendChild(row);
  }
}

function makeSlotBtn(label, active, disabled, onClick) {
  const btn = document.createElement('button');
  btn.className = 'slot-btn' +
    (active ? ' slot-btn--active' : '') +
    (disabled ? ' slot-btn--disabled' : '');
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener('click', onClick);
  return btn;
}

function makeCustomSlotRow(dateKey, c) {
  const row = document.createElement('div');
  row.className = 'custom-slot';

  const fromLabel = document.createElement('span');
  fromLabel.className = 'custom-slot__label';
  fromLabel.textContent = t('fromLabel');
  row.appendChild(fromLabel);

  const fromSel = makeTimeSelect(c.start, (val) => {
    c.start = val;
    // If start >= end, push end forward by 30min
    if (timeStrToMinutes(c.start) >= timeStrToMinutes(c.end)) {
      c.end = minutesToTimeStr(Math.min(timeStrToMinutes(c.start) + 30, 23 * 60 + 30));
    }
    renderOutput();
  });
  row.appendChild(fromSel);

  const toLabel = document.createElement('span');
  toLabel.className = 'custom-slot__label';
  toLabel.textContent = t('toLabel');
  row.appendChild(toLabel);

  const toSel = makeTimeSelect(c.end, (val) => {
    c.end = val;
    renderOutput();
  });
  // Filter to-options to be after start
  filterToOptions(toSel, c.start);
  row.appendChild(toSel);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'custom-slot__remove';
  removeBtn.textContent = '×';
  removeBtn.addEventListener('click', () => {
    const slots = state.selectedDates.get(dateKey);
    slots.customs = slots.customs.filter(x => x.id !== c.id);
    renderSlots();
    renderOutput();
  });
  row.appendChild(removeBtn);

  // Update to-options when from changes
  fromSel.addEventListener('change', () => {
    filterToOptions(toSel, fromSel.value);
  });

  return row;
}

function makeTimeSelect(selectedVal, onChange) {
  const sel = document.createElement('select');
  sel.className = 'custom-slot__select';
  getTimeOptions().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (t === selectedVal) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => onChange(sel.value));
  return sel;
}

function filterToOptions(toSel, fromVal) {
  const fromMins = timeStrToMinutes(fromVal);
  Array.from(toSel.options).forEach(opt => {
    opt.disabled = timeStrToMinutes(opt.value) <= fromMins;
  });
  if (timeStrToMinutes(toSel.value) <= fromMins) {
    const next = minutesToTimeStr(fromMins + 30);
    toSel.value = next;
  }
}

// ── Timezones ──────────────────────────────────────────────────────────────────
function renderTimezones() {
  renderTzChips();
  renderTzPresetBtns();
  renderTzMoreSelect();
}

function renderTzChips() {
  const container = document.getElementById('tzActive');
  container.innerHTML = '';
  const sorted = getSortedActiveTzs();
  for (const tz of sorted) {
    const chip = document.createElement('span');
    chip.className = 'tz-chip' + (tz.key === 'japan' ? ' tz-chip--primary' : '');
    chip.textContent = tz.label;
    if (tz.key !== 'japan') {
      const rm = document.createElement('button');
      rm.className = 'tz-chip__remove';
      rm.textContent = '×';
      rm.title = `Remove ${tz.label}`;
      rm.addEventListener('click', () => removeTz(tz.key));
      chip.appendChild(rm);
    }
    container.appendChild(chip);
  }
}

function renderTzPresetBtns() {
  const container = document.getElementById('tzPresets');
  container.innerHTML = '';
  // Show preset buttons that are NOT currently active
  const inactivePresets = TZ_PRESETS.filter(
    z => z.key !== 'japan' && !state.activeTzKeys.includes(z.key)
  );
  for (const tz of inactivePresets) {
    const btn = document.createElement('button');
    btn.className = 'tz-preset-btn';
    btn.textContent = `+ ${tz.label}`;
    btn.addEventListener('click', () => addTz(tz.key));
    container.appendChild(btn);
  }
}

function renderTzMoreSelect() {
  const sel = document.getElementById('tzMoreSelect');
  // Remove old extra options (keep index 0 = placeholder)
  while (sel.options.length > 1) sel.remove(1);

  const allActive = new Set(state.activeTzKeys);
  const presetKeys = new Set(TZ_PRESETS.map(z => z.key));

  TZ_EXTRA
    .filter(z => !allActive.has(z.key))
    .forEach(z => {
      const opt = document.createElement('option');
      opt.value = z.key;
      opt.textContent = z.label;
      sel.appendChild(opt);
    });

  sel.value = '';
}

// ── Output ─────────────────────────────────────────────────────────────────────
function renderOutput() {
  const text = generateOutput();
  const textEl = document.getElementById('outputText');
  const emptyEl = document.getElementById('outputEmpty');

  if (!text || state.selectedDates.size === 0) {
    textEl.style.display = 'none';
    emptyEl.textContent = t('outputEmpty');
    emptyEl.style.display = '';
  } else {
    emptyEl.style.display = 'none';
    textEl.textContent = text;
    textEl.style.display = '';
  }
}

// ── State mutations ────────────────────────────────────────────────────────────
function toggleDate(key) {
  if (state.selectedDates.has(key)) {
    state.selectedDates.delete(key);
  } else {
    state.selectedDates.set(key, { am: false, pm: false, allday: false, customs: [] });
  }
  renderCalendar();
  renderSlots();
  renderOutput();
}

function removeDate(key) {
  state.selectedDates.delete(key);
  renderCalendar();
  renderSlots();
  renderOutput();
}

function toggleSlot(key, slotType) {
  const slots = state.selectedDates.get(key);
  if (!slots) return;

  if (slotType === SLOT_ALLDAY) {
    slots.allday = !slots.allday;
    if (slots.allday) { slots.am = false; slots.pm = false; }
  } else if (slotType === SLOT_AM) {
    if (slots.customs.length > 0) return;
    slots.am = !slots.am;
    if (slots.am) slots.allday = false;
  } else if (slotType === SLOT_PM) {
    if (slots.customs.length > 0) return;
    slots.pm = !slots.pm;
    if (slots.pm) slots.allday = false;
  }

  // Auto-convert: 午前 + 午後 selected together → upgrade to 終日
  // Skip if customs exist — 終日 is blocked when custom slots are present
  if (slots.am && slots.pm && slots.customs.length === 0) {
    slots.allday = true;
    slots.am = false;
    slots.pm = false;
  }

  renderSlots();
  renderOutput();
}

function addCustomSlot(key) {
  const slots = state.selectedDates.get(key);
  if (!slots) return;
  slots.customs.push({ id: ++customIdCounter, start: '10:00', end: '11:00' });
  // Presets conflict with custom slots — deselect all of them
  slots.am = false;
  slots.pm = false;
  slots.allday = false;
  renderSlots();
  renderOutput();
}

function addTz(key) {
  if (!state.activeTzKeys.includes(key)) {
    state.activeTzKeys.push(key);
  }
  renderTimezones();
  renderOutput();
}

function removeTz(key) {
  state.activeTzKeys = state.activeTzKeys.filter(k => k !== key);
  renderTimezones();
  renderOutput();
}

// ── Copy ───────────────────────────────────────────────────────────────────────
function handleCopy() {
  const text = generateOutput();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = t('copiedBtn');
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = t('copyBtn');
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function handleReset() {
  state.selectedDates = new Map();
  renderCalendar();
  renderSlots();
  renderOutput();
}

// ── Language toggle ────────────────────────────────────────────────────────────
function toggleLang() {
  state.lang = state.lang === 'ja' ? 'en' : 'ja';
  render();
}

// ── Event listeners ────────────────────────────────────────────────────────────
document.getElementById('prevMonth').addEventListener('click', () => {
  if (state.month === 0) { state.month = 11; state.year--; }
  else state.month--;
  fetchHolidaysForYear(state.year); // fetch new year's holidays on demand (no-op if already fetched)
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  if (state.month === 11) { state.month = 0; state.year++; }
  else state.month++;
  fetchHolidaysForYear(state.year);
  renderCalendar();
});

document.getElementById('langToggle').addEventListener('click', toggleLang);

document.getElementById('todayBtn').addEventListener('click', () => {
  const now = new Date();
  state.year  = now.getFullYear();
  state.month = now.getMonth();
  renderCalendar();
});

document.getElementById('slotSettingsToggle').addEventListener('click', () => {
  const toggle = document.getElementById('slotSettingsToggle');
  const body   = document.getElementById('slotSettingsBody');
  const open   = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  body.hidden = open;
});
document.getElementById('copyBtn').addEventListener('click', handleCopy);
document.getElementById('resetBtn').addEventListener('click', handleReset);
document.getElementById('headerMessage').addEventListener('input', (e) => {
  state.headerTexts[state.lang] = e.target.value;
  renderOutput();
});

document.getElementById('tzMoreSelect').addEventListener('change', (e) => {
  if (e.target.value) {
    addTz(e.target.value);
    e.target.value = '';
  }
});

// ── Japanese holidays ──────────────────────────────────────────────────────────
const HOLIDAY_CACHE_KEY_PREFIX = 'timebridge_holidays_';
const HOLIDAY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function fetchHolidaysForYear(year) {
  if (state.holidayYearsFetched.has(year)) return;
  state.holidayYearsFetched.add(year);

  // Try localStorage cache first
  const cacheKey = HOLIDAY_CACHE_KEY_PREFIX + year;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (data && Date.now() - ts < HOLIDAY_CACHE_TTL_MS) {
        Object.assign(state.holidays, data);
        renderCalendar();
        return;
      }
    }
  } catch (_) { /* localStorage unavailable or corrupt — ignore */ }

  // Fetch from API (Japanese names — EN translation handled via static map)
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    if (!res.ok) return;
    const data = await res.json();
    Object.assign(state.holidays, data);
    // Persist to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
    } catch (_) { /* storage quota — ignore */ }
    renderCalendar();
  } catch (_) { /* offline or network error — calendar works without holidays */ }
}

async function initHolidays() {
  const thisYear = new Date().getFullYear();
  // Await current year so holidays are visible on first paint if cached
  await fetchHolidaysForYear(thisYear);
  // Fire-and-forget next year
  fetchHolidaysForYear(thisYear + 1);
}

// ── Boot ───────────────────────────────────────────────────────────────────────
render();
initHolidays();
