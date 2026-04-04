const API = "https://digital-evidence-backend.onrender.com";
const token = localStorage.getItem("token");

// 🔐 protect
if (!token) {
  alert("Login first");
  location.href = "index.html";
}

// PAGE LOAD
window.onload = function () {
  const role = localStorage.getItem("role");
  document.getElementById("roleName").innerText = role;

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }

  loadEvidence();
};

// NAVIGATION
function goToCases() {
  location.href = "cases.html";
}

function goToProfile() {
  location.href = "profile.html";
}

// LOAD
async function loadEvidence() {
  const res = await fetch(`${API}/api/evidence/all`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  renderEvidence(data);
}

// RENDER
function renderEvidence(list) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  list.forEach(e => {
    container.innerHTML += `
      <div class="card">
        <h3>${e.title}</h3>
        <p>${e.description}</p>

        <button onclick="previewEvidence('${e.fileUrl}')">Preview</button>
        <button onclick="downloadEvidence('${e._id}')">Download</button>
        <button onclick="verifyEvidence('${e._id}')">Verify</button>
        <button onclick="downloadCertificate('${e._id}')">Certificate</button>
        <button onclick="loadTimeline('${e._id}')">Timeline</button>
      </div>
    `;
  });
}

// DOWNLOAD
async function downloadEvidence(id) {
  const res = await fetch(`${API}/api/evidence/download/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "file";
  a.click();
}

// CERTIFICATE
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

// VERIFY
async function verifyEvidence(id) {
  const res = await fetch(`${API}/api/evidence/verify/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  alert(data.message);
}

// SEARCH
async function searchEvidence() {
  const keyword = document.getElementById("searchEvidence").value;

  const res = await fetch(`${API}/api/evidence/search?keyword=${keyword}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  renderEvidence(data);
}

// PREVIEW
function previewEvidence(url) {
  document.getElementById("previewContent").innerHTML =
    `<img src="${url}" width="100%">`;

  document.getElementById("previewModal").style.display = "block";
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}

// TIMELINE
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

// UPLOAD
async function uploadEvidence() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("file").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);

  const res = await fetch(`${API}/api/evidence/upload`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData
  });

  alert("Uploaded ✅");
  loadEvidence();
}