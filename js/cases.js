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
  const officer = document.getElementById("caseOfficer").value;

  if (!title || !officer) {
    alert("All fields required ❌");
    return;
  }

  const caseNumber = "CASE-" + Date.now();

  const res = await fetch(`${BASE_URL}/api/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, officer, caseNumber })
  });

  const data = await res.json();
  alert(data.message);

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
    container.innerHTML += `
      <div class="card">
        <h3>${c.title}</h3>
        <p>Officer: ${c.officer}</p>
        <p>Case No: ${c.caseNumber}</p>

        ${
          role === "admin"
            ? `<button onclick="deleteCase('${c._id}')">Delete</button>`
            : ""
        }
      </div>
    `;
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