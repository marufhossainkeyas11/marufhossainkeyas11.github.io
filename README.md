# IPTVIDN M3U Generator

BDIX live TV M3U playlist generator — fetches fresh tokens automatically.

## Deploy to Vercel (Free, ~2 minutes)

### Step 1 — GitHub এ upload করো
1. https://github.com → **New repository** → নাম দাও `iptvidn-m3u`
2. এই ফাইলগুলো upload করো:
   ```
   index.html
   vercel.json
   package.json
   api/m3u.js
   ```

### Step 2 — Vercel এ deploy করো
1. https://vercel.com → **Sign up with GitHub** (ফ্রি)
2. **Add New Project** → তোমার `iptvidn-m3u` repo select করো
3. **Deploy** চাপো — ব্যস!

### Step 3 — ব্যবহার করো
Deploy হলে তুমি পাবে একটা URL যেমন:
```
https://iptvidn-m3u.vercel.app
```

M3U playlist URL:
```
https://iptvidn-m3u.vercel.app/m3u
```

## File Structure
```
iptvidn-m3u/
├── index.html      ← Frontend UI
├── vercel.json     ← Vercel config
├── package.json    ← Project info
└── api/
    └── m3u.js      ← Serverless function (token fetch + M3U generate)
```

## কীভাবে কাজ করে
1. `/m3u` endpoint এ GET request আসলে
2. `iptvidn.com/play.php?stream=CHANNEL` থেকে প্রতিটা channel এর token fetch করে
3. Token দিয়ে M3U format এ response দেয়
4. Browser automatically download করে

## Notes
- Token ~8 ঘণ্টা পর expire হয় — তাই re-download করো
- 147টা channel আছে
- Vercel free tier এ 60 second timeout — সব channel এ যথেষ্ট
