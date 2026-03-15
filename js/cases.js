const BASE_URL="http://localhost:5000";

function getToken(){
return localStorage.getItem("token");
}


async function createCase(){

const title=document.getElementById("caseTitle").value;
const officer=document.getElementById("caseOfficer").value;

await fetch(`${BASE_URL}/api/cases`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${getToken()}`
},

body:JSON.stringify({title,officer})

});

alert("Case Created");

loadCases();

}



async function loadCases(){

const res=await fetch(`${BASE_URL}/api/cases`,{

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const data=await res.json();

const container=document.getElementById("caseList");

container.innerHTML="";

data.forEach(c=>{

const div=document.createElement("div");

div.className="card";

div.innerHTML=`

<h3>${c.title}</h3>
<p>Officer: ${c.officer}</p>

`;

container.appendChild(div);

});

}

window.onload=loadCases;