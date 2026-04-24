window.BASE_URL = "https://digital-evidence-backend.onrender.com";

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

    // 🔥 FIXED CONDITION
    if (data.token) {

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);

      alert("Login Success ✅");

      // redirect
      window.location.href = "dashboard.html";

    } else {
      alert(data.message || "Login Failed ❌");
    }

  } catch (error) {
    console.log("Login Error:", error);
    alert("Server Error ❌");
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
      alert("Registration Successful ✅");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Registration Failed ❌");
    }

  } catch (error) {
    console.log("Register Error:", error);
    alert("Server Error ❌");
  }
}


// ================= LOGOUT =================
function logout() {
  localStorage.clear(); // 🔥 better
  window.location.href = "index.html";
}
function showForgot(){
  const box = document.getElementById("forgotBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}


async function sendOTP() {
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message);
}


async function verifyOTP() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch(`${API}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();
  alert(data.message);
}

async function resetPassword() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch(`${API}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp, newPassword })
  });

  const data = await res.json();
  alert(data.message);
}

async function fingerprintLogin() {

  const email = document.getElementById("email").value;

  // 1. get options
  const res = await fetch(`/api/auth/webauthn/login-options?email=${email}`);
  const options = await res.json();

  // 2. ask browser for fingerprint
  const credential = await navigator.credentials.get({
    publicKey: options
  });

  // 3. send to server
  const verify = await fetch("/api/auth/webauthn/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      credential
    })
  });

  const data = await verify.json();

  if (data.success) {
    alert("Login successful ✅");
  } else {
    alert("Fingerprint failed ❌");
  }
}