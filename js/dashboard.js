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

  setupUI(role); // 🔥 NEW

  loadCasesDropdown();
  loadEvidence();
};

// ================= ROLE UI =================
function setupUI(role) {
  const uploadSection = document.getElementById("uploadSection");
  const adminPanel = document.getElementById("adminPanel");

  if (uploadSection) uploadSection.style.display = "none";
  if (adminPanel) adminPanel.style.display = "none";

  if (role === "admin") {
    uploadSection.style.display = "block";
    adminPanel.style.display = "block";
  }

  if (role === "officer") {
    uploadSection.style.display = "block";
  }

  // viewer → nothing extra
  // forensic → only verify options (handled in buttons)
}

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

    if (!Array.isArray(data)) return;

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

    if (!Array.isArray(data)) return;

    renderEvidence(data);

  } catch (err) {
    console.log(err);
  }
}

// ================= SEARCH =================
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

    if (!Array.isArray(data)) {
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

  const role = localStorage.getItem("role");

  if (!list.length) {
    container.innerHTML = "<p>No Evidence Found ❌</p>";
    return;
  }

  list.forEach(e => {
    container.innerHTML += `
      <div class="card">
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <p><b>Case:</b> ${e.case?.title || "No Case"}</p>
        <p><b>Case ID:</b> ${e.case?._id || e.case}</p>

        <button onclick="previewEvidence('${e.fileUrl}')">Preview</button>

        ${
          role !== "viewer"
            ? `<button onclick="downloadEvidence('${e._id}')">Download</button>`
            : ""
        }

        ${
          role === "forensic" || role === "admin"
            ? `<button onclick="verifyEvidence('${e._id}')">Verify</button>`
            : ""
        }

        ${
          role === "forensic" || role === "admin"
            ? `<button onclick="downloadCertificate('${e._id}')">Certificate</button>`
            : ""
        }

        ${
          role === "admin"
            ? `<button onclick="deleteEvidence('${e._id}')">Delete</button>`
            : ""
        }

        <button onclick="loadTimeline('${e._id}')">Timeline</button>
      </div>
    `;
  });
}

// ================= DELETE =================
async function deleteEvidence(id) {
  if (!confirm("Delete this evidence?")) return;

  const res = await fetch(`${API}/api/evidence/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  alert(data.message);

  loadEvidence();
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
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Upload successful");
      loadEvidence();
    } else {
      alert(data.message || "❌ Upload failed");
    }

  } catch (err) {
    alert("❌ Error uploading");
  }
}

// ================= PREVIEW =================
async function previewEvidence(url) {
  if (!url) {
    alert("No file ❌");
    return;
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      alert("Unauthorized ❌");
      return;
    }

    const blob = await res.blob();
    const fileURL = URL.createObjectURL(blob);

    let content = "";

    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      content = `<img src="${fileURL}" style="width:100%;">`;
    }

    else if (url.match(/\.pdf$/i)) {
      content = `<iframe src="${fileURL}" style="width:100%; height:80vh;"></iframe>`;
    }

    else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      content = `
        <video controls style="width:100%;">
          <source src="${fileURL}">
        </video>
      `;
    }

    else {
      content = `<a href="${fileURL}" target="_blank">Open File</a>`;
    }

    document.getElementById("previewContent").innerHTML = content;
    document.getElementById("previewModal").style.display = "block";

  } catch (err) {
    console.log(err);
    alert("Preview failed ❌");
  }
}
// ================= TIMELINE =================
async function loadTimeline(id) {
  try {
    const res = await fetch(`${API}/api/custody/timeline/${id}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    let html = "";

    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById("timeline").innerHTML = "No timeline ❌";
      return;
    }

    data.forEach(t => {
      html += `<p>${t.action} - ${new Date(t.createdAt).toLocaleString()}</p>`;
    });

    document.getElementById("timeline").innerHTML = html;

  } catch (err) {
    console.log(err);
    document.getElementById("timeline").innerHTML = "Error loading timeline ❌";
  }
}


// ================= CLOSE ON OUTSIDE CLICK =================
window.onclick = function (e) {
  const modal = document.getElementById("previewModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}