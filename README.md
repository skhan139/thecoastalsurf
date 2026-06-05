# The Coastal Surf - Travel Baseball Program Website

A modern, responsive React website for The Coastal Surf travel baseball program, featuring a teal and black color scheme.

## Features

- **Home Page**: Eye-catching hero section with program information and features showcase
- **Team Page**: Display of coaching staff and player roster
- **Schedule Page**: Upcoming games and results with location and time details
- **Contact Page**: Contact information and message form for inquiries
- **Responsive Design**: Fully mobile-optimized layout

## Project Structure

```
src/
├── components/
│   ├── Navigation.jsx
│   ├── Navigation.css
│   ├── Footer.jsx
│   └── Footer.css
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Team.jsx
│   ├── Team.css
│   ├── Schedule.jsx
│   ├── Schedule.css
│   ├── Contact.jsx
│   └── Contact.css
├── App.jsx
├── App.css
├── main.jsx
├── index.css
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Color Scheme

- **Primary Teal**: `#008B8B`
- **Light Teal**: `#20B2AA`
- **Black**: `#1a1a1a`
- **Black Light**: `#2d2d2d`
- **White**: `#ffffff`

## Technologies Used

- **React**: UI framework
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **CSS**: Custom styling with CSS variables

## Customization

### Update Team Information

Edit `src/pages/Team.jsx` to add your real players and coaches.

### Update Schedule

Modify the `games` array in `src/pages/Schedule.jsx` with your actual schedule.

### Update Contact Information

Edit the contact details in `src/pages/Contact.jsx` and `src/components/Footer.jsx`.

### Modify Colors

Update the CSS variables in `src/index.css` under the `:root` selector to change the color scheme.

## Future Enhancements

- Add player profiles with photos and statistics
- Integrate with a backend for dynamic game scores
- Add photo gallery for tournaments
- Implement email functionality for contact form
- Add team news/blog section
- Tournament history and achievements

## Camp Registration + Card Payments

The camp registration form stores athlete/parent details in Firestore and then redirects to secure Stripe Checkout for card payment.

### 1) Configure environment variables

Copy `.env.example` to `.env` and set:

- `VITE_FIREBASE_*` values for your Firebase project
- `VITE_PAYMENTS_API_URL` (for local dev: `http://localhost:4242`)
- `STRIPE_SECRET_KEY` for your Stripe account (server-side only)
- `FRONTEND_ORIGIN` (for local dev: `http://localhost:5173`)

### 2) Start the apps

- Frontend: `npm run dev`
- Payments API: `npm run payments:dev`

### 3) Stripe webhook (recommended for production)

Use a webhook to update Firestore `paymentStatus` to `paid` after successful checkout.
Current form writes registrations as `paymentStatus: "pending"` before redirecting to checkout.

## Deploying to Vercel

This project is configured for Vercel with SPA routing support via [vercel.json](vercel.json).

### Required Vercel Environment Variables

Set these in Vercel Project Settings → Environment Variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_PAYMENTS_API_URL` (point this to your deployed payments API URL)

### Notes

- Build command: `npm run build`
- Output directory: `dist`
- If routes like `/camp-registration` fail on refresh, redeploy after committing `vercel.json`.

## License

MIT License - Feel free to use this project for your travel baseball program.
