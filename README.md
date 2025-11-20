GitHub Organization Analytics Dashboard

A visually polished React dashboard that analyzes any GitHub organization using public GitHub APIs.
Enter an org name → fetch all its repositories → visualize insights with modern charts & analytics.

This project focuses on:
✔ Performance
✔ Beautiful UI
✔ Clean code structure
✔ Accurate analytics (handling GitHub pagination limits)

✨ Features
✅ Search Any GitHub Organization

Enter an org name and fetch full metadata using:

https://api.github.com/orgs/{org}

https://api.github.com/orgs/{org}/members

Paginated repo fetch:
https://api.github.com/orgs/{org}/repos?per_page=100&page=1..N

✅ Repository Analytics

Total repos

Active vs Archived

Open issues stats

Stars & forks

Last push timelines

Language usage statistics

✅ Interactive Charts (React Highcharts)

Donut Pie Chart → Language Distribution

Column Chart → Repo Activity Timeline

Bar Chart → Top Repos (Stars vs Forks)

✅ Full Repo Table With Filters

Name, language, stars, forks, open issues, last push, status

Includes scrollable table, sorting-ready structure

Shows:

“Showing X of Y loaded (Z total in org)”

✅ UI & UX Enhancements

Neon-gradient theme

Smooth animations

Avatar + org metadata

Active filter chips

Elegant loader

Panel glow effects

📦 Tech Stack
Layer	Technologies
Frontend	React, JSX, CSS, Highcharts
API	GitHub REST API (v3)
Build Tool	Vite / CRA
Visualization	Highcharts + React wrapper
📁 Project Structure
src/
 ├── components/
 │    ├── LanguageChart.jsx
 │    ├── ActivityChart.jsx
 │    ├── StarsForksChart.jsx
 │    ├── RepoTable.jsx
 │    ├── Loader.jsx
 ├── utils/
 │    └── fetchReposPaginated.js
 ├── App.jsx
 ├── App.css
 └── index.jsx

🚀 Installation & Setup
1. Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2. Install Dependencies
npm install

3. Start Development Server
npm run dev

🔑 How Pagination Is Handled

GitHub returns max 100 repos per page.

This dashboard fetches all of them:

async function fetchAllRepos(org) {
  let page = 1;
  let all = [];
  while (true) {
    const res = await fetch(
      `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`
    );
    const data = await res.json();
    if (data.length === 0) break;
    all = [...all, ...data];
    page++;
  }
  return all;
}


This ensures:
✔ Accurate repo count
✔ Accurate charts
✔ No missing data

📊 API Rate Limits

Unauthenticated GitHub calls = 60 requests / hour (shown in UI).
Dashboard caches results during session to reduce calls.

You can add a GitHub token (optional):

Authorization: Bearer <token>

🖼 Screenshots
🔍 Dashboard Overview

(Paste your screenshot here)
Example placeholder:

![Dashboard Screenshot](./screenshot.png)

📝 Future Improvements

Add dark/light toggle

Repo sorting + pagination

Member analytics

Deploy to Vercel / Netlify

Authenticated API mode (higher rate limits)

🙌 Credits

Built by Rakesh G with ❤️
Designed & optimized using React + Highcharts + GitHub API
