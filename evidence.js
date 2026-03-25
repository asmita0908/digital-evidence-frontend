function getToken() {
  return localStorage.getItem("token");
}

// ================= LOAD =================
async function loadEvidence() {
  const res = await fetch(`${BASE_URL}/api/evidence/all`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  let count = 0;

  data.forEach(ev => {
    count++;

    const div = document.createElement("div");
    div.className = "evidence-card";

    // ✅ FIXED STATUS
    let status = "Safe 🟢";
    let statusClass = "status-verified";

    if (ev.isTampered) {
      status = "Tampered 🔴";
      statusClass = "status-tampered";
    }

    div.innerHTML = `
      <h3>${ev.title}</h3>
      <span class="status ${statusClass}">${status}</span>
      <p>${ev.description}</p>

      <button onclick="verifyEvidence('${ev._id}')">Verify</button>
      <button onclick="downloadEvidence('${ev._id}')">Download</button>
      <button onclick="viewHistory('${ev._id}')">History</button>
      <button onclick="previewEvidence('${ev.fileUrl}')">Preview</button>
      <button onclick="deleteEvidence('${ev._id}')">Delete</button>
    `;

    container.appendChild(div);
  });

  createChart(count);
  setupSearch();
}

// ================= VERIFY =================
async function verifyEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/verify/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  if (data.tampered) {
    alert("Evidence Tampered 🔴");
  } else {
    alert("Evidence Safe 🟢");
  }

  loadEvidence();
}

// ================= DOWNLOAD (FIXED) =================
async function downloadEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/download/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "evidence";
  a.click();
}

// ================= PREVIEW (FIXED) =================
function previewEvidence(fileUrl) {
  const modal = document.getElementById("previewModal");
  const container = document.getElementById("previewContent");

  container.innerHTML = "";

  if (fileUrl.match(/\.(jpg|jpeg|png)$/)) {
    container.innerHTML = `<img src="${fileUrl}" width="100%">`;
  } else if (fileUrl.endsWith(".pdf")) {
    container.innerHTML = `<iframe src="${fileUrl}" width="100%" height="500px"></iframe>`;
  } else {
    container.innerHTML = `<p>No preview available</p>`;
  }

  modal.style.display = "block";
}

// ================= DELETE =================
async function deleteEvidence(id) {
  await fetch(`${BASE_URL}/api/evidence/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  alert("Deleted");
  loadEvidence();
}

// ================= SEARCH =================
async function searchEvidence() {
  const keyword = document.getElementById("searchEvidence").value;

  const res = await fetch(`${BASE_URL}/api/evidence/search?keyword=${keyword}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("evidenceList");
  container.innerHTML = "";

  data.forEach(ev => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.description}</p>
    `;

    container.appendChild(div);
  });
}

// ================= TIMELINE =================
async function viewHistory(id) {
  const res = await fetch(`${BASE_URL}/api/logs/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  data.forEach(log => {
    const div = document.createElement("div");

    div.innerHTML = `
      <b>${log.action}</b><br>
      ${new Date(log.createdAt).toLocaleString()}
    `;

    timeline.appendChild(div);
  });
}

// ================= CHART =================
function createChart(total) {
  const ctx = document.getElementById("evidenceChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Evidence"],
      datasets: [{
        label: "Stored Evidence",
        data: [total]
      }]
    }
  });
}