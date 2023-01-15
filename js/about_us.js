const publicationUrl = domain + '/publication';

async function fetchMembers() {
    try {
        const response = await fetch(`${publicationUrl}/members/`);

        if (!response.ok) {
            throw new Error(`Failed to fetch members: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

function listMembers(memberContainerElement) {
    const memberContainer = document.getElementById(memberContainerElement);

    if (!memberContainerElement) {
        return;
    }

    fetchMembers()
        .then(json_response => {
            if (!json_response) {
                memberContainer.innerHTML = '';
                return;
            }
            // DISPLAY MEMBERS
            displayEB(json_response);
            displayOtherMembers(json_response);
            displayEBsection(json_response);
            displayOtherMembersSection(json_response);
        })
        .catch(e => {
            console.log(e);
        });
}

// Populate editorial board
function displayEB(json_response) {
    const eic_div = document.getElementById('eic'); // Editor-in-chief
    const other_eb_div = document.getElementById('other-editrorial-members'); // Other editorial board members' div
    let other_eb_positions = ["Associate Editor", "Managing Editor", "Culture Editor", "News Editor", "Feature Editor"];

    // display Editor-in-Chief
    for(let member of json_response){
        if (member.current_position == "Editor-in-chief"){
            let image_src;
            
            if (member.avatar === ''){
                if(member.sex == 'N'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
                }
                if(member.sex == 'M'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
                }
                if(member.sex == 'F'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
                }
            }
            else{
                image_src = member.avatar;
            }
            eic_div.innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                    <p class="lead  thePillarProfilePosition">${member.current_position}</p>`;
        }
    };

    // display other editorial members
    for(let member of json_response){
        let image_src;
        
        if (member.avatar == ''){
            if(member.sex == 'N'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
            }
            if(member.sex == 'M'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
            }
            if(member.sex == 'F'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
            }
        }
        else{
            image_src = member.avatar;
        }
        if(other_eb_positions.includes(member.current_position)){
            other_eb_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            <p class="lead thePillarProfilePosition">${member.current_position}</p>
                                        </div>`;
        }
    };
}

function displayOtherMembers(json_response) {
    const staff_writer_div = document.getElementById('Staff-Writers');
    const cartoonist_div = document.getElementById('cartoonists');
    const photojournalists_div = document.getElementById('Photojournalists');
    const layout_artists_div = document.getElementById('layoutArtists');
    let other_members_div = document.getElementById('other-eb-members');
    let other_member_arr = ["Financial Adviser", "Technical Adviser", "Assistant Financial Manager", "Financial Manager"];
    
    for(const member of json_response){
        let image_src;
        
        if (member.avatar == ''){
            if(member.sex == 'N'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
            }
            if(member.sex == 'M'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
            }
            if(member.sex == 'F'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
            }
        }
        else{
            image_src = member.avatar;
        }
        if(member.current_position == "Staff Writters"){
            staff_writer_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            </div>`;
        }
        if(member.current_position == "Cartoonist"){
            cartoonist_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position == "Photojournalist"){
            photojournalists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(member.current_position == "Layout Artist"){
            layout_artists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(other_member_arr.includes(member.current_position)){
            other_members_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                <p class="lead thePillarProfilePosition">${member.current_position}</p>
                                            </div>`;
        }
    }
}

function displayEBsection(json_response){
    const eic_div = document.getElementById('eic-section'); // Editor-in-chief
    const other_eb_div = document.getElementById('Editorial-Board-section'); // Other editorial board members' div
    let other_eb_positions = ["Associate Editor", "Managing Editor", "Culture Editor", "News Editor", "Feature Editor"];

    // display Editor-in-Chief
    for(let member of json_response){
        if (member.current_position == "Editor-in-chief"){
            let image_src;
            
            if (member.avatar == ''){
                if(member.sex == 'N'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
                }
                if(member.sex == 'M'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
                }
                if(member.sex == 'F'){
                    image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
                }
            }
            else{
                image_src = member.avatar;
            }
            eic_div.innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                    <p class="lead  thePillarProfilePosition">${member.current_position}</p>`;
        }
    };

    // display other editorial members
    for(let member of json_response){
        let image_src;
        
        if (member.avatar == ''){
            if(member.sex == 'N'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
            }
            if(member.sex == 'M'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
            }
            if(member.sex == 'F'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
            }
        }
        else{
            image_src = member.avatar;
        }
        if(other_eb_positions.includes(member.current_position)){
            other_eb_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            <p class="lead thePillarProfilePosition">${member.current_position}</p>
                                        </div>`;
        }
    };
}

function displayOtherMembersSection(json_response){
    const staff_writer_div = document.getElementById('Staff Editor');
    const cartoonist_div = document.getElementById('cartoonists-section');
    const photojournalists_div = document.getElementById('Photojournalists-section');
    const layout_artists_div = document.getElementById('layoutArtists-section');
    let other_members_div = document.getElementById('other-members-section');
    let other_member_arr = ["Financial Adviser", "Technical Adviser", "Assistant Financial Manager", "Financial Manager"];

    // display other EB members
    for(const member of json_response){
        let image_src;
        
        if (member.avatar == ''){
            if(member.sex == 'N'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_no_sex.jpg";
            }
            if(member.sex == 'M'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_male.jpg";
            }
            if(member.sex == 'F'){
                image_src = "/the-pillar-frontend/default_profile_imgs/default_female.jpg";
            }
        }
        else{
            image_src = member.avatar;
        }
        if(member.current_position == "Staff Writters"){
            staff_writer_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position == "Cartoonist"){
            cartoonist_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position == "Photojournalist"){
            photojournalists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(member.current_position == "Layout Artist"){
            layout_artists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            </div>`;
        }
        if(other_member_arr.includes(member.current_position)){
            other_members_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                <p class="lead thePillarProfilePosition">${member.current_position}</p>
                                            </div>`;
        }
    }
}
