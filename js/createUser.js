const users_url = 'web-production-db1d.up.railway.app/auth/users/';
const profiles_url = 'web-production-db1d.up.railway.app/userprofile/profiles/me/';
const login_url = 'web-production-db1d.up.railway.app/auth/jwt/create/';

// glabal vars to confirm processes
var account_created = false, logged_in = false, profile_created = false, account_updated = false;


// -------------------------- FOR VALIDATING 2ND SECTION ---------------------------
function validateFirstSectionInputFields(){
  let input_arr = [];

  input_arr.push(document.getElementById('Username').value);
  input_arr.push(document.getElementById('Email-address').value);
  input_arr.push(document.getElementById('Enter-Password').value);
  input_arr.push(document.getElementById('Confirm-password').value);

  if(validateNoEmpty(input_arr)){
    document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
    // validate password and confirm_pass
    const password = document.getElementById('Enter-Password').value;
    const confirm_pass = document.getElementById('Confirm-password').value;
    if(arePasswordsMatched(password, confirm_pass)){
      createAccount();
    }else{
      // show that passwords don't match
      document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
      document.getElementById('account-error').textContent = 'Passwords do not match!'
    }
  }else{
    // show that all fields are required
    document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
    document.getElementById('account-error').textContent = 'All fields are required!'
  }
}

function arePasswordsMatched(password, confirm_pass){
  return password === confirm_pass;
}

function displayAccountCreationError(error_json){
  // show account creation error
  if(error_json.email){
    document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
    document.getElementById('account-error').textContent = error_json.email.join(' ');
  }
  if(error_json.password){
    document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
    document.getElementById('account-error').textContent = error_json.password.join(' ');
  }
  if(error_json.username){
    document.getElementById('account-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
    document.getElementById('account-error').textContent = error_json.username.join(' ');
  }
}
// ---------------------------------------------------------------------------------

// ------------------------ FOR VALIDATING 2ND SECTION ---------------------------
function validateSecondSectionInputFields(){
  let input_arr = [];

  input_arr.push(document.getElementById('Last-name').value);
  input_arr.push(document.getElementById('First-name').value);
  input_arr.push(document.getElementById('Birthdate').value);
  input_arr.push(document.getElementById('select-sex').value);
  input_arr.push(document.getElementById('City-municipality').value);
  input_arr.push(document.getElementById('State-province').value);
  input_arr.push(document.getElementById('Z/P-code').value);
  input_arr.push(document.getElementById('country').value);

  if(validateNoEmpty(input_arr)){
    // validate birthdate
    const birthdate = new Date(document.getElementById('Birthdate').value);
    if(is13YearsOlder(birthdate)){
      // validate zip_code
      const zip_code = document.getElementById('Z/P-code').value;
      if(isValidZIPCode(zip_code)){
        // fetch profile update
        updateAccount()
      }else{
        // display that zip_code is invalid
        document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
        document.getElementById('profile-error').textContent = 'Invalid ZIP code!';
      }
    }else{
      // display that user must be 13 years older
      document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
      document.getElementById('profile-error').textContent = 'You must be 13 years old or above!';
    }
  }else{
    // display there's a required field that is empty
    document.getElementById('profile-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
    document.getElementById('profile-error').textContent = 'All fields are required except for MI!';
  }
}

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

function isValidZIPCode(zip_code){
  return zip_code.length === 4;
}

function is13YearsOlder(date) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const inputYear = date.getFullYear();
  return currentYear - inputYear >= 13;
}
// ---------------------------------------------------------------------------------


// ----------------------------- FOR ACCOUNT CREATION ------------------------------
function createAccount(){
  const account_data = getAccountInputs();

  fetchAccount(account_data)
  .then(data => {
    if(globalThis.account_created){
      // login to get access key
      const username = data.username;
      const password = account_data.password;

      let account_credentials = {
        'username': username,
        'password': password
      }

      loginAccount(account_credentials)
      .then(data => {
        if(globalThis.logged_in){
          localStorage.setItem('access', data.access)
          // display success message
          document.getElementById('account-div').setAttribute('class', 'alert alert-success d-flex align-items-center mt-1 d-block');
          document.getElementById('account-error').textContent = 'Account created successfully!';
          setTimeout(function() {
            next();
          }, 2000);
        }else{
          throw new Error(`Process failed : ${data}`);
        }
      })
      .catch(error => console.log(error));
    }else{
      displayAccountCreationError(data);
    }
  })
  .catch(error => console.log(error));
}

async function loginAccount(account_credentials){
  try{
    const response = await fetch(login_url, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(account_credentials)
    })

    if(!response.ok){
      return await response.json();
    }else{
      globalThis.logged_in = true;
      return await response.json();
    }
  }catch(error){
    console.log(error);
  }
}

function getAccountInputs(){
  let email = document.getElementById('Email-address').value;
  let username = document.getElementById('Username').value;
  let password = document.getElementById('Enter-Password').value;
  let last_name = document.getElementById('Last-name').value;
  let first_name = document.getElementById('First-name').value;
  let middle_initial = document.getElementById('Middle-initial').value;

  let account_data = {
    'username' : username,
    'password' : password,
    'email' : email,
    'first_name' : first_name,
    'last_name' : last_name,
    'middle_initial' : middle_initial
  }

  return account_data;
}

async function fetchAccount(account_data){
  try{
    const response = await fetch(users_url, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(account_data)
    })

    if(!response.ok){
      // console.log(`Failed to fetch account data : ${response.status}`)
      return await response.json();
    }else{
      globalThis.account_created = true;
      return await response.json();
    }
  }
  catch(error){
    console.log(error);
  }
}
// ---------------------------------------------------------------------------------


// ------------------------------ FOR PROFILE UPDATE -------------------------------
function updateProfile(){
  const profile_data = getProfileInputs();

  // fetch profile
  fetchProfile(profile_data)
  .then(data => {
    if(globalThis.profile_created){
      // display success message
      document.getElementById('profile-div').setAttribute('class', 'alert alert-success d-flex align-items-center mt-1 d-block');
      document.getElementById('profile-error').textContent = 'Profile created successfully!';
      setTimeout(function() {
        localStorage.removeItem('access');
        localStorage.setItem('signed-up', true);
        window.location.href = '/the-pillar-frontend/index.html';
      }, 2000);
    }else{
      console.log(data)
    }
  })
  .catch(error => console.log(error));
}

async function fetchProfile(profile_data){
  try{
    let access = localStorage.getItem('access');
    if(access){
      const response = await fetch(profiles_url, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `JWT ${access}`,
        },
        body: JSON.stringify(profile_data)
      })
  
      if(!response.ok){
        return await response.json();
      }else{
        globalThis.profile_created = true;
        return await response.json();
      }
    }
  }
  catch(error){
    console.log(error);
  }
}

function getProfileInputs(){
  let birthdate = document.getElementById('Birthdate').value;
  let sex = document.getElementById('select-sex').value;
  let city = document.getElementById('City-municipality').value;
  let state = document.getElementById('State-province').value;
  let zip_code = parseInt(document.getElementById('Z/P-code').value);
  let country = document.getElementById('country').value;

  let profile_data = {
    "birth_date": birthdate,
    "sex": sex,
    "city": city,
    "state_or_province": state,
    "zip_code": zip_code,
    "country": country
  }

  return profile_data;
}
// ---------------------------------------------------------------------------------


// ------------------------------ FOR ACCOUNT UPDATE -------------------------------
function updateAccount(){
  const account_data = getAccountUpdateInputs();

  // fetch profile
  fetchAccountUpdate(account_data)
  .then(data => {
    if(globalThis.account_updated){
      updateProfile()
    }else{
      console.log(data)
    }
  })
  .catch(error => console.log(error));
}

async function fetchAccountUpdate(account_data){
  try{
    let access = localStorage.getItem('access');
    if(access){
      const response = await fetch(users_url+'me/', {
        method: 'PATCH',
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `JWT ${access}`,
        },
        body: JSON.stringify(account_data)
      })
  
      if(!response.ok){
        return await response.json();
      }else{
        globalThis.account_updated = true;
        return await response.json();
      }
    }
  }
  catch(error){
    console.log(error);
  }
}

function getAccountUpdateInputs(){
  let last_name = document.getElementById('Last-name').value;
  let first_name = document.getElementById('First-name').value;
  let middle_initial = document.getElementById('Middle-initial').value;

  let account_data = {
    "last_name": last_name,
    "first_name": first_name,
    "middle_initial": middle_initial,
  }

  return account_data;
}
// ---------------------------------------------------------------------------------


// --------------------------------- FOR NAVIGATING --------------------------------
function next(){
  let slides = document.querySelectorAll('.create-account-content');
  let index = 0;
  
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}

// FOR GOING BACK TO THE PREVIOUS PART OF THE SIGN UP FORM
// function prev(){
//   let slides = document.querySelectorAll('.create-account-content');
//   let index = 1;
  
//   slides[index].classList.remove('active');
//   index = (index - 1 + slides.length) % slides.length;
//   slides[index].classList.add('active');
// }
// ---------------------------------------------------------------------------------