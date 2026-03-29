let allIssues = [];

const container = document.getElementById("issuesContainer");

const tabs = document.querySelectorAll(".tab");

if (!localStorage.getItem("isLoggedIn")) location.href = "index.html";

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("isLoggedIn");
  location.href = "index.html";
};

async function fetchIssues() {
  container.innerHTML = `<div class="loader"></div>`;
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  allIssues = data.data;
  render(allIssues);
}

function render(data) {
  document.getElementById("issueCount").textContent = data.length;

  if (!data.length) {
    container.innerHTML = `<p style="color:#6b7280;padding:20px;">No issues found.</p>`;
    return;
  }

  container.innerHTML = data
    .map((i) => {
      const tags = (i.labels || []).map(tagChip).join("");
      const date = new Date(i.createdAt)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "/");
      return `
      <div class="card ${(i.status || "").toLowerCase()}" data-id="${i.id}">
        <div class="card-header">
          ${statusIcon(i.status)}
          ${priorityBadge(i.priority || "low")}
        </div>
        <h3>${i.title}</h3>
        <p>${(i.description || "").slice(0, 70)}...</p>
        <div class="card-tags">${tags}</div>
        <div class="card-meta">
          #${i.id} by ${i.author || "unknown"}<br/>${date}
        </div>
      </div>`;
    })
    .join("");

  document
    .querySelectorAll(".card")
    .forEach((c) => c.addEventListener("click", () => openModal(c.dataset.id)));
}

let debounce;
searchInput.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    const q = searchInput.value.trim();
    if (!q) return render(allIssues);
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`,
    );
    const d = await res.json();
    render(d.data || []);
  }, 400);
});

fetchIssues();
