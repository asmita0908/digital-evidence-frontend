const BASE_URL = "https://digital-evidence-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

// ================= LOAD USERS =================
async function loadUsers() {
  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("userList");
  container.innerHTML = "";

  data.forEach(user => {
    container.innerHTML += `
      <div class="card">
        <p><b>${user.name}</b></p>
        <p>${user.email}</p>
        <p>Role: ${user.role}</p>

        <!-- UPDATE ROLE -->
        <select onchange="updateRole('${user._id}', this.value)">
        <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        <option value="officer" ${user.role === "officer" ? "selected" : ""}>Officer</option>
        <option value="viewer" ${user.role === "viewer" ? "selected" : ""}>Viewer</option>
        </select>

        <!-- DELETE -->
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </div>
    `;
  });
}

// ================= CREATE USER =================
async function createUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();
  alert(data.message);

  loadUsers();
}

// ================= UPDATE ROLE =================
async function updateRole(id, role) {
  await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ role })
  });

  alert("Role Updated ✅");
  loadUsers();
}

// ================= DELETE =================
async function deleteUser(id) {
  if (!confirm("Delete user?")) return;

  await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  alert("User Deleted ✅");
  loadUsers();
}

window.onload = loadUsers;