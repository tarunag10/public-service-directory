# Public Service Directory

Escalation routes and public-service support directory for UK civic, regulated-service, and consumer complaint pathways.

## Demo

Open `index.html` in a browser. This repository is intentionally no-backend and keeps user data local to the browser.

The demo can be searched by:

- keyword or common problem wording
- sector
- first-step notes
- evidence to keep
- official route URL

## First-slice capability

The directory now builds an action plan for the current query or selected sector. Each plan gives:

- the first practical step
- evidence to gather before escalating
- the likely escalation path
- the official URL to open next

The helper is exported as `buildActionPlan(query, options)` from `src/directory.js` so tests and future UI surfaces can reuse the same route selection logic.

## Current route coverage

- council complaints and Local Government and Social Care Ombudsman
- Financial Ombudsman Service
- Rail Ombudsman
- Ofgem energy complaints guidance
- Ofcom complaints guidance
- Information Commissioner's Office
- Care Quality Commission feedback on care
- university complaints and Office of the Independent Adjudicator
- Housing Ombudsman
- Citizens Advice consumer routes and Trading Standards signposting

## Open-source basics

- Code: MIT licence
- Content/templates: use with attribution under CC BY 4.0 where marked
- Accessibility target: WCAG 2.2 AA
- Contributions: start with issues labelled `good first issue`

## Safety note

This project provides information and drafting support, not legal advice. Users should check deadlines, local rules, and professional advice where needed.
