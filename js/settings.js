const BASE_URL="https://digital-evidence-backend.onrender.com";

function getToken(){
return localStorage.getItem("token");
}

async function enable2FA(){

const res=await fetch(`${BASE_URL}/api/auth/enable-2fa`,{

method:"POST",

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const data=await res.json();

alert(data.message);

}

async function disable2FA(){

const res=await fetch(`${BASE_URL}/api/auth/disable-2fa`,{

method:"POST",

headers:{
Authorization:`Bearer ${getToken()}`
}

});

const data=await res.json();

alert(data.message);

}