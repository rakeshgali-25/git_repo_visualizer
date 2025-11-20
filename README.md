GitHub Organization Analytics Dashboard

A visually polished React dashboard that analyzes any GitHub organization using public GitHub APIs.
Enter an org name → fetch all its repositories → visualize insights with modern charts & analytics.

This project focuses on:

✔ Performance
✔ Beautiful UI
✔ Accurate analytics (with pagination)
✔ Clean and scalable architecture

✨ Features
🔎 Search Any GitHub Organization

Uses these public GitHub APIs:

https://api.github.com/orgs/{org}

https://api.github.com/orgs/{org}/repos?per_page=100&page=N

https://api.github.com/orgs/{org}/members

Fully paginated → loads all repos, not just first 100.

📊 Repository Analytics

Total Repos

Active vs Archived

Stars, Forks, Issues

Language Distribution

Last Push Activity by Year

Top Repos by Stars/Forks

Table with Status & Filters

📈 Interactive Charts

Powered by React Highcharts:

🟣 Donut Chart → Language distribution

🔵 Column Chart → Repo activity timeline

💗 Horizontal Bar Chart → Stars vs Forks

🎨 Beautiful UI + UX Enhancements

Neon glass-morphism theme

Gradient cards

Avatar + org details

Smooth loader

Scrollable tables

Soft panel glows

🧩 Tech Stack
Layer	Technology
Frontend	React, JSX
Charts	Highcharts + highcharts-react-official
API	GitHub REST API v3
Styling	Pure CSS (custom theme)
Build Tool	Vite / CRA
📁 Project Structure
src/
 ├── components/
 │    ├── Loader.jsx
 │    ├── LanguageChart.jsx
 │    ├── ActivityChart.jsx
 │    ├── StarsForksChart.jsx
 │    ├── RepoTable.jsx
 ├── utils/
 │    └── fetchReposPaginated.js
 ├── App.jsx
 ├── App.css
 └── main.jsx

🚀 Installation
1️⃣ Clone Repo
git clone https://github.com/<your-username>/<repo>.git
cd <repo>

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm run dev

🔁 How pagination is handled

GitHub returns max 100 repos/page, so we fetch until pages end:

async function fetchAllRepos(org) {
  let results = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`
    );

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    results = [...results, ...data];
    page++;
  }

  return results;
}


Ensures:

✔ All repos fetched
✔ Accurate stats
✔ Reliable charts

⏳ Rate Limit Handling

Unauthenticated GitHub API limit = 60 requests/hour.
Dashboard:

Shows remaining requests

Minimizes repeated API calls

Supports optional token (future enhancement)

🖼 Screenshots

Add your screenshot here:

![Dashboard Screenshot](./screenshot.png)



🙌 Credits

Built by Rakesh G
Powered by React + Highcharts + GitHub API
