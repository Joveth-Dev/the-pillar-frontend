
async function fetchAnnouncement() {
    try {
        const response = await fetch(`${publicationUrl}/announcements/?ordering=date_created`);

        if (!response.ok) {
            throw new Error(`Failed to fetch banners: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

function listAnnouncements() {
    const announcementContainerElement = document.getElementById('announcement-images');
    const announcementContainerElement_1 = document.getElementById('announcement-images-1');

    if (!announcementContainerElement) {
        return;
    }

    fetchAnnouncement()
        .then(json_response => {
            if (!json_response) {
                announcementContainerElement.innerHTML = '';
                announcementContainerElement_1.innerHTML = '';
                return;
            }
            // looping through results
            for (let i = 0; i < json_response.length; i++) {
                announcementElement(json_response[i], i);
            }
        })
        .catch(e => {
            console.log(e);
        });
}

// populating announcement board
function announcementElement(announcement, indicator) {
    const announcement_img_div = document.getElementById('announcement-images');
    const announcement_img_div_1 = document.getElementById('announcement-images-1');

    if (indicator == 0){
        announcement_img_div.innerHTML = `<div class="carousel-item active">
                                                <img class="carousel-img" src="${announcement.announcement_img}" class="d-block w-100" alt="${announcement.announcement_img}">
                                            </div>`;
    }
    else{
        announcement_img_div.innerHTML += `<div class="carousel-item">
                                                <img class="carousel-img" src="${announcement.announcement_img}" class="d-block w-100" alt="${announcement.announcement_img}">
                                            </div>`;
    }


    if (indicator == 0){
        announcement_img_div_1.innerHTML = `<div class="carousel-item active">
                                                <img class="carousel-img" src="${announcement.announcement_img}" class="d-block w-100" alt="${announcement.announcement_img}">
                                            </div>`;
    }
    else{
        announcement_img_div_1.innerHTML += `<div class="carousel-item">
                                                <img class="carousel-img" src="${announcement.announcement_img}" class="d-block w-100" alt="${announcement.announcement_img}">
                                            </div>`;
    }
}