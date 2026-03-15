const BASE_URL="http://localhost:5000";

function getToken(){
return localStorage.getItem("token");
}

async function loadLogs(){

const res=await fetch(`${BASE_URL}/api/logs`,{

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const data=await res.json();

const container=document.getElementById("logsList");

container.innerHTML="";

data.forEach(log=>{

const div=document.createElement("div");

div.className="card";

div.innerHTML=`

<p>${log.action}</p>
<p>${new Date(log.createdAt).toLocaleString()}</p>

`;

container.appendChild(div);

});

}

window.onload=loadLogs;