const domain = 'https://web-production-db1d.up.railway.app';
const refresh_url = domain + '/auth/jwt/refresh/';
const user_url = domain + '/auth/users/me/';

var user_id;

function loadAccount(){
    try{
        let access = localStorage.getItem('access');
        
        if(access){
            fetchAccount(access, user_url)
            .then(data => {
                if(data){
                    // store user id in global var
                    localStorage.setItem('user_id', data.id)
                    displayProfileElements(data)
                }
            })
            .catch(error => console.log(error));
        }
    }catch(error){
        console.log(error);
    }
}

// FOR GETTING USER DATA
async function fetchAccount(access, url){
    try{
        const response = await fetch(url, {
            headers: {
                Authorization: `JWT ${access}`,
            },
        })

        if(!response.ok){
            fetchAccess()
            .then(data => {
                localStorage.setItem('access', data.access);
                loadAccount();
            })
            .catch(error => console.log(error))
        }else{
            return await response.json();
        }

    }catch(error){
        console.log(error);
    }
}

async function fetchAccess(){
    try{
        let refresh = localStorage.getItem('refresh');
        if(refresh){
            const response = await fetch(refresh_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'refresh': `${refresh}`
                })
            })
            if(!response.ok){
                throw new Error(`Failed to fetch access key : ${response.status}`)
            }
            
            return await response.json();
        }else{
            alert('Session expired, you need to log in again');
            localStorage.setItem('signed-up', true);
            window.location.href = '/the-pillar-frontend/index.html';
        }
    }catch(error){
        console.log(error);
    }
}

function displayProfileElements(user_data){
    let profile_div = document.getElementById('profile-btn-div');
    let first_name = user_data.first_name;
    let last_name = user_data.last_name;
    let profile_img;

    if(!user_data.avatar){
        if(user_data.sex == 'N'){
            profile_img = '/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg';
        }
        if(user_data.sex == 'M'){
            profile_img = '/the-pillar-frontend/default_profile_imgs/default_male.jpg';
        }
        if(user_data.sex == 'F'){
            profile_img = '/the-pillar-frontend/default_profile_imgs/default_female.jpg';
        }
    }else{
        profile_img = user_data.avatar;
    }

    profile_div.innerHTML = `<button type="button" class="btn p-0" onclick="loadProfile()">
                                <div class="user-profile-img">
                                    <img src="${profile_img}" alt="user profile">
                                </div>
                            </button>
                            <span class="text-center fw-bold text-light ps-1 ">${first_name} ${last_name}</span>`;
}

function loadProfile(){
    window.location.href = '/the-pillar-frontend/html/userProfile.html'
}
