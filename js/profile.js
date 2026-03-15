const BASE_URL="https://digital-evidence-backend.onrender.com";

function getToken(){
return localStorage.getItem("token");
}

async function loadProfile(){

const res=await fetch(`${BASE_URL}/api/users/profile`,{

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const user=await res.json();

document.getElementById("userName").innerText=user.name;
document.getElementById("userEmail").innerText=user.email;
document.getElementById("userRole").innerText=user.role;

}

window.onload=loadProfile;