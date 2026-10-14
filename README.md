# Forsa — Job board

A job board where **job seekers** search and apply, and **companies** post jobs and review applicants.
Built with **React 18 + Vite + React Router + Context API / useReducer** (no UI library — hand-written CSS with light & dark themes).

### Features
- Hero search (keyword, city, job type) with `/` shortcut and popular searches
- Filters (job type, work mode, experience, salary, city), sorting and active-filter chips
- Split view: job list + sticky job details (opens as a drawer on mobile)
- 3-step apply flow (details → CV upload → review) with validation
- Saved jobs and “My applications” with a status tracker
- Company dashboard: KPIs, posts table, applicants drawer (shortlist / reject / delete), delete-job confirmation
- Post-a-job form with live preview and skill tags
- Sign in / sign up with role selection and one-click demo accounts
- Everything is saved in `localStorage`

### Demo accounts
| Role | Email | Password |
| --- | --- | --- |
| Job seeker | seeker@forsa.dev | demo123 |
| Company | company@forsa.dev | demo123 |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
