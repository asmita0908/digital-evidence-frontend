const BASE_URL = window.BASE_URL || "https://digital-evidence-backend.onrender.com";

// ================= TOKEN =================
function getToken() {
  return localStorage.getItem("token");
}

// ================= CREATE CASE =================
async function createCase() {
  const title = document.getElementById("caseTitle").value;
  const officer = document.getElementById("caseOfficer").value;

  if (!title || !officer) {
    alert("All fields required ❌");
    return;
  }

  // 🔥 AUTO CASE NUMBER
  const caseNumber = "CASE-" + Date.now();

  try {
    const res = await fetch(`${BASE_URL}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, officer, caseNumber })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error creating case ❌");
      return;
    }

    alert("Case Created ✅");

    document.getElementById("caseTitle").value = "";
    document.getElementById("caseOfficer").value = "";

    loadCases();

  } catch (err) {
    console.log(err);
    alert("Server error ❌");
  }
}

// ================= LOAD CASES =================
async function loadCases() {
  try {
    const res = await fetch(`${BASE_URL}/api/cases`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    console.log("API Response:", data); // 🔥 DEBUG

    // 🔥 FIX: handle both formats
    const cases = Array.isArray(data) ? data : data.cases;

    const container = document.getElementById("caseList");
    container.innerHTML = "";

    if (!cases || cases.length === 0) {
      container.innerHTML = "<p>No Cases Found ❌</p>";
      return;
    }

    cases.forEach(c => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${c.title}</h3>
        <p><b>Officer:</b> ${c.officer}</p>
        <p><b>Case Number:</b> ${c.caseNumber}</p>
        <p><b>ID:</b> ${c._id}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.log(err);
    alert("Failed to load cases ❌");
  }
}

// ================= AUTO LOAD =================
window.onload = loadCases;