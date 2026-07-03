async function login(){
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if(email==="" || password===""){
    alert("Plese enter all fields")
    return;
}

const data = {
    email,
    password
};

try{
    const response = await fetch("/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if(response.ok){
        localStorage.setItem("token",result.token);
        localStorage.setItem("name",result.name);
        localStorage.setItem("email",result.email)
        alert(result.message);
        window.location.href = "/dashboard";
    }
    else{
        alert(result.message);
    }
} catch(error){
    console.log(error);
    alert("Something went wrong try again")
}
}
