const BASE_URL = "https://digital-evidence-backend.onrender.com";

// ================= TOKEN =================
function getToken() {
  return localStorage.getItem("token");
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
    window.location.href = "dashboard.html";
  } else {
    alert("Upload Failed ❌");
  }
}

// ================= LOAD ALL =================
async function loadEvidence() {
  const res = await fetch(`${BASE_URL}/api/evidence/all`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();
  renderEvidence(data);
}

// ================= SEARCH BY CASE =================
async function searchByCase() {
  const caseId = document.getElementById("searchCase").value;

  if (!caseId) {
    alert("Enter Case ID ❌");
    return;
  }

  const res = await fetch(`${BASE_URL}/api/evidence/case/${caseId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();
  renderEvidence(data);
}

// ================= RENDER =================
function renderEvidence(data) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No Evidence Found ❌</p>";
    return;
  }

  data.forEach(ev => {
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.description}</p>
      <p><b>Case ID:</b> ${ev.case?._id || ev.case}</p>

      <button onclick="verifyEvidence('${ev._id}')">Verify</button>
      <button onclick="downloadEvidence('${ev._id}')">Download</button>
      <button onclick="downloadCertificate('${ev._id}')">Certificate</button>
    `;

    container.appendChild(div);
  });
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

  if (!res.ok) {
    alert("File missing ❌");
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

// ================= AUTO LOAD =================
window.onload = loadEvidence;