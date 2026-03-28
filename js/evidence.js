
function getToken() {
  return localStorage.getItem("token");
}

// ================= UPLOAD =================
async function uploadEvidence() {
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);

  await fetch(`${BASE_URL}/api/evidence/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  alert("Evidence Uploaded ✅");
  loadEvidence();
}

// ================= LOAD =================
async function loadEvidence() {
  const res = await fetch(`${BASE_URL}/api/evidence`, {
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

    let status = "Uploaded 🟡";
    let statusClass = "status-uploaded";

    if (ev.verified === true) {
      status = "Verified 🟢";
      statusClass = "status-verified";
    }

    if (ev.verified === false) {
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
      <button onclick="downloadCertificate('${ev._id}')">Certificate</button>
    `;

    container.appendChild(div);
  });

  createChart(count);
  setupSearch(); // 🔥 live search
}

// ================= SEARCH (INPUT FILTER) =================
function setupSearch() {
  const input = document.getElementById("searchEvidence");
  if (!input) return;

  input.addEventListener("keyup", function () {
    const filter = input.value.toLowerCase();
    const cards = document.querySelectorAll("#evidenceList .evidence-card");

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(filter) ? "block" : "none";
    });
  });
}

// ================= SEARCH BUTTON (SERVER BASED) =================
async function searchEvidence() {
  const id = document.getElementById("searchEvidence").value;

  if (!id) {
    alert("Enter Evidence ID");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/evidence/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      const container = document.getElementById("evidenceList");
      container.innerHTML = "";

      const div = document.createElement("div");
      div.className = "evidence-card";

      div.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
      `;

      container.appendChild(div);

    } else {
      alert("Evidence Not Found ❌");
    }

  } catch (err) {
    console.log(err);
    alert("Search Error ❌");
  }
}

// ================= VERIFY =================
async function verifyEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/verify/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

 alert(data.tampered ? "Evidence Tampered 🔴" : "Evidence Safe 🟢");
  loadEvidence();
}

// ================= DOWNLOAD =================
async function downloadEvidence(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/download/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
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
  a.click();
}
async function downloadCertificate(id) {
  const res = await fetch(`${BASE_URL}/api/evidence/certificate/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    alert("Certificate failed ❌");
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "certificate.pdf";
  a.click();
}

// ================= DELETE =================
async function deleteEvidence(id) {
  if (!confirm("Delete this evidence?")) return;

  await fetch(`${BASE_URL}/api/evidence/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  alert("Evidence Deleted 🗑️");
  loadEvidence();
}

// ================= PREVIEW =================
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

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
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
    div.className = "timeline-item";

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
  if (!ctx) return;

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