const BASE_URL = "https://digital-evidence-backend.onrender.com";

// ================= LOGIN =================
async function loginUser() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    // ✅ IMPORTANT CHECK
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "officer");

      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login Failed");
    }

  } catch (error) {
    console.log("Login Error:", error);
    alert("Server Error");
  }
}


// ================= REGISTER =================
async function registerUser() {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration Successful");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Registration Failed");
    }

  } catch (error) {
    console.log("Register Error:", error);
    alert("Server Error");
  }
}


// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}