async function loadTimeline(id){

const res = await fetch(`http://localhost:5000/api/custody/${id}`);

const data = await res.json();

const container = document.getElementById("timeline");

container.innerHTML="";

data.forEach(item=>{

container.innerHTML += `

<div>

<b>${item.action}</b>

<p>${item.createdAt}</p>

</div>

`;

});

}