const BASE_URL = "https://digital-evidence-backend.onrender.com";

// ================= TOKEN =================
function getToken() {
  return localStorage.getItem("token");
}

// ================= LOAD CASES DROPDOWN =================
async function loadCasesDropdown() {
  try {
    const res = await fetch(`${BASE_URL}/api/cases`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    console.log("Cases API:", data); // 🔥 DEBUG

    // ✅ FIX (important)
    const cases = Array.isArray(data) ? data : data.cases;

    const select = document.getElementById("caseId");

    if (!select) return;

    select.innerHTML = `<option value="">Select Case</option>`;

    if (!cases || cases.length === 0) return;

    cases.forEach(c => {
      select.innerHTML += `<option value="${c._id}">${c.title}</option>`;
    });

  } catch (err) {
    console.log("Case load error:", err);
  }
}

// ================= UPLOAD =================
async function uploadEvidence() {
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const caseId = document.getElementById("caseId").value;

  if (!file || !title || !description || !caseId) {
    alert("All fields required ❌");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("caseId", caseId);

  const res = await fetch(`${BASE_URL}/api/evidence/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  if (res.ok) {
    alert("Evidence Uploaded ✅");
    loadEvidence();
  } else {
    alert("Upload Failed ❌");
  }
}

// ================= LOAD ALL =================
async function loadEvidence() {
  try {
    const res = await fetch(`${BASE_URL}/api/evidence/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    console.log("Evidence API:", data); // 🔥 DEBUG

    renderEvidence(data);

  } catch (err) {
    console.log(err);
  }
}

// ================= SEARCH BY CASE =================
async function searchByCase() {
  const caseId = document.getElementById("searchCase").value;

  if (!caseId) {
    alert("Enter Case ID ❌");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/evidence/case/${caseId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    console.log("Search API:", data); // 🔥 DEBUG

    renderEvidence(data);

  } catch (err) {
    console.log(err);
  }
}

// ================= GROUPED RENDER 🔥 =================
function renderEvidence(data) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  // ✅ FIX (important)
  const evidences = Array.isArray(data) ? data : data.evidences;

  if (!evidences || evidences.length === 0) {
    container.innerHTML = "<p>No Evidence Found ❌</p>";
    return;
  }

  const grouped = {};

  evidences.forEach(ev => {
    const caseName = ev.case?.title || "No Case";

    if (!grouped[caseName]) {
      grouped[caseName] = [];
    }

    grouped[caseName].push(ev);
  });

  for (let caseName in grouped) {
    const caseDiv = document.createElement("div");
    caseDiv.className = "card";

    caseDiv.innerHTML = `<h2>📁 ${caseName}</h2>`;

    grouped[caseName].forEach(ev => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${ev.title}</h3>
        <p>${ev.description}</p>

        <button onclick="verifyEvidence('${ev._id}')">Verify</button>
        <button onclick="downloadEvidence('${ev._id}')">Download</button>
        <button onclick="downloadCertificate('${ev._id}')">Certificate</button>
        <button onclick="viewHistory('${ev._id}')">History</button>
      `;

      caseDiv.appendChild(div);
    });

    container.appendChild(caseDiv);
  }
}

// ================= VERIFY =================
async function verifyEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/verify/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();
  alert(data.message);
}

// ================= DOWNLOAD =================
async function downloadEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/download/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    alert(data.message);
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "evidence";
  a.click();
}

// ================= CERTIFICATE =================
async function downloadCertificate(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/certificate/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "certificate.pdf";
  a.click();
}

// ================= HISTORY =================
async function viewHistory(id) {
  const res = await fetch(`${BASE_URL}/api/logs/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  const logs = Array.isArray(data) ? data : data.logs;

  logs.forEach(log => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${log.action}</b><br>${new Date(log.createdAt).toLocaleString()}`;
    timeline.appendChild(div);
  });
}

// ================= AUTO LOAD =================
window.onload = () => {
  loadCasesDropdown();
  loadEvidence();
};