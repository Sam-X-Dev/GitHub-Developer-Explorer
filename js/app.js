
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
// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
document.body.classList.add("dark");
themeBtn.textContent = "☀";
}
// Toggle theme
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
// Show loader
loader.style.display = "block";
// Clear old data
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
// User Repositories API
// -----------------------
const repoResponse = await
fetch(`https://api.github.com/users/${username}/repos`);
const repos = await repoResponse.json();
// Hide loader
loader.style.display = "none";
// Display data
displayProfile(user);
displayStats(repos);
displayRepositories(repos);
// Repository count
document.getElementById("repoTitle").textContent = `Repositories
(${repos.length})`;
} catch (error) {
loader.style.display = "none";
profileDiv.innerHTML =
`
<div class="card">
<h2>${error.message}</h2>
</div>
`
;
statsDiv.innerHTML = "";
reposDiv.innerHTML = "";
}
}
// ===========================
// DISPLAY PROFILE
// ===========================
function displayProfile(user) {
profileDiv.innerHTML =
`
<div class="card profile">
<img src="${user.avatar_url}" alt="Avatar">
<div class="profile-info">
<h2>${user.name || "No Name Available"}</h2>
<p>${user.bio || "No Bio Available"}</p>
<p>👥 Followers : ${user.followers}</p>
<p>➡ Following : ${user.following}</p>
<p>📦 Public Repositories : ${user.public_repos}</p>
<a href="${user.html_url}" target="_blank" class="github-btn">View GitHub
Profile</a>
</div>
</div>
`
;
}
// ===========================
// DISPLAY STATISTICS
// ===========================
function displayStats(repos) {
// Total stars using reduce()
const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
// Total forks using reduce()
const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
// Finding most used language
const languageCount = {};
repos.forEach(repo => {
if (repo.language) {
if (languageCount[repo.language]) {
languageCount[repo.language]++;
} else {
languageCount[repo.language] = 1;
}
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
statsDiv.innerHTML =
`
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
`
;
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
`
;
});
}
