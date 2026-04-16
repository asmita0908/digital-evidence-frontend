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

  loadCasesDropdown();
  loadEvidence();
};

// ================= LOAD CASES =================
async function loadCasesDropdown() {
  try {
    const res = await fetch(`${API}/api/cases`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    const dropdown = document.getElementById("caseSelect");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select Case</option>`;

    // 🔥 FIX: safe check
    if (!Array.isArray(data)) {
      console.log("Invalid cases:", data);
      return;
    }

    data.forEach(c => {
      const option = document.createElement("option");
      option.value = c._id;
      option.textContent = c.title;
      dropdown.appendChild(option);
    });

  } catch (err) {
    console.log(err);
  }
}

// ================= NAVIGATION =================
function goToCases() {
  location.href = "cases.html";
}

function goToProfile() {
  location.href = "profile.html";
}

// ================= LOAD ALL =================
async function loadEvidence() {
  try {
    const res = await fetch(`${API}/api/evidence/all`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    // 🔥 FIX
    if (!Array.isArray(data)) {
      console.log("Error:", data);
      return;
    }

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
    const res = await fetch(`${API}/api/evidence/case/${caseId}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    // 🔥 FIX
    if (!Array.isArray(data)) {
      console.log("Error:", data);
      alert("Invalid Case ID ❌");
      return;
    }

    renderEvidence(data);

  } catch (err) {
    console.log(err);
  }
}

// ================= RENDER =================
function renderEvidence(list) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No Evidence Found ❌</p>";
    return;
  }

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
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      alert("Download failed ❌");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "evidence";
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (err) {
    console.log(err);
    alert("Download error ❌");
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

// ================= UPLOAD =================
async function uploadEvidence() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("file").files[0];
  const caseId = document.getElementById("caseSelect").value;

  if (!title || !description || !file || !caseId) {
    alert("All fields required ❌");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("caseId", caseId);
  formData.append("file", file);

  try {
    const res = await fetch(`${API}/api/evidence/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
        // ❌ IMPORTANT: Content-Type mat daalna
      },
      body: formData
    });

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (res.ok) {
      alert("✅ Upload successful");
    } else {
      alert(data.message || "❌ Upload failed");
    }

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    alert("❌ Error uploading");
  }
}

// ================= PREVIEW =================
function previewEvidence(url) {
  let content = "";

  if (url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg")) {
    content = `<img src="${url}" width="100%">`;
  } else if (url.includes(".pdf")) {
    content = `<iframe src="${url}" width="100%" height="500px"></iframe>`;
  } else {
    content = `<a href="${url}" target="_blank">Open File</a>`;
  }

  document.getElementById("previewContent").innerHTML = content;
  document.getElementById("previewModal").style.display = "block";
}

// ================= TIMELINE =================
async function loadTimeline(id) {
  const res = await fetch(`${API}/api/custody/timeline/${id}`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  let html = "";

  if (!Array.isArray(data)) {
    document.getElementById("timeline").innerHTML = "No timeline ❌";
    return;
  }

  data.forEach(t => {
    html += `<p>${t.action} - ${new Date(t.createdAt).toLocaleString()}</p>`;
  });

  document.getElementById("timeline").innerHTML = html;
}
function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}