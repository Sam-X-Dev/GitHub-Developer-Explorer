// ===========================
// SELECTING HTML ELEMENTS
// ===========================
const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileDiv = document.getElementById("profile");
const statsDiv = document.getElementById("stats");
const reposDiv = document.getElementById("repos");
const loader = document.getElementById("loader");
const themeBtn = document.getElementById("themeBtn");

// ===========================
// DARK MODE
// ===========================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀";
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙";
  }
});

// ===========================
// SEARCH BUTTON
// ===========================
searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username !== "") {
    getGitHubUser(username);
  }
});

// ===========================
// ENTER KEY SUPPORT
// ===========================
usernameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// ===========================
// FETCH USER DATA
// ===========================
async function getGitHubUser(username) {
  try {
    loader.style.display = "block";
    profileDiv.innerHTML = "";
    statsDiv.innerHTML = "";
    reposDiv.innerHTML = "";

    // -----------------------
    // User Profile API
    // -----------------------
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      throw new Error("User not found");
    }
    const user = await userResponse.json();

    // -----------------------
    // User Repositories API (handle pagination, up to 100 per page)
    // -----------------------
    let repos = [];
    let page = 1;
    while (true) {
      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
      );
      if (!repoResponse.ok) {
        throw new Error("Could not fetch repositories");
      }
      const pageData = await repoResponse.json();
      if (!Array.isArray(pageData) || pageData.length === 0) break;
      repos = repos.concat(pageData);
      if (pageData.length < 100) break; // last page
      page++;
    }

    loader.style.display = "none";

    displayProfile(user);
    displayStats(repos);
    displayRepositories(repos);

    document.getElementById("repoTitle").textContent = `Repositories (${repos.length})`;
  } catch (error) {
    loader.style.display = "none";
    profileDiv.innerHTML = `
      <div class="card">
        <h2>${error.message}</h2>
      </div>
    `;
    statsDiv.innerHTML = "";
    reposDiv.innerHTML = "";
  }
}

// ===========================
// DISPLAY PROFILE
// ===========================
function displayProfile(user) {
  profileDiv.innerHTML = `
    <div class="card profile">
      <img src="${user.avatar_url}" alt="Avatar">
      <div class="profile-info">
        <h2>${user.name || "No Name Available"}</h2>
        <p>${user.bio || "No Bio Available"}</p>
        <p>👥 Followers : ${user.followers}</p>
        <p>➡ Following : ${user.following}</p>
        <p>📦 Public Repositories : ${user.public_repos}</p>
        <a href="${user.html_url}" target="_blank" class="github-btn">View GitHub Profile</a>
      </div>
    </div>
  `;
}

// ===========================
// DISPLAY STATISTICS
// ===========================
function displayStats(repos) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languageCount = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  let topLanguage = "N/A";
  let maxCount = 0;
  for (let language in languageCount) {
    if (languageCount[language] > maxCount) {
      maxCount = languageCount[language];
      topLanguage = language;
    }
  }

  statsDiv.innerHTML = `
    <div class="stat">
      <h3>📦 ${repos.length}</h3>
      <p>Repositories</p>
    </div>
    <div class="stat">
      <h3>⭐ ${totalStars}</h3>
      <p>Total Stars</p>
    </div>
    <div class="stat">
      <h3>🍴 ${totalForks}</h3>
      <p>Total Forks</p>
    </div>
    <div class="stat">
      <h3>💻 ${topLanguage}</h3>
      <p>Top Language</p>
    </div>
  `;
}

// ===========================
// DISPLAY REPOSITORIES
// ===========================
function displayRepositories(repos) {
  reposDiv.innerHTML = "";
  repos.forEach(repo => {
    reposDiv.innerHTML += `
      <div class="repo">
        <div class="repo-top">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </div>
        <div class="repo-bottom">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          <span>💻 ${repo.language || "N/A"}</span>
        </div>
      </div>
    `;
  });
}
