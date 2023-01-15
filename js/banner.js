
async function fetchBanners() {
    try {
        const response = await fetch(`${publicationUrl}/banners/?ordering=date_published`);

        if (!response.ok) {
            throw new Error(`Failed to fetch banners: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

function listBanners(bannerContainerElementId) {
    const bannerContainerElement = document.getElementById(bannerContainerElementId);

    if (!bannerContainerElement) {
        return;
    }

    fetchBanners()
        .then(json_response => {
            if (!json_response) {
                bannerContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let i = 0; i < json_response.length; i++) {
                bannersElement(json_response[i], i);
            }
        })
        .catch(e => {
            console.log(e);
        });
}

// populating banner
function bannersElement(banner, indicator) {
    const banner_img_div = document.getElementById('banner-images');
    const banner_indicator_div = document.getElementById('banner-indicators');

    if (indicator == 0){
        banner_indicator_div.innerHTML = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${indicator}" class="active"
                                            aria-current="true" aria-label="Slide ${indicator+1}"></button>`;
        banner_img_div.innerHTML = `<div class="carousel-item active c-item">
                                        <img src="${banner.image}" class="d-block w-100 c-img" alt="${banner.image.replace(/^.*[\\\/]/, '')}">
                                    </div>`;
    }
    else{
        banner_indicator_div.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${indicator}"
                                            aria-label="Slide ${indicator+1}"></button>`;
        banner_img_div.innerHTML += `<div class="carousel-item c-item">
                                        <img src="${banner.image}" class="d-block w-100 c-img" alt="${banner.image.replace(/^.*[\\\/]/, '')}">
                                    </div>`;
    }
}

