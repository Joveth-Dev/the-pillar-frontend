const reset_password_url = 'http://127.0.0.1:8000/auth/users/reset_password/';

async function fetchEmail(email){
    try{
        const response = await fetch(reset_password_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email : email
            })

        })

        if(!response.ok){
            return await response.json();
        }
    }
    catch(error){
        console.log(error);
    }
}

function sendEmail(){
    let email_input = document.getElementById('Email-input').value;
    let continue_msg = document.getElementById('continue-message');
    let forgot_pass_div = document.getElementById('forgotPasswordContainer');

    document.getElementById('continue-btn').disabled = true;
    
    fetchEmail(email_input)
    .then(data => {
        if(!data){
            forgot_pass_div.innerHTML = `<div class="container-lg" id="forgotPasswordContainer">
                                            <div class="forgot-pass-main active" id="FindAccount">
                                                <div class="text-center" id="forgotPasswordHeader">
                                                    <i class="bi bi-envelope-check-fill icon-forgot-pass"></i>
                                                    <div class="">
                                                    <h3 class="fw-bold text-primary" id="forgotPassHeaderTitle">Find Your Account</h3>
                                                </div>
                                            </div>
                                            <p style="padding-top : 25%;">We have sent a password reset link to your email.</p>
                                        </div>`;
            localStorage.setItem('signed-up', true);
        }
        else{
            continue_msg.textContent = data.email;
            setTimeout(function() {
                window.location.href = 'http://127.0.0.1:5500/html/forgotPass.html';
              }, 2500);
        }
    })
}