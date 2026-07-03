async function register(){
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const data = {
        name,
        email,
        password
    };
    if(name==="" || email==="" || password===""){
        alert("Please fill all fields")
        return;
    }
    try{
    const response = await fetch("/register",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(data)
    });
    
    const result = await response.json()

    if(response.ok){
        alert(result.message);
        window.location.href = "/login";
    }
    else{
        alert(result.message);
    }
    }
    catch(error){
        console.log(error);
        alert("Something went wrong. please try again");
    }
}