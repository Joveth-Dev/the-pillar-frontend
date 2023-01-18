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

    // display Editor-in-Chief
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

        if (member.current_position.toLowerCase() === "editor-in-chief"){
            eic_div.innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                    <p class="lead  thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "associate editor"){
            document.getElementById('associate-editor').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('associate-editor').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "managing editor"){
            document.getElementById('managing-editor').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('managing-editor').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "culture editor"){
            document.getElementById('culture-editor').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('culture-editor').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "news editor"){
            document.getElementById('news-editor').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('news-editor').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "feature editor"){
            document.getElementById('feature-editor').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('feature-editor').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
    };
}

function displayOtherMembers(json_response) {
    const staff_writer_div = document.getElementById('Staff-Writers');
    const cartoonist_div = document.getElementById('cartoonists');
    const photojournalists_div = document.getElementById('Photojournalists');
    const layout_artists_div = document.getElementById('layoutArtists');
    
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

        if(member.current_position.toLowerCase() === "staff writters"){
            staff_writer_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            </div>`;
        }
        if(member.current_position.toLowerCase() === "cartoonist"){
            cartoonist_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position.toLowerCase() === "photojournalist"){
            photojournalists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(member.current_position.toLowerCase() === "layout artist"){
            layout_artists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(member.current_position.toLowerCase() === 'financial adviser'){
            document.getElementById('financial-adviser').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('financial-adviser').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'technical adviser'){
            document.getElementById('technical-adviser').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('technical-adviser').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'finance manager'){
            document.getElementById('finance-manager').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('finance-manager').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'assistant finance manager'){
            document.getElementById('assistant-finance-manager').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('assistant-finance-manager').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
    }
}

function displayEBsection(json_response){
    const eic_div = document.getElementById('eic-section'); // Editor-in-chief

    // display Editor-in-Chief
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

        if (member.current_position.toLowerCase() === "editor-in-chief"){
            eic_div.innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                    <p class="lead  thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "associate editor"){
            document.getElementById('associate-editor-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('associate-editor-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "managing editor"){
            document.getElementById('managing-editor-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('managing-editor-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "culture editor"){
            document.getElementById('culture-editor-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('culture-editor-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "news editor"){
            document.getElementById('news-editor-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('news-editor-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if (member.current_position.toLowerCase() === "feature editor"){
            document.getElementById('feature-editor-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('feature-editor-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
    };
}

function displayOtherMembersSection(json_response){
    const staff_writer_div = document.getElementById('Staff Editor');
    const cartoonist_div = document.getElementById('cartoonists-section');
    const photojournalists_div = document.getElementById('Photojournalists-section');
    const layout_artists_div = document.getElementById('layoutArtists-section');

    // display other EB members
    for(const member of json_response){
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

        if(member.current_position.toLowerCase() === "staff writters"){
            staff_writer_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position.toLowerCase() === "cartoonist"){
            cartoonist_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                            <img class="thePillarProfilePicture" src="${image_src}"/>
                                            <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                        </div>`;
        }
        if(member.current_position.toLowerCase() === "photojournalist"){
            photojournalists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                    <img class="thePillarProfilePicture" src="${image_src}"/>
                                                    <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                </div>`;
        }
        if(member.current_position.toLowerCase() === "layout artist"){
            layout_artists_div.innerHTML += `<div class="col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer">
                                                <img class="thePillarProfilePicture" src="${image_src}"/>
                                                <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                            </div>`;
        }
        if(member.current_position.toLowerCase() === 'financial adviser'){
            document.getElementById('financial-adviser-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('financial-adviser').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'technical adviser'){
            document.getElementById('technical-adviser-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('technical-adviser-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'finance manager'){
            document.getElementById('finance-manager-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('finance-manager-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
        if(member.current_position.toLowerCase() === 'assistant finance manager'){
            document.getElementById('assistant-finance-manager-sec').setAttribute('class', 'col-6 col-lg-4 d-flex flex-column justify-content-center align-items-center thePillarProfileContainer d-block')
            document.getElementById('assistant-finance-manager-sec').innerHTML += `<img class="thePillarProfilePicture" src="${image_src}"/>
                                                                        <h3 class="thePillarProfilePictureName">${member.full_name}</h3>
                                                                        <p class="lead thePillarProfilePosition">${member.current_position}</p>`;
        }
    }
}
