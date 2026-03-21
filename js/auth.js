const BASE_URL = "https://digital-evidence-backend.onrender.com";

async function loginUser() {
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
  console.log(data);

  const token = data.token || data.accessToken; // 🔥 important

  if (res.ok && token) {
    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem("role", payload.role);

    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Login Failed");
  }
}