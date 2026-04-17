const BASE_URL = "https://digital-evidence-backend.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// 🔐 protect
if (!token) {
  location.href = "index.html";
}

// ================= INIT =================
window.onload = function () {

  // 🔥 ROLE CONTROL
  if (role !== "admin" && role !== "officer") {
    document.getElementById("createCaseSection").style.display = "none";
  }

  loadCases();
};

// ================= CREATE =================
async function createCase() {
  const title = document.getElementById("caseTitle").value;

  if (!title) {
    alert("Title required ❌");
    return;
  }

  const caseNumber = "CASE-" + Date.now();

  const res = await fetch(`${BASE_URL}/api/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, caseNumber })
  });

  const data = await res.json();
  alert("Case Created ✅");

  loadCases();
}

// ================= LOAD =================
async function loadCases() {
  const res = await fetch(`${BASE_URL}/api/cases`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const cases = Array.isArray(data) ? data : data.cases;

  const container = document.getElementById("caseList");
  container.innerHTML = "";

  cases.forEach(c => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <h3>${c.title}</h3>
    <p><b>Officer:</b> ${c.officer?.name || "N/A"}</p>
    <p><b>Case Number:</b> ${c.caseNumber}</p>
    <p><b>ID:</b> ${c._id}</p>
  `;

  container.appendChild(div);
});
}

// ================= DELETE =================
async function deleteCase(id) {
  if (!confirm("Delete case?")) return;

  await fetch(`${BASE_URL}/api/cases/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadCases();
}