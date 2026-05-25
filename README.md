# TimeBridge / タイムブリッジ

A scheduling message generator for international teams.  
Select dates and time slots, add timezones, and copy a ready-to-send message — no sign-up, no server, no build step.

---

## Features

- **Calendar date picker** — click to select one or more dates
- **Flexible time slots** — Morning / Afternoon / All Day presets (customisable) plus unlimited custom time ranges
- **Multi-timezone support** — presets for Japan, India, UK, US Eastern, US Central, US Pacific; 40+ additional zones available
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
