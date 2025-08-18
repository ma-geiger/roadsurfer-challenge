# Roadsurfer Rental Management System

## Description

A rental management dashboard for a campervan rental business. The app shows a weekly calendar view of all pickups and returns at different stations, making it easy for staff to see what's happening each day.

### Key Features

- **Search & Select Stations** - autocomplete component to find specific stations
- **Weekly Calendar View** - 7-day grid that works on mobile and desktop
- **Booking Management** - see start/end dates, customer info, and booking details
- **Drag & Drop Rescheduling** - move bookings around to change dates
- **State Persistence** - remembers which week you're viewing

### Tech Stack

I chose Vue.js 3 with the Composition API because it's modern and makes state management straightforward. Added TypeScript for better code quality, Tailwind CSS for quick styling, and Vite for fast development. The app is fully responsive and works great on mobile devices.

### How to run

```bash
git clone https://github.com/ma-geiger/roadsurfer-challenge.git
cd roadsurfer-challenge
npm install
npm run dev
```

### How to test

```bash
npm run test
```

### How to deploy

The app automatically deploys to GitHub Pages when you push to the main branch.  
You can see it live at: https://ma-geiger.github.io/roadsurfer-challenge

### API Integration

The app connects to a mock API for stations and bookings. I structured it so it's easy to swap in real endpoints later (using `.env`).

The data flows from station selection through to the calendar display, with drag and drop updates handled locally.

## What I Learned

Building this helped me get really comfortable with Vue 3's Composition API and TypeScript.  
I also got to practice writing comprehensive tests and setting up CI/CD with GitHub Actions. The drag and drop functionality was difficult (but fun) to implement. I am happy I could do it because it made the app feel much more interactive.

## Future Improvements

Some ideas I'd like to explore:

- Better filtering and search options
- Monthly calendar view
- Adding a proper date picker to handle date search quicker and in a more user friendly way
- Multi-language support
- Integration with a real backend

## Challenges I Faced

The biggest challenge was getting the drag and drop to work smoothly across different screen sizes. I also spent some time on deciding about the implementation details, like what to use pages or modals for detail pages etc.

## Project Structure

```
roadsurfer-challenge/
├── src/
│   ├── components/
│   │   ├── common/                # Reusable components
│   │   └── week/                  # Calendar components
│   ├── pages/                     # Route components
│   ├── composables/               # Reusable logic
│   ├── services/                  # API integration
│   ├── stores/                    # State management
│   ├── assets/                    # Styling
│   ├── router/                    # Navigation
│   └── __tests__/                 # Test files
├── .github/                       # GitHub Actions
├── package.json                   # Dependencies & scripts
├── vite.config.ts                 # Build configuration
└── tailwind.config.js             # Tailwind CSS config
```