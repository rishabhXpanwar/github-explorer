import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null);

  const fetchGitHubUser = async () => {
    try {
      // Get user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const user = await userRes.json();
      setUserData(user);

      // Get user repos
      const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <h1>GitHub Explorer</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={fetchGitHubUser}>Search</button>

      {userData && (
        <div className="profile">
          <img src={userData.avatar_url} alt="avatar" />
          <h2>{userData.name}</h2>
          <p>{userData.bio}</p>
          <p>📍 {userData.location}</p>
          <p>👥 {userData.followers} followers</p>
        </div>
      )}
      {selectedRepo && (
  <div className="repo-detail">
    <h2>📘 {selectedRepo.name}</h2>
    <p>{selectedRepo.description}</p>
    <p>⭐ Stars: {selectedRepo.stargazers_count}</p>
    <p>🍴 Forks: {selectedRepo.forks_count}</p>
    <p>🛠 Language: {selectedRepo.language}</p>
    <p>🔁 Updated: {new Date(selectedRepo.updated_at).toLocaleDateString()}</p>

    {selectedRepo.topics?.length > 0 && (
      <p>
        📖 Topics: {selectedRepo.topics.join(', ')}
      </p>
    )}

    <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer">
      Open on GitHub →
    </a>

    <br />
    <button onClick={() => setSelectedRepo(null)}>Close</button>
  </div>
)}

      {repos.length > 0 && (
        <div className="repo-list">
          <h3>Repositories</h3>
          {repos.map((repo) => (
  <div key={repo.id} className="repo" onClick={() => setSelectedRepo(repo)}>
    <h4>{repo.name}</h4>
    <p>{repo.description}</p>
    <p>
      ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 🛠 {repo.language}
    </p>
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
      View on GitHub
    </a>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default App;
