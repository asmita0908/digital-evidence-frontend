const BASE_URL="https://digital-evidence-backend.onrender.com";

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

if(data.accessToken){

localStorage.setItem("token",data.accessToken);

window.location.href="dashboard.html";

}else{

alert("Login Failed");

}

}