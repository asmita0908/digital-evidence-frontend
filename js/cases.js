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

  try {
    const res = await fetch(`${BASE_URL}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, officer })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error creating case ❌");
      return;
    }

    alert("Case Created ✅");

    // clear inputs
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

    const container = document.getElementById("caseList");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No Cases Found ❌</p>";
      return;
    }

    data.forEach(c => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${c.title}</h3>
        <p><b>Officer:</b> ${c.officer}</p>
        <p><b>Case ID:</b> ${c._id}</p>
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