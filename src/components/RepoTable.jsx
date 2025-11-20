export default function RepoTable({ repos, loadedCount, totalCount }) {
  return (
    <div className="table-wrapper">
      <div className="table-header-row">
        <span className="table-title">Repositories</span>
        <span className="table-count">
          Showing <strong>{repos.length}</strong>
          {loadedCount != null && (
            <>
              {" "}
              of <strong>{loadedCount}</strong> loaded
            </>
          )}
          {totalCount != null && (
            <>
              {" "}
              (<strong>{totalCount}</strong> total in org)
            </>
          )}
        </span>
      </div>

      <div className="table-scroll">
        <table className="repo-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Language</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Open Issues</th>
              <th>Last Push</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((r) => (
              <tr key={r.id}>
                <td>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-link"
                  >
                    {r.name}
                  </a>
                </td>
                <td>{r.language || "-"}</td>
                <td>{r.stargazers_count}</td>
                <td>{r.forks_count}</td>
                <td>{r.open_issues_count}</td>
                <td>
                  {r.pushed_at
                    ? new Date(r.pushed_at).toISOString().slice(0, 10)
                    : "-"}
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      r.archived ? "archived" : "active"
                    }`}
                  >
                    {r.archived ? "Archived" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
            {repos.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-cell">
                  No repositories to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
