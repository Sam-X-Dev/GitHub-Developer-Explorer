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
