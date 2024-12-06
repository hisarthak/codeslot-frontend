import React from "react";
import "./RepoList.css";

const RepoList = () => {
  const repoData = [
    { name: "controllers", message: "Clean up code", time: "last month" },
    { name: "models", message: "Initialize data", time: "last month" },
    { name: "routes", message: "Add new categories", time: "last month" },
    { name: "views", message: "Update page layout", time: "5 days ago" },
  ];

  return (
    <div className="repo-list">
      <div className="repo-header">
        <div><p><i>TravelHaven</i></p></div>
        
        <div ><p><i class="fa-solid fa-code-commit"></i><b style={{
            fontSize: "small"
        }}> 139 commits</b></p></div>
      </div>
      <div className="repo-files">
      <ul>
        {repoData.map((repo, index) => (
          <li key={index} className="repo-item">
            <div className="repo-file-name"><i class="fas fa-file"></i>
            &nbsp;&nbsp;&nbsp;
            {repo.name}</div>
            <div className="repo-message">{repo.message}</div>
            <div className="repo-time">{repo.time}</div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default RepoList;
