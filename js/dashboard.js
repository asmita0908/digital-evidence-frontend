const API = "https://digital-evidence-backend.onrender.com";
const token = localStorage.getItem("token");

// 🔐 protect
if (!token) {
  alert("Login first");
  location.href = "index.html";
}

// ================= INIT =================
window.onload = function () {
  const role = localStorage.getItem("role");

  document.getElementById("roleName").innerText = role || "No Role";

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }

  loadCasesDropdown(); // 🔥 NEW
  loadEvidence();
};

// ================= LOAD CASES =================
async function loadCasesDropdown() {
  const res = await fetch(`${API}/api/cases`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  const dropdown = document.getElementById("caseSelect");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Select Case</option>`;

  data.forEach(c => {
    const option = document.createElement("option");
    option.value = c._id;
    option.textContent = `${c.title}`;
    dropdown.appendChild(option);
  });
}

// NAVIGATION
function goToCases() {
  location.href = "cases.html";
}

function goToProfile() {
  location.href = "profile.html";
}

// ================= LOAD ALL =================
async function loadEvidence() {
  const res = await fetch(`${API}/api/evidence/all`, {
    headers: { Authorization: "Bearer " + token }
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

  const res = await fetch(`${API}/api/evidence/case/${caseId}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  renderEvidence(data);
}

// ================= RENDER =================
function renderEvidence(list) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  list.forEach(e => {
    container.innerHTML += `
      <div class="card">
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <p><b>Case:</b> ${e.case?.title || e.case}</p>

        <button onclick="previewEvidence('${e.fileUrl}')">Preview</button>
        <button onclick="downloadEvidence('${e._id}')">Download</button>
        <button onclick="verifyEvidence('${e._id}')">Verify</button>
        <button onclick="downloadCertificate('${e._id}')">Certificate</button>
        <button onclick="loadTimeline('${e._id}')">Timeline</button>
      </div>
    `;
  });
}

// ================= DOWNLOAD =================
async function downloadEvidence(id) {
  try {
    const res = await fetch(`${API}/api/evidence/download/${id}`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "File missing ❌ (old uploads deleted)");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "file";
    a.click();

  } catch (err) {
    alert("Download error");
  }
}

// ================= VERIFY =================
async function verifyEvidence(id) {
  const res = await fetch(`${API}/api/evidence/verify/${id}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  alert(data.message);

  loadEvidence();
}

// ================= CERTIFICATE =================
async function downloadCertificate(id) {
  const res = await fetch(`${API}/api/evidence/certificate/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "certificate.pdf";
  a.click();
}

// ================= UPLOAD (FIXED) =================
async function uploadEvidence() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("file").files[0];
  const caseId = document.getElementById("caseSelect").value; // 🔥 NEW

  if (!title || !description || !file || !caseId) {
    alert("All fields required ❌");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);
  formData.append("caseId", caseId); // 🔥 IMPORTANT

  const res = await fetch(`${API}/api/evidence/upload`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData
  });

  if (res.ok) {
    alert("Uploaded ✅");
    loadEvidence();
  } else {
    alert("Upload failed ❌");
  }
}

// ================= PREVIEW =================
function previewEvidence(url) {
  document.getElementById("previewContent").innerHTML =
    `<img src="${url}" width="100%">`;

  document.getElementById("previewModal").style.display = "block";
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}

// ================= TIMELINE =================
async function loadTimeline(id) {
  const res = await fetch(`${API}/api/custody/timeline/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  let html = "";
  data.forEach(t => {
    html += `<p>${t.action} - ${new Date(t.createdAt).toLocaleString()}</p>`;
  });

  document.getElementById("timeline").innerHTML = html;
}