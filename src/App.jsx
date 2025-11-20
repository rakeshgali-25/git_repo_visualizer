import React, { useState,useEffect } from "react";
import LanguageChart from "./components/LanguageChart";
import ActivityChart from "./components/ActivityChart";
import StarsForksChart from "./components/StarsForksChart";
import RepoTable from "./components/RepoTable";

const GITHUB_BASE = "https://api.github.com";

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader-spinner" />
        <div className="loader-text">Fetching GitHub data…</div>
      </div>
    </div>
  );
}


async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

// 1) org metadata (true total repos, followers, etc.)
async function fetchOrgMeta(org) {
  return fetchJson(`${GITHUB_BASE}/orgs/${org}`);
}

// 2) paginated repo list
async function fetchAllRepos(org, perPage = 100, maxPages = 10) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const pageData = await fetchJson(
      `${GITHUB_BASE}/orgs/${org}/repos?per_page=${perPage}&page=${page}`
    );
    all.push(...pageData);
    if (pageData.length < perPage) break; // last page
  }
  return all;
}

// 3) optional rate limit info (for the card)
async function fetchRateLimit() {
  try {
    return await fetchJson(`${GITHUB_BASE}/rate_limit`);
  } catch {
    return null;
  }
}

// ───────── helpers to derive analytics from repos ─────────

function buildLanguageStats(repos) {
  const counts = new Map();
  repos.forEach((r) => {
    if (!r.language) return;
    counts.set(r.language, (counts.get(r.language) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}

function buildActivityBuckets(repos) {
  const buckets = new Map();
  repos.forEach((r) => {
    if (!r.pushed_at) return;
    const year = new Date(r.pushed_at).getFullYear();
    buckets.set(year, (buckets.get(year) || 0) + 1);
  });

  return Array.from(buckets.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

function buildStarsForksTopN(repos, n = 5) {
  return repos
    .slice()
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, n)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    }));
}

// ───────── main app ─────────

export default function App() {
  const [orgInput, setOrgInput] = useState("philips-software");
  const [orgMeta, setOrgMeta] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [starsForks, setStarsForks] = useState([]);
  const [rateInfo, setRateInfo] = useState(null);

  const [languageFilter, setLanguageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrgData(org) {
    if (!org) return;
    setLoading(true);
    setError("");
    try {
      // kick off meta + rate in parallel
      const metaPromise = fetchOrgMeta(org);
      const ratePromise = fetchRateLimit();
      const allRepos = await fetchAllRepos(org);

      const meta = await metaPromise;
      const rate = await ratePromise;

      setOrgMeta(meta);
      setRepos(allRepos);
      setLanguageStats(buildLanguageStats(allRepos));
      setActivity(buildActivityBuckets(allRepos));
      setStarsForks(buildStarsForksTopN(allRepos, 5));
      setRateInfo(rate);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
      setOrgMeta(null);
      setRepos([]);
      setLanguageStats([]);
      setActivity([]);
      setStarsForks([]);
      setRateInfo(null);
    } finally {
      setLoading(false);
    }
  }

  // load initial org when app starts (optional: wrap in useEffect)
  useEffect(() => { loadOrgData("philips-software"); }, []);

  // filtered repos for table
  const filteredRepos = repos.filter((r) => {
    if (languageFilter !== "All" && r.language !== languageFilter) return false;
    if (statusFilter === "Active" && r.archived) return false;
    if (statusFilter === "Archived" && !r.archived) return false;
    if (
      searchText &&
      !r.name.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    return true;
  });

  const languagesUsed = languageStats.length;
  const totalRepos = orgMeta?.public_repos ?? repos.length;
  const rateLimitText =
    rateInfo?.resources?.core
      ? `${rateInfo.resources.core.remaining}/${rateInfo.resources.core.limit} remaining`
      : "GitHub unauthenticated limit: 60 req/hour";

  return (
    <div className="app">
      {loading && <Loader />}

      {/* HEADER */}
     <header className="header">
  <div className="logo-circle">
    {orgMeta?.avatar_url ? (
      <img
        src={orgMeta.avatar_url}
        alt={orgMeta.name || orgMeta.login}
        className="logo-avatar"
      />
    ) : (
      "G"
    )}
  </div>
  <div>
    <div className="title">
      {orgMeta?.name || orgMeta?.login || "GitHub Org Analytics"}
    </div>
    {orgMeta && (
      <div className="subtitle">
        {orgMeta.description || "GitHub Org Analytics"}
      </div>
    )}
  </div>
</header>


      {/* ORG SEARCH */}
      <div className="org-search-row">
        <input
          className="org-input"
          value={orgInput}
          onChange={(e) => setOrgInput(e.target.value)}
          placeholder="Enter GitHub org name, e.g. philips-software"
        />
        <button
          className="search-button"
          onClick={() => loadOrgData(orgInput.trim())}
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {orgMeta && (
        <div className="org-label">
          Showing data for: <span className="org-name">{orgMeta.login}</span>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {/* TOP CARDS */}
      <div className="cards-row">
        <div className="card blue">
          <div className="card-label">Total Repos</div>
          <div className="card-value">{totalRepos}</div>
        </div>
        <div className="card purple">
          <div className="card-label">Active Repos</div>
          <div className="card-value">
            {repos.filter((r) => !r.archived).length}
          </div>
        </div>
        <div className="card pink">
          <div className="card-label">Archived Repos</div>
          <div className="card-value">
            {repos.filter((r) => r.archived).length}
          </div>
        </div>
        <div className="card blue">
          <div className="card-label">Stars Total</div>
          <div className="card-value">
            {repos.reduce(
              (sum, r) => sum + (r.stargazers_count || 0),
              0
            )}
          </div>
        </div>
      </div>

      {/* SUB CARDS */}
      <div className="sub-cards-row">
        <div className="sub-card">
          <div className="card-label">Languages Used</div>
          <div className="card-value sub">{languagesUsed}</div>
        </div>
        <div className="sub-card">
          <div className="card-label">Repos Loaded</div>
          <div className="card-value sub">{repos.length}</div>
        </div>
        <div className="sub-card">
          <div className="card-label">Filters</div>
          <div className="card-value sub">
            {languageFilter} / {statusFilter}
          </div>
        </div>
        <div className="sub-card">
          <div className="card-label">Rate Limit</div>
          <div className="sub-text">{rateLimitText}</div>
        </div>
      </div>

      {/* FILTERS ROW */}
      <div className="filters-row">
        <input
          className="search-repos-input"
          placeholder="Search repositories"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="dropdown"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="All">All languages</option>
          {languageStats.map((l) => (
            <option key={l.language} value={l.language}>
              {l.language}
            </option>
          ))}
        </select>
        <select
          className="dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Status: All</option>
          <option value="Active">Active only</option>
          <option value="Archived">Archived only</option>
        </select>
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        <LanguageChart data={languageStats} />
        <ActivityChart data={activity} />
        <StarsForksChart data={starsForks} />
      </div>

      {/* TABLE */}
      <RepoTable
          repos={filteredRepos}
          loadedCount={repos.length}
          totalCount={orgMeta?.public_repos}
        />

    </div>
  );
}
