const token = localStorage.getItem("token");
const API = "https://digital-evidence-backend.onrender.com";

window.onload = function(){

const role = localStorage.getItem("role");

document.getElementById("roleName").innerText = role;

if(role==="admin"){
document.getElementById("adminPanel").style.display="block";
}

loadEvidence();
connectRealtime();

};


// LOAD EVIDENCE
async function loadEvidence(){

const res = await fetch(`${API}/api/evidence/all`,{

headers:{
Authorization:"Bearer "+token
}

});

const data = await res.json();

renderEvidence(data);

}


// RENDER EVIDENCE
function renderEvidence(list){

const container = document.getElementById("evidenceList");

container.innerHTML="";

list.forEach(e=>{

container.innerHTML+=`

<div class="card">

<h3>${e.title}</h3>
<p>${e.description}</p>

<button onclick="previewEvidence('${e.fileUrl}')">Preview</button>
<button onclick="downloadEvidence('${e._id}')">Download</button>
<button onclick="verifyEvidence('${e._id}')">Verify</button>
<button onclick="certificate('${e._id}')">Certificate</button>
<button onclick="loadTimeline('${e._id}')">Timeline</button>

</div>

`;

});

}


// SEARCH
async function searchEvidence(){

const keyword=document.getElementById("searchEvidence").value;

const res = await fetch(`${API}/api/evidence/search?keyword=${keyword}`,{

headers:{
Authorization:"Bearer "+token
}

});

const data = await res.json();

renderEvidence(data);

}


// DOWNLOAD
function downloadEvidence(id){

window.open(`${API}/api/evidence/download/${id}`);

}


// VERIFY
async function verifyEvidence(id){

const res = await fetch(`${API}/api/evidence/verify/${id}`,{

headers:{
Authorization:"Bearer "+token
}

});

const data = await res.json();

alert(data.message);

}


// CERTIFICATE
function certificate(id){

window.open(`${API}/api/evidence/certificate/${id}`);

}


// PREVIEW
function previewEvidence(url){

const modal=document.getElementById("previewModal");

document.getElementById("previewContent").innerHTML=
`<img src="${url}" width="300">`;

modal.style.display="block";

}

function closePreview(){
document.getElementById("previewModal").style.display="none";
}


// TIMELINE
async function loadTimeline(id){

const res = await fetch(`${API}/api/custody/timeline/${id}`);

const data = await res.json();

let html="";

data.forEach(t=>{
html+=`<p>${t.action} - ${new Date(t.createdAt).toLocaleString()}</p>`;
});

document.getElementById("timeline").innerHTML=html;

}


// REALTIME
function connectRealtime(){

const socket = io("https://digital-evidence-backend.onrender.com");

socket.on("evidenceActivity",(data)=>{

alert("New Activity: "+data.message);

loadEvidence();

});

}