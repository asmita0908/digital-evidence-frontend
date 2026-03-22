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

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role); // ✅ direct store

    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Login Failed");
  }
}