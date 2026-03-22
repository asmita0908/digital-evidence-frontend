const token = localStorage.getItem("token");
const API = "https://digital-evidence-backend.onrender.com";

// 🔐 Protect page
if (!token) {
  alert("Please login first");
  window.location.href = "index.html";
}

// PAGE LOAD
window.onload = function () {
  const role = localStorage.getItem("role");

  document.getElementById("roleName").innerText = role || "Not Assigned";

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }

  loadEvidence();
  connectRealtime();
};



// ============================
// 📦 LOAD EVIDENCE
// ============================
async function loadEvidence() {
  try {
    const res = await fetch(`${API}/api/evidence/all`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      alert("Failed to load evidence");
      return;
    }

    const data = await res.json();
    renderEvidence(data);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}



// ============================
// 🎨 RENDER EVIDENCE
// ============================
function renderEvidence(list) {
  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No evidence found</p>";
    return;
  }

  list.forEach(e => {
    container.innerHTML += `
      <div class="card">
        <h3>${e.title}</h3>
        <p>${e.description}</p>

        <button onclick="previewEvidence('${e.fileUrl}')">Preview</button>
        <button onclick="downloadEvidence('${e._id}')">Download</button>
        <button onclick="verifyEvidence('${e._id}')">Verify</button>
        <button onclick="certificate('${e._id}')">Certificate</button>
        <button onclick="loadTimeline('${e._id}')">Timeline</button>
      </div>
    `;
  });
}



// ============================
// 🔍 SEARCH
// ============================
async function searchEvidence() {
  const keyword = document.getElementById("searchEvidence").value;

  const res = await fetch(`${API}/api/evidence/search?keyword=${keyword}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  renderEvidence(data);
}



// ============================
// 📥 DOWNLOAD
// ============================
function downloadEvidence(id) {
  window.open(`${API}/api/evidence/download/${id}`);
}



// ============================
// ✔ VERIFY
// ============================
async function verifyEvidence(id) {
  const res = await fetch(`${API}/api/evidence/verify/${id}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  alert(data.message);
}



// ============================
// 📄 CERTIFICATE
// ============================
function certificate(id) {
  window.open(`${API}/api/evidence/certificate/${id}`);
}



// ============================
// 👁 PREVIEW
// ============================
function previewEvidence(url) {
  const modal = document.getElementById("previewModal");

  document.getElementById("previewContent").innerHTML =
    `<img src="${url}" width="300">`;

  modal.style.display = "block";
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}



// ============================
// 📊 TIMELINE
// ============================
async function loadTimeline(id) {
  const res = await fetch(`${API}/api/custody/timeline/${id}`);

  const data = await res.json();

  let html = "";

  data.forEach(t => {
    html += `<p>${t.action} - ${new Date(t.createdAt).toLocaleString()}</p>`;
  });

  document.getElementById("timeline").innerHTML = html;
}



// ============================
// 📤 UPLOAD EVIDENCE (🔥 FIXED)
// ============================
async function uploadEvidence() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("file").files[0];

  if (!title || !description || !file) {
    alert("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);

  try {
    const res = await fetch(`${API}/api/evidence/upload`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("Evidence Uploaded Successfully ✅");

      // clear form
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("file").value = "";

      loadEvidence();
    } else {
      alert(data.message || "Upload Failed ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Server error during upload");
  }
}



// ============================
// 🔄 REALTIME SOCKET
// ============================
function connectRealtime() {
  const socket = io(API);

  socket.on("evidenceActivity", (data) => {
    alert("New Activity: " + data.message);
    loadEvidence();
  });
}