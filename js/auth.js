const BASE_URL="https://digital-evidence-backend.onrender.com";

function getToken(){
return localStorage.getItem("token");
}

function setToken(token){
localStorage.setItem("token",token);
}

function removeToken(){
localStorage.removeItem("token");
}

// LOGIN
async function loginUser(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

const res=await fetch(`${BASE_URL}/api/auth/login`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,password})

});

const data=await res.json();

if(data.token){

setToken(data.token);

localStorage.setItem("role",data.role);

window.location.href="dashboard.html";

}else{

alert("Login Failed");

}

}

// LOGOUT
function logout(){

removeToken();

localStorage.removeItem("role");

window.location.href="index.html";

}

// PAGE PROTECTION
const page=window.location.pathname.split("/").pop();

if(!getToken() && page!=="index.html" && page!=="otp.html"){
window.location.href="index.html";
}