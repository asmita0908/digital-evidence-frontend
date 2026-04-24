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

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);

      alert("Login Success ✅");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login Failed ❌");
    }

  } catch (error) {
    console.log(error);
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
    console.log(error);
    alert("Server Error ❌");
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= FORGOT UI =================
function showForgot(){
  const box = document.getElementById("forgotBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

// ================= SEND OTP =================
async function sendOTP() {
  const email = document.getElementById("fEmail").value;

  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message);
}

// ================= VERIFY OTP =================
async function verifyOTP() {
  const email = document.getElementById("fEmail").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();
  alert(data.message);
}

// ================= RESET PASSWORD =================
async function resetPassword() {
  const email = document.getElementById("fEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      otp,
      newPassword
    })
  });

  const data = await res.json();
  alert(data.message);
}

// ================= FINGERPRINT =================
async function fingerprintLogin() {

  const email = document.getElementById("email").value;

  const res = await fetch(`${BASE_URL}/api/auth/webauthn/login-options?email=${email}`);
  const options = await res.json();

  const credential = await navigator.credentials.get({
    publicKey: options
  });

  const verify = await fetch(`${BASE_URL}/api/auth/webauthn/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      ...credential
    })
  });

  const data = await verify.json();

  if (data.success) {
    alert("Login successful ✅");
  } else {
    alert("Fingerprint failed ❌");
  }
}