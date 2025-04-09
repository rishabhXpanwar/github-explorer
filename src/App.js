import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readmeStates, setReadmeStates] = useState({});

  const fetchGitHubUser = async () => {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const user = await userRes.json();
      setUserData(user);

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
      const repoData = await repoRes.json();
      setRepos(repoData);
      setReadmeStates({}); // Reset README states
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleReadme = async (repoName) => {
    const current = readmeStates[repoName];
  
    // If already visible, just toggle visibility off
    if (current?.visible) {
      setReadmeStates((prev) => ({
        ...prev,
        [repoName]: { ...current, visible: false },
      }));
      return;
    }
  
    // If already fetched before, just show it
    if (current?.content) {
      setReadmeStates((prev) => ({
        ...prev,
        [repoName]: { ...current, visible: true },
      }));
      return;
    }
  
    // Else, fetch the README
    setReadmeStates((prev) => ({
      ...prev,
      [repoName]: { content: "", visible: true, loading: true },
    }));
  
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${username}/${repoName}/main/README.md`
      );
      const markdown = res.ok ? await res.text() : "No README found or unable to fetch.";
      setReadmeStates((prev) => ({
        ...prev,
        [repoName]: {
          content: markdown,
          visible: true,
          loading: false,
        },
      }));
    } catch (err) {
      console.error("Error loading README:", err);
      setReadmeStates((prev) => ({
        ...prev,
        [repoName]: {
          content: "Error loading README.",
          visible: true,
          loading: false,
        },
      }));
    }
  };
  

  return (
    <div className="app-container">
      <div className="container">
        <h1>GitHub Explorer</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchGitHubUser}>Search</button>
        </div>

        {userData && (
          <div className="profile">
            <img src={userData.avatar_url} alt="avatar" />
            <h2>{userData.name}</h2>
            <p>{userData.bio}</p>
            <p>📍 {userData.location}</p>
            <p>👥 {userData.followers} followers</p>
          </div>
        )}

        {repos.length > 0 && (
          <div className="repo-list">
            <h3>Repositories</h3>
            {repos.map((repo) => {
              const readmeState = readmeStates[repo.name];
              return (
                <div key={repo.id} className="repo">
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                  <p>
                    ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 🛠 {repo.language}
                  </p>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>

                  <button className="readme-btn" onClick={() => toggleReadme(repo.name)}>
                    {readmeState?.visible ? "Hide README" : "Show README"}
                  </button>

                  {readmeState?.visible && (
                    <div className="readme-box">
                      {readmeState.loading ? (
                        <p>Loading README...</p>
                      ) : (
                        <ReactMarkdown>{readmeState.content}</ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
