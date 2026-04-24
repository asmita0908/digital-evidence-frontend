window.BASE_URL = "https://digital-evidence-backend.onrender.com";

let timer;
let attempts = 0; // 🔥 max 3 attempts

// ================= LOGIN =================
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    alert("Login Success ✅");
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
}

// ================= SHOW FORGOT =================
function showForgot(){
  const box = document.getElementById("forgotBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

// ================= SEND OTP =================
async function sendOTP() {
  const email = document.getElementById("fEmail").value;

  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message);

  attempts = 0; // reset attempts
  startTimer();
}

// ================= TIMER =================
function startTimer() {
  let timeLeft = 300;

  clearInterval(timer);

  timer = setInterval(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    document.getElementById("timerText").innerText =
      `OTP expires in: ${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("timerText").innerText = "OTP expired ❌";
    }

    timeLeft--;
  }, 1000);
}

// ================= VERIFY OTP =================
async function verifyOTP() {

  if (attempts >= 3) {
    alert("❌ Too many attempts. Resend OTP");
    return;
  }

  const email = document.getElementById("fEmail").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();

  if (data.message.includes("Invalid")) {
    attempts++;
    alert(`❌ Wrong OTP (${attempts}/3)`);
  } else {
    alert("OTP Verified ✅");
    clearInterval(timer);
  }
}

// ================= RESET PASSWORD =================
async function resetPassword() {
  const email = document.getElementById("fEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, otp, newPassword })
  });

  const data = await res.json();
  alert(data.message);
}