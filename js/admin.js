const BASE_URL="https://digital-evidence-backend.onrender.com";

function getToken(){
return localStorage.getItem("token");
}

async function loadUsers(){

const res=await fetch(`${BASE_URL}/api/users`,{

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const data=await res.json();

const container=document.getElementById("userList");

container.innerHTML="";

data.forEach(user=>{

const div=document.createElement("div");

div.className="card";

div.innerHTML=`

<p><b>${user.name}</b></p>
<p>${user.email}</p>
<p>Role: ${user.role}</p>

`;

container.appendChild(div);

});

}

window.onload=loadUsers;