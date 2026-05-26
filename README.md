# TimeBridge / タイムブリッジ

A scheduling message generator for international teams.  
Select dates and time slots, add timezones, and copy a ready-to-send message — no sign-up, no server, no build step.

---

## Features

- **Calendar date picker** — click to select one or more dates; Japanese public holidays highlighted in red with name tooltip
- **Flexible time slots** — Morning / Afternoon / All Day presets (customisable) plus unlimited custom time ranges
- **Multi-timezone support** — presets for Japan, India, UK, US Eastern, US Central, US Pacific; 38 additional zones available
- **DST-aware** — all timezone conversions use IANA timezone data via the browser's native `Intl` API; daylight saving time is handled automatically for every date
- **Smart output** — single-timezone mode shows clean minimal text; multi-timezone mode adds inline conversions ordered by proximity to Japan
- **Japanese / English toggle** — all UI labels and output text switch instantly; each language keeps its own independent header message
- **Copy to clipboard** — one click copies the full formatted message
- **Responsive** — works on desktop and mobile

---

## Usage

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. Click dates on the calendar
3. Select time slots (Morning / Afternoon / All Day / Custom)
4. Add timezones as needed from the panel below the calendar
5. Edit the opening message if you wish
6. Click **コピーする / Copy** and paste into Slack, email, or any chat tool

---

## Output format

**Japanese, single timezone:**
```
以下の日程でご都合いかがでしょうか。
・6月11日（木） 10:00~12:00
　6月11日（木） 14:00~15:00
・6月12日（金） 10:00~18:00
```

**Japanese, multiple timezones:**
```
以下の日程でご都合いかがでしょうか。
・6月11日（木） 10:00~12:00 日本 / 6:30~8:30 India / 2:00~4:00 UK / 6月10日 21:00~23:00 US Eastern
　6月11日（木） 14:00~15:00 日本 / 10:30~11:30 India / 6:00~7:00 UK / 6月11日 1:00~2:00 US Eastern
```

**English, multiple timezones:**
```
Would any of the following schedule work for you?
- Jun 11th (Thu) 10:00~12:00 Japan / 6:30~8:30 India / 2:00~4:00 UK / Jun 10 21:00~23:00 US Eastern
  Jun 11th (Thu) 14:00~15:00 Japan / 10:30~11:30 India / 6:00~7:00 UK / Jun 11 1:00~2:00 US Eastern
```

---

## Timezone notes

- **Japan** is always the primary timezone (all slots are defined in JST)
- Timezones are ordered by proximity to Japan (closest UTC offset first)
- Order and offsets update automatically — DST transitions are applied per selected date, not per today's offset
- Overnight conversions show the source date prefix (e.g. `Jun 10 21:00~23:00`) rather than a `(+1)` suffix

---

## Technical notes

- Pure HTML / CSS / JavaScript — no framework, no build tool, no dependencies
- Timezone conversion uses `Intl.DateTimeFormat` with full IANA timezone identifiers
- Works offline after the first load

---

## Development

```bash
# No install needed — just open the file
open index.html
```

Files:
```
index.html   # App shell
style.css    # All styles (CSS variables, responsive layout)
script.js    # App logic (calendar, timezone, output generation)
i18n.js      # Japanese / English string maps
```

---

## Change Log

### v1.0.5 — 2026-05-26
- Fix: Saturday now displays in blue and Sunday in red, matching Japanese calendar convention (were previously swapped)
- Feature: emoji favicon (🌉) shown in browser tab
- Feature: click the output text to instantly select all — paste-ready without triple-click
- Feature: Reset button now asks for confirmation before clearing all selections
- Feature: on mobile, page auto-scrolls to the output panel the first time a result is generated
- Fix: removed dead CSS class `.tz-preset-btn--hidden`
- Fix: removed duplicate `.calendar__nav-right` CSS rule

### v1.0.4 — 2026-05-26
- Fix: custom time slot start time now capped at 23:00 — prevents a zero-duration 23:30~23:30 slot
- Fix: removed duplicate `filterToOptions` call in slot settings (fired twice per change)
- Fix: removed unused `presetKeys` variable in `renderTzMoreSelect()`
- Fix: removed unused `iana` parameter from `utcToIana()`
- Docs: corrected additional timezone count from "40+" to "38" in README

### v1.0.3 — 2026-05-25
- Feature: "Today / 今日" button in the calendar nav — jumps back to the current month; disabled (greyed out) when already on the current month
- Fix: Holiday tooltip now appears instantly using a CSS `::after` pseudo-element instead of the native `title` attribute (which has an OS-level ~1 s delay)
- Fix: Holiday tooltip text is now shown in English when the UI is in English mode (static built-in translation map — no extra API call)
- Fix: Past weekends and past holidays are now greyed out to match past weekdays, instead of retaining their red/blue colour
- Fix: Japanese holiday display was broken after a failed attempt to fetch an `/en/` API endpoint; reverted to the single reliable JA endpoint with client-side EN translation

### v1.0.2 — 2026-05-25
- Feature: Japanese public holidays are now highlighted in red on the calendar
- Hover over a highlighted date to see the holiday name (browser tooltip via `title` attribute)
- Holidays fetched from `holidays-jp.github.io/api/v1/{year}/date.json` (current year + next year loaded on startup; additional years fetched on demand when navigating the calendar)
- API responses are cached in `localStorage` for 30 days — works offline after first load; calendar gracefully degrades if the request fails

### v1.0.1 — 2026-05-25
- Fix: All Day, Morning, and Afternoon preset slots are now mutually exclusive with Custom time ranges — adding a Custom clears all presets and disables them; removing the last Custom re-enables presets
- Fix: Morning + Afternoon auto-upgrade to All Day is skipped when Custom slots exist
- UI: `+ Custom` button moves below the last custom row as `+ Add another time range` once the first custom slot is added

### v1.0.0 — 2026-05-25
- Initial release
- Calendar date picker with Morning / Afternoon / All Day / Custom time slots
- Customisable default time ranges for preset slots
- Multi-timezone support with DST-aware conversion via `Intl` API
- Preset zones: Japan, India, UK, US Eastern, US Central, US Pacific
- 40+ additional zones available via dropdown
- Timezones auto-ordered by proximity to Japan
- Single-timezone mode (clean output) and multi-timezone mode (inline conversions)
- Japanese / English language toggle with per-language header text
- Responsive layout for desktop and mobile
