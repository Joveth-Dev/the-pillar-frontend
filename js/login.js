const login_url = domain + '/auth/jwt/create/';
var success = false;

// FOR CHECKING IF USER HAS SIGNED UP TO SHOW LOGIN MODAL
try{
    let signed_up = localStorage.getItem('signed-up');
    if(signed_up){
        document.getElementById('modal-btn').click();
        localStorage.removeItem('signed-up');
    }
}
catch(error) {
    console.log(error)
}

// FOR FETCHING DATA TO LOGIN ENDPOINT
async function fetchData(data){
    try{
        const response = await fetch(login_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if(!response.ok){
            return await response.json();
        }else{
            success = true;
            return await response.json();
        }
    }catch (error) {
        console.log(error);
    }
}

// FOR GETTING USERNAME AND PASSWORD INPUTS
function getInputs(){
    let username = document.getElementById('Username');
    let password = document.getElementById('Password');
    let login_div = document.getElementById('login-div');
    let login_error = document.getElementById('login-error');
    
    if(validateInputs()){
        let data = {
            "username": `${username.value}`,
            "password": `${password.value}`,
        }
    
        fetchData(data).then(data => {
            if(success){
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
        
                localStorage.removeItem('signed-up');
                window.location.href = '/the-pillar-frontend/index.html';
            }else{
                login_div.setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
                login_error.textContent = data.detail;
            }
        })
        .catch(error => console.log(error))
    }
}

// FPR VALIDATING USERNAME AND PASSWORD INPUTS
function validateInputs(){
    let username = document.getElementById('Username').value;
    let password = document.getElementById('Password').value;
    let login_div = document.getElementById('login-div');
    let login_error = document.getElementById('login-error');

    if(username === '' || password === ''){
        login_div.setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
        login_error.textContent = 'Username and password are required';
    }else{
        return true;
    }
}
