const BASE_URL = "https://digital-evidence-backend.onrender.com";

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role }) // 🔥 IMPORTANT
  });

  const data = await res.json();

  if (res.ok) {
    alert("Signup Successful ✅");
    window.location = "index.html"; // login page
  } else {
    alert(data.message);
  }
}