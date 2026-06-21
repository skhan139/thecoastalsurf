# The Coastal Surf - Travel Baseball Program Website

A modern, responsive React website for The Coastal Surf travel baseball program, featuring a teal and black color scheme.
# The Coastal Surf — Travel Baseball Website

This repository is a Vite + React site for the Coastal Surf travel baseball program. It provides public pages, camp/clinic/travel registration, a payments integration flow, and an Admin UI for managing registrations.

---

## Highlights / Features

- Public pages: Home, Travel Ball, About, Contact, and registration forms for Camp / Travel Ball / Clinic.
- Admin interface (`/admin`) to view and manage registrations:
	- Realtime and manual fetch of registrations from Firestore.
	- Per-section search (name + age) and global min/max age filters.
	- Pagination (5 players per page) with Prev/Next controls.
	- Mark payments via a "Paid" checkbox — saves to Firestore and persists.
	- Create admin account (saves display name) and sign in.
- Modernized form styling and focus states (in `src/pages/Registration.css`).
- Home hero additions: one-time wave SVG overlay and one-time homepage fade-in animation for first visits.

---

## Project Structure (important files)

```
src/
├─ components/
│  ├─ Navigation.jsx
│  └─ Footer.jsx
├─ pages/
│  ├─ Home.jsx (+Home.css)
│  ├─ Admin.jsx (+Registration.css)
│  ├─ CampRegistration.jsx
│  ├─ TravelBallRegistration.jsx
│  └─ ClinicRegistration.jsx
├─ App.jsx
├─ main.jsx
└─ firebase.js

firestore.rules
package.json
vite.config.js
README.md
```

Key places to look:
- `src/pages/Admin.jsx` — admin logic (search, pagination, paid toggle, auth flows).
- `firestore.rules` — Firestore security rules (reads/updates/deletes control).
- `src/pages/Registration.css` — stylings for the admin and registration forms.

---

## Firebase / Firestore notes

- The app expects Firebase initialization in `src/firebase.js` using environment variables (prefixed with `VITE_`).
- Current Firestore rules (in `firestore.rules`):
	- Public creation of `campRegistrations` is allowed with validation.
	- Authenticated users may read registrations.
	- Authenticated users may update only `paymentStatus` and `paymentAmount` (prevents arbitrary updates).
	- Deletes remain admin-only.

To deploy the rules:

```bash
firebase deploy --only firestore:rules
```

Security options you may prefer in future:
- Use an `admins` collection and check `exists()` in rules.
- Use custom claims (Admin SDK) and check `request.auth.token.admin` in rules.

---

## Development / Run locally

1. Install packages:

```bash
npm install
```

2. Dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

---

## Environment variables

Create a `.env` (or set env vars in Vercel) with:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_PAYMENTS_API_URL=...   # backend payments endpoint (if used)
```

---

## Deployment (Vercel)

- Recommended build command: `npm run build` (Vite defaults). Output directory: `dist`.
- If you see missing hashed assets on Vercel (404 for `index-<hash>.css`), check:
	- Build logs to ensure the build completed and assets uploaded.
	- Vercel CDN/cache — try redeploy or purge cache.
	- `vite.config.js` `base` setting if hosting under a subpath.

---

## Recent/Notable Changes

- Admin page: per-section search, pagination, paid checkbox (Firestore updates), display name saved on account creation.
- Styles: modernized inputs and `.submit-button.inline` variant for inline controls.
- Home: one-time wave overlay and homepage fade-in on first visit (`localStorage` keys: `coastal_seen_wave`, `coastal_seen_intro`).
- Firestore rules updated to allow authenticated updates to payment fields only.

---

## Next suggestions

- Switch `paymentStatus` to a boolean `paid` for simpler logic and rules (I can refactor this).
- For large registration counts implement server-side pagination using Firestore `limit` + `startAfter`.
- Consider admin management via an `admins` collection or custom claims for better access control.

---

If you'd like, I can also add a short `DEPLOY.md` with Vercel steps or convert payment status to a boolean across code + rules.

