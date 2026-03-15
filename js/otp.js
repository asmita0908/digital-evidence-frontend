const BASE_URL="https://digital-evidence-backend.onrender.com";

async function verifyOTP(){

const code=document.getElementById("otpCode").value;

const res=await fetch(`${BASE_URL}/api/auth/verify-otp`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({code})

});

const data=await res.json();

if(data.success){

alert("OTP Verified");

window.location.href="dashboard.html";

}else{

alert("Invalid OTP");

}

}