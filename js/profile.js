// ==========================
// LOAD PROFILE
// ==========================
window.onload = function () {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  console.log("PROFILE DATA:", name, email, role);

  document.getElementById("userName").innerText = name || "N/A";
  document.getElementById("userEmail").innerText = email || "N/A";
  document.getElementById("userRole").innerText = role || "N/A";
};


// ==========================
// LOGOUT
// ==========================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}