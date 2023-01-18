const refresh_url = 'https://web-production-db1d.up.railway.app/auth/jwt/refresh/';
const profile_url = 'https://web-production-db1d.up.railway.app/userprofile/profiles/me/';
const account_url = 'https://web-production-db1d.up.railway.app/auth/users/me/';
const set_password_url = 'https://web-production-db1d.up.railway.app/auth/users/set_password/';

// for account
var a_email, a_first_name, a_last_name, a_middle_initial;
var change_pass_success = true, delete_account = true, uploaded_profile = true;
// for profile
var p_birth_date, p_sex, p_city, p_state, p_zip_code, p_country;


// ---------------- FOR CHECKING IF AN UPDATE WAS PERFORMED EARLIER ----------------
window.onload = function(){
    // set all input fields to disabled first
    const formElements = document.querySelectorAll('[profile-input]');
    formElements.forEach(element => element.setAttribute('disabled', true));

    if(localStorage.getItem('a_updtd')){
        // prompt user that update was successful for a few seconds
        document.getElementById('account-div').setAttribute('class', 'alert alert-success d-flex flex-row justify-content-start align-items-start mt-1 d-block');
        document.getElementById('account-error').textContent = 'Updated successfully!';
        setTimeout(() => {
            localStorage.removeItem('a_updtd');
            document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex flex-row justify-content-start align-items-start mt-1 d-none');
            document.getElementById('account-error').textContent = 'First and last names fields are required!';
        }, 2000);
    }
    else if(localStorage.getItem('p_updtd')){
        // change active tab
        document.getElementById('v-pills-account-tab').setAttribute('class', 'nav-link mb-md-2');
        document.getElementById('v-pills-account').setAttribute('class', 'tab-pane fade user-tab-content');
        document.getElementById('v-pills-general-tab').setAttribute('class', 'nav-link mb-md-2 active');
        document.getElementById('v-pills-general').setAttribute('class', 'tab-pane fade user-tab-content show active');

        // prompt user that update was successful for a few seconds
        document.getElementById('profile-div').setAttribute('class', 'alert alert-success d-flex align-items-center mt-1 d-block');
        document.getElementById('profile-error').textContent = 'Updated successfully!';
        setTimeout(() => {
            localStorage.removeItem('p_updtd');
            document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
            document.getElementById('profile-error').textContent = 'All fields are required!';
        }, 2500);
    }
    else if(localStorage.getItem('changed_pass')){
        // change active tab
        document.getElementById('v-pills-account-tab').setAttribute('class', 'nav-link mb-md-2');
        document.getElementById('v-pills-account').setAttribute('class', 'tab-pane fade user-tab-content');
        document.getElementById('v-pills-security-tab').setAttribute('class', 'nav-link mb-md-2 active');
        document.getElementById('v-pills-security').setAttribute('class', 'tab-pane fade user-tab-content show active');

        // prompt user that update was successful for a few seconds
        document.getElementById('change-pass-div').setAttribute('class', 'alert alert-success d-flex align-items-center mt-1 d-block');
        document.getElementById('change-pass-error').textContent = 'Updated successfully!';
        setTimeout(() => {
            localStorage.removeItem('changed_pass');
            document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
            document.getElementById('change-pass-error').textContent = 'All fields are required!';
        }, 2500);
    }
}
// ---------------------------------------------------------------------------------


// ---------------- FOR GETTING ANOTHER ACCESS KEY WHEN EXPIRED --------------------
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
// ---------------------------------------------------------------------------------


// -------------------------------- FOR VALIDATION ---------------------------------
function validateNoEmpty(inputs_array, is_input_element=false) {
    if(!is_input_element){
        return inputs_array.every(input => input.trim() !== '');
    }else{
        const values = [];
        inputs_array.forEach(input => {
            values.push(input.value);
        });
        return values.every(input => input.trim() !== '');
    }
}
// ---------------------------------------------------------------------------------


// ---------------------- FOR FETCHING ACCOUNT DETIALS ON LOAD ---------------------
async function fetchAccount(access, account_url){
    try{
        const response = await fetch(account_url, {
            headers: {
                Authorization: `JWT ${access}`,
            },
        })

        if(!response.ok){
            fetchAccess()
            .then(data => {
                localStorage.setItem('access', data.access);
                window.location.href = '/the-pillar-frontend/html/userProfile.html';
            })
            .catch(error => console.log(error))
        }
        
        return await response.json();
    }
    catch(error){
        console.log(error);
    }
}

function getAccountDetails(){
    let access = localStorage.getItem('access');
    
    if(access){
        fetchAccount(access, account_url)
        .then(data => {
            displayAccount(data);
        })
    }
}

function displayAccount(account_data){
    let avatar = document.getElementById('user-avatar');
    let username = document.getElementById('userName');
    let last_name = document.getElementById('Last-name');
    let first_name = document.getElementById('First-name');
    let middle_initial = document.getElementById('Middle-initial');
    let display_name = document.getElementById('accountName');
    
    if(account_data){
        display_name.textContent = `${account_data.first_name} ${account_data.last_name}`;
        username.textContent = `@${account_data.username}`;
        last_name.value = account_data.last_name;
        first_name.value = account_data.first_name;
        middle_initial.value = account_data.middle_initial;

        // set email to a global varaible for standby updates
        globalThis.a_email = account_data.email;

        // displaying user avatar
        if(!account_data.avatar){
            if(account_data.sex == 'N'){
                avatar.setAttribute('src', '/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg');
            }
            if(account_data.sex == 'M'){
                avatar.setAttribute('src', '/the-pillar-frontend/default_profile_imgs/default_male.jpg');
            }
            if(account_data.sex == 'F'){
                avatar.setAttribute('src', '/the-pillar-frontend/default_profile_imgs/default_female.jpg');
            }
        }
        else{
            avatar.setAttribute('src', account_data.avatar);
        }
    }
}
// ---------------------------------------------------------------------------------


// ---------------------- FOR FETCHING PROFILE DETIALS ON LOAD ---------------------
async function fetchProfile(access, url){
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
                window.location.href = '/the-pillar-frontend/html/userProfile.html';
            })
            .catch(error => console.log(error))
        }

        return await response.json();
    }
    catch(error){
        console.log(error);
    }
}

function getProfileDetails(){
    let access = localStorage.getItem('access');

    if(access){
        fetchProfile(access, profile_url)
        .then(data => {
            displayProfileDetails(data);
        })
    }
}

function displayProfileDetails(profile_data){
    let birthdate = document.getElementById('Birthdate');
    let sex = document.getElementById('select-sex');
    let city = document.getElementById('City-municipality');
    let state = document.getElementById('State-province');
    let zip_code = document.getElementById('Z/P-code');
    let country = document.getElementById('country');

    if(profile_data){
        // set values of the input to their current values from the DB
        birthdate.value = profile_data.birth_date;
        sex.value = profile_data.sex;
        city.value = profile_data.city;
        state.value = profile_data.state_or_province;
        zip_code.value = profile_data.zip_code;
        country.value = profile_data.country;

        // set values of global variables for profile
        globalThis.p_birth_date = profile_data.birth_date;
        globalThis.p_sex = profile_data.sex;
        globalThis.p_city = profile_data.city;
        globalThis.p_state = profile_data.state_or_province;
        globalThis.p_zip_code = profile_data.zip_code;
        globalThis.p_country = profile_data.country;
    }
}
// ---------------------------------------------------------------------------------


// -------------------------- FOR UPDATING USER ACCOUNT ----------------------------
function editAccount(){
    // get button elements
    let edit_btn = document.getElementById('edit-btn');
    let save_btn = document.getElementById('save-btn');
    let cancel_btn = document.getElementById('cancel-btn');
    
    // get input elements
    let last_name = document.getElementById('Last-name');
    let first_name = document.getElementById('First-name');
    let middle_initial = document.getElementById('Middle-initial');
    
    // alter displays of btn elements
    edit_btn.setAttribute('class', 'bi bi-pencil-square ms-2 edit-btn d-none');
    save_btn.setAttribute('class', 'bi bi-save d-inline ms-2 save-btn d-inline');
    cancel_btn.setAttribute('class', 'bi bi-x-square save-btn ms-1 d-inline');
    
    // set input to enabled
    last_name.disabled = false;
    first_name.disabled = false;
    middle_initial.disabled = false;

    // save current values to global vars
    globalThis.a_last_name = last_name.value;
    globalThis.a_first_name = first_name.value;
    globalThis.a_middle_initial = middle_initial.value;
}

function saveAccountChanges(){
    // document.getElementById('save-btn').disabled = true;

    // get input values
    let last_name = document.getElementById('Last-name').value;
    let first_name = document.getElementById('First-name').value;
    let middle_initial = document.getElementById('Middle-initial').value;
    
    // middle_initial value will not be included in the validation since it's not required
    let inputs_array = [last_name, first_name]
    
    if(validateNoEmpty(inputs_array)){
        // set error display to none if currently displayed
        document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex flex-row justify-content-start align-items-start mt-1 d-none');
        
        // perform update
        let account_input = {
            'email' : globalThis.a_email,
            'last_name': last_name,
            'first_name': first_name,
            'middle_initial': middle_initial,
        }
        
        let access = localStorage.getItem('access');
        
        if(access){
            fetchAccountUpdate(access, account_input)
            .then(data => {
                if(!data){
                    console.log('fetching new access key...');
                }else{
                    localStorage.setItem('a_updtd', true);
                    window.location.href = '/the-pillar-frontend/html/userProfile.html';
                }
            })
            .catch(error => console.log(error));
        }
        
    }else{
        // display error
        document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex flex-row justify-content-start align-items-start mt-1 d-block');
        // document.getElementById('save-btn').disabled = false;
    }
    
}

function cancelUpdate(){
    // get button elements
    let edit_btn = document.getElementById('edit-btn');
    let save_btn = document.getElementById('save-btn');
    let cancel_btn = document.getElementById('cancel-btn');

    // get input elements
    let last_name = document.getElementById('Last-name');
    let first_name = document.getElementById('First-name');
    let middle_initial = document.getElementById('Middle-initial');

    // alter displays of btn elements
    edit_btn.setAttribute('class', 'bi bi-pencil-square ms-2 edit-btn d-inline');
    save_btn.setAttribute('class', 'bi bi-save d-inline ms-2 save-btn d-none');
    cancel_btn.setAttribute('class', 'bi bi-x-square save-btn ms-1 d-none');

    // disable inputs
    last_name.disabled = true;
    first_name.disabled = true;
    middle_initial.disabled = true;

    // revert input values
    last_name.value = globalThis.a_last_name;
    first_name.value = globalThis.a_first_name;
    middle_initial.value = globalThis.a_middle_initial;
}

async function fetchAccountUpdate(access, account_input){
    try{
        const response = await fetch(account_url, {
            method: 'PUT',
            headers: {
                Authorization: `JWT ${access}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account_input)
        })

        if(response.status === 401){
            fetchAccess()
            .then(data => {
                localStorage.setItem('access', data.access);
                // after getting new access key redo updating user account
                saveAccountChanges();
            })
            .catch(error => console.log(error))
        }else{
            return await response.json();
        }

    }catch(error){
        console.log(error);
    }
}
// ---------------------------------------------------------------------------------


// -------------------------- FOR UPDATING USER PROFILE ----------------------------
function editProfile(){
    // get button element
    const edit_btn = document.getElementById('edit-button');
    
    // get input elements
    const birth_date = document.getElementById('Birthdate');
    const sex = document.getElementById('select-sex');
    const city =  document.getElementById('City-municipality');
    const state = document.getElementById('State-province');
    const zip_code = document.getElementById('Z/P-code');
    const country = document.getElementById('country');
    
    if(edit_btn.textContent === 'Edit'){
        // set input to enabled
        birth_date.disabled = false;
        sex.disabled = false;
        city.disabled = false;
        state.disabled = false;
        zip_code.disabled = false;
        country.disabled = false;
        
        // change button text
        edit_btn.textContent = 'Save';
    }
    else if(edit_btn.textContent === 'Save'){
        // disable save button first
        document.getElementById('edit-button').disabled = true;

        // make array of input elements
        const inputs_array = [birth_date, sex, city, state, zip_code, country];
        
        // validate if none of the input elements are empty
        if(validateNoEmpty(inputs_array, is_input_element=true)){
            // set error display to none if currently displayed
            document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');

            // validate if there are changes from the previous data
            if(globalThis.p_birth_date !== birth_date.value ||
                globalThis.p_sex !== sex.value ||
                globalThis.p_city !== city.value ||
                globalThis.p_state !== state.value ||
                globalThis.p_zip_code !== parseInt(zip_code.value)){
                
                // set error display to none if currently displayed
                document.getElementById('profile-div').setAttribute('class', 'alert alert-warning d-flex align-items-center mt-1 d-none');
                
                // perform update
                let profile_input = {
                    'birth_date': birth_date.value,
                    'sex': sex.value,
                    'city': city.value,
                    'state_or_province': state.value,
                    'zip_code': parseInt(zip_code.value),
                    'country': country.value
                }
                
                let access = localStorage.getItem('access');
                
                if(access){
                    fetchProfileUpdate(access, profile_input)
                    .then(data => {
                        if(!data){
                            console.log('fetching new access key...');
                        }else{
                            localStorage.setItem('p_updtd', true);
                            window.location.href = '/the-pillar-frontend/html/userProfile.html';
                        }
                    })
                    .catch(error => console.log(error));
                }
            }else{
                // prompt user that no changes were detected
                document.getElementById('profile-div').setAttribute('class', 'alert alert-warning d-flex align-items-center mt-1 d-block');
                document.getElementById('profile-error').textContent = 'No changes detected!';
                document.getElementById('edit-button').disabled = false;
            }
        }else{
            document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
            document.getElementById('profile-error').textContent = 'All fields are required!';
            document.getElementById('edit-button').disabled = false;
        }
    }
}

async function fetchProfileUpdate(access, profile_input){
    try{
        const response = await fetch(profile_url, {
            method: 'PUT',
            headers: {
                Authorization: `JWT ${access}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile_input)
        })
        
        if(response.status === 401){
            fetchAccess()
            .then(data => {
                localStorage.setItem('access', data.access);
                // after getting new access key redo updating user account
                editProfile();
            })
            .catch(error => console.log(error))
        }else{
            return await response.json();
        }
        
    }catch(error){
        console.log(error);
    }
}
// ---------------------------------------------------------------------------------


// --------------------------- FOR CHANGING PASSWORD -------------------------------
function changePassword(){
    document.getElementById('update-pass').setAttribute('class', 'mt-3 border rounded p-2 bg-light d-block');
    document.getElementById('change-pass-btn').disabled = true;
}

function save(){
    // disable save changes button first
    document.getElementById('save-changes-btn').disabled = true;

    // get input values
    let curr_pass = document.getElementById('Current-Password').value;
    let new_pass = document.getElementById('New-Password').value;
    let confirm_pass = document.getElementById('Confirm-password').value;

    // check first if none are empty
    if(validateNoEmpty([curr_pass, new_pass, confirm_pass])){
        // hide error display if currently displayed
        document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');

        // fetch inputs
        let change_pass_inputs = {
            "current_password": curr_pass,
            "new_password": new_pass,
            "re_new_password": confirm_pass,
        }

        fetchChangePassword(change_pass_inputs)
        .then(data => {
            if(globalThis.changed_pass === false){
                globalThis.changed_pass = true;
                // display errors to user
                if(data.current_password){
                    document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
                    document.getElementById('change-pass-error').textContent = data.current_password.join(' ');
                    document.getElementById('save-changes-btn').disabled = false;
                }
                if(data.new_password){
                    document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
                    document.getElementById('change-pass-error').textContent = data.new_password.join(' ');
                    document.getElementById('save-changes-btn').disabled = false;
                }
                if(data.non_field_errors){
                    document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
                    document.getElementById('change-pass-error').textContent = data.non_field_errors.join(' ');
                    document.getElementById('save-changes-btn').disabled = false;
                }
            }else{
                localStorage.setItem('changed_pass', true);
                window.location.href = '/the-pillar-frontend/html/userProfile.html';
            }
        })
        .catch(error => console.log('fetching new access key...'));
    }
    else{
        document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
        document.getElementById('change-pass-error').textContent = 'All fields are required!';
        document.getElementById('save-changes-btn').disabled = false;
    }
}

async function fetchChangePassword(change_pass_inputs){
    try{
        let access = localStorage.getItem('access')
        if(access){
            const response = await fetch(set_password_url, {
                method: 'POST',
                headers: {
                    Authorization: `JWT ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(change_pass_inputs)
            });
            
            if(response.status === 401){
                globalThis.changed_pass = false;
                // if access is expired get another one and repeat the process
                fetchAccess()
                .then(data => {
                    localStorage.setItem('access', data.access);
                    save();
                })
                .catch(error => console.log(error))
            }
            else if(response.status === 400){
                globalThis.changed_pass = false;
                return await response.json();
            }
            else{
                return await response.json();
            }
        }
    }catch(error){
        console.log(error);
    }
}

function cancel(activity){
    if(activity === 'change-pass'){
        // hide errors if any are displayed and set error message to default
        document.getElementById('change-pass-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
        document.getElementById('change-pass-error').textContent = 'All fields are required!';

        // enable change pass button and hide change password form
        document.getElementById('change-pass-btn').disabled = false;
        document.getElementById('update-pass').setAttribute('class', 'mt-3 border rounded p-2 bg-light d-none');

        // set all input values to none
        document.getElementById('Confirm-password').value = '';
        document.getElementById('New-Password').value = '';
        document.getElementById('Current-Password').value = '';
    }
}
// ---------------------------------------------------------------------------------


// --------------------------- FOR DELETING ACCOUNT --------------------------------
const inputField = document.querySelector('#Confirm-with-password');

inputField.addEventListener('input', (event) => {
    if(inputField.value.trim() !== ''){
        document.getElementById('submit-btn').disabled = false;
    }else{
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('delete-acc-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
        document.getElementById('delete-acc-error').textContent = '';
    }
});

function deleteAccount(){
    let password = {
        'current_password' : document.getElementById('Confirm-with-password').value,
    }
    
    // fetch password input
    fetchDeleteAccount(password)
    .then(data => {
        if(globalThis.delete_account === false){
            globalThis.delete_account = true;
            if(data.current_password){
                document.getElementById('delete-acc-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
                document.getElementById('delete-acc-error').textContent = data.current_password.join(' ');
            }
        }
        else{
            document.getElementById('delete-acc-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
            document.getElementById('delete-acc-error').textContent = 'Account Deleted!';
            setTimeout(() => {
                localStorage.clear();
                window.location.href = '/the-pillar-frontend/index.html';
            }, 2000);
        }
    })
    .catch(error => console.log('fetching new access key...'));
}

async function fetchDeleteAccount(password){
    try{
        let access = localStorage.getItem('access');
        if(access){
            const response = await fetch(account_url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${access}`,
                },
                body: JSON.stringify(password)
            });
            
            if(response.status === 401){
                globalThis.delete_account = false;
                // if access is expired get another one and repeat the process
                fetchAccess()
                .then(data => {
                    localStorage.setItem('access', data.access);
                    deleteAccount();
                })
                .catch(error => console.log(error));
            }
            else if(response.status === 400){
                globalThis.delete_account = false;
                return await response.json();
            }
            else{
                globalThis.delete_account = true;
                return await response.json();
            }
        }
    }catch(error){
        console.log(error);
    }
}

function deleteAccountButton(){
    // display delete account form
    document.getElementById('delete-acc').setAttribute('class', 'mt-3 border rounded p-2 bg-light d-block');
    // disable delete account button
    document.getElementById('delete-acc-btn').disabled = true;
}

function submitDeleteButton(){
    document.getElementById('delete-acc-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
    document.getElementById('delete-acc-error').textContent = '';
}

function cancelDelete(){
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('delete-acc-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
    document.getElementById('delete-acc-error').textContent = '';
    document.getElementById('Confirm-with-password').value = '';
    document.getElementById('delete-acc').setAttribute('class', 'mt-3 border rounded p-2 bg-light d-none');
    document.getElementById('delete-acc-btn').disabled = false;
}
// ---------------------------------------------------------------------------------


// ----------------------- FOR UPLOADING ACCOUNT AVATAR ----------------------------
const upload_input = document.getElementById('profilePictureUploadInput');

upload_input.addEventListener('input', (event) => {
    if(upload_input.value.trim() !== ''){
        document.getElementById('upload-btn').disabled = false;
    }else{
        document.getElementById('upload-btn').disabled = true;
    }
});

function uploadProfilePicture(){
    // disable upload button first
    document.getElementById('upload-btn').disabled = true;

    let picture_input = document.getElementById('profilePictureUploadInput');
    
    let picture = picture_input.files[0];

    let form_data = new FormData()

    form_data.append('avatar', picture);

    fetchProfilePicture(form_data)
    .then(data => {
        if(globalThis.uploaded_profile === false){
            globalThis.uploaded_profile = true;
            if(data.avatar){
                document.getElementById('upload-div').setAttribute('class', 'alert alert-danger d-flex flex-row justify-content-start align-items-start mt-1 d-block')
                document.getElementById('upload-error').textContent = data.avatar.join(' ');
                document.getElementById('upload-btn').disabled = false;
            }
        }else{
            document.getElementById('upload-div').setAttribute('class', 'alert alert-success d-flex flex-row justify-content-start align-items-start mt-1 d-block')
            document.getElementById('upload-error').textContent = 'Updated successfully!';
            setTimeout(() => {
                window.location.href = '/the-pillar-frontend/html/userProfile.html';
            }, 1500);
        }
    })
    .catch(error => console.log(error));
}

async function fetchProfilePicture(form_data){
    try{
        let access = localStorage.getItem('access');
        if(access){
            const response = await fetch(account_url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `JWT ${access}`,
                },
                body: form_data
            });
            
            if(response.status === 401){
                globalThis.uploaded_profile = false;
                // if access is expired get another one and repeat the process
                fetchAccess()
                .then(data => {
                    localStorage.setItem('access', data.access);
                    uploadProfilePicture();
                })
                .catch(error => console.log(error));
            }
            else if(response.status === 400){
                globalThis.uploaded_profile = false;
                return await response.json();
            }
            else{
                globalThis.uploaded_profile = true;
                return await response.json();
            }
        }
    }catch(error){
        console.log(error);
    }
}

function cancelUpload(){
    document.getElementById('upload-div').setAttribute('class', 'alert alert-danger d-flex flex-row justify-content-start align-items-start mt-1 d-none')
    document.getElementById('upload-error').textContent = '';
    document.getElementById('profilePictureUploadInput').value = '';
    document.getElementById('upload-btn').disabled = true;
}
// ---------------------------------------------------------------------------------


// -------------------------------- FOR LOGGING OUT --------------------------------
function logout(){
    // disable log-out button first
    document.getElementById('log-out').disabled = true
    localStorage.clear();
    localStorage.setItem('signed-up', true);
    window.location.href = '/the-pillar-frontend/index.html'
}
// ---------------------------------------------------------------------------------