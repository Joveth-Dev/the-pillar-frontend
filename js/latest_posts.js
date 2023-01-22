const publicationUrl = domain + '/publication';

async function fetchArticles() {
    try {
        const response = await fetch(`${publicationUrl}/articles/?ordering=-date_published`);

        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

function listArticles(articleContainerElementId) {
    const articleContainerElement = document.getElementById(articleContainerElementId);

    if (!articleContainerElement) {
        return;
    }

    fetchArticles()
        .then(json_response => {
            if (!json_response) {
                articleContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (const article of json_response.results) {
                articleContainerElement.appendChild(articleElement(article));
            }
        })
        .catch(e => {
            console.log(e);
        });
}

// populating latest posts section w/ article data
function articleElement(article) {
    const article_outer_div = document.createElement('div');
    const article_div = document.createElement('div');
    let category = article.category;
    let article_img = '', article_img_alt = '';

    // set up article_div
    article_outer_div.setAttribute('class', 'col');
    article_outer_div.setAttribute('onclick', `readArticle(${article.id})`);
    article_div.setAttribute('class', 'custom-card border rounded');

    // populate article image if exists
    if(article.article_images.length !== 0){
        article_img = article.article_images[0].image;
        article_img_alt = article.article_images[0].image.replace(/^.*[\\\/]/, '');
    }
    else{
        if(category == 'N'){
            article_img = "/the-pillar-frontend/default_article_images/default_news.png";
            article_img_alt = "Default News";
        }
        if(category == 'NF'){
            article_img = "/the-pillar-frontend/default_article_images/default_news_feature.png";
            article_img_alt = "Default News Feature";
        }
        if(category == 'F'){
            article_img = "/the-pillar-frontend/default_article_images/default_feature.png";
            article_img_alt = "Default Feature";
        }
        if(category == 'O'){
            article_img = "/the-pillar-frontend/default_article_images/default_opinion.png";
            article_img_alt = "Default Opinion";
        }
        if(category == 'C'){
            article_img = "/the-pillar-frontend/default_article_images/default_culture.png";
            article_img_alt = "Default Culture";
        }
        if(category == 'E'){
            article_img = "/the-pillar-frontend/default_article_images/default_editorial.png";
            article_img_alt = "Default Editorial";
        }
        if(category == 'CL'){
            article_img = "/the-pillar-frontend/default_article_images/default_column.png";
            article_img_alt = "Default Column";
        }
    }

    // displaying article image
    article_div.innerHTML += `<div class="image-card">
                                    <img class="img-image-card" src="${article_img}" alt="${article_img_alt}">
                                </div>`;

    // set category
    if(category == 'N'){
        category = 'NEWS';
    }
    if(category == 'NF'){
        category = 'NEWS FEATURE';
    }
    if(category == 'F'){
        category = 'FEATURE';
    }
    if(category == 'O'){
        category = 'OPINION';
    }
    if(category == 'C'){
        category = 'CULTURE';
    }
    if(category == 'E'){
        category = 'EDITORIAL';
    }
    if(category == 'CL'){
        category = 'COLUMN';
    }

    // set date_published
    var date_published = new Date(article.date_published);
    date_published = `${date_published.getMonth()+1}/${date_published.getDate()}/${date_published.getFullYear()}`;

    // input category, date_published, title_or_headline, & body
    article_div.innerHTML += `<div class="body-card">
                                    <span class="card-category">${category}</span> 
                                    <span class="card-published-date">${date_published}</span>
                                    <hr>
                                    <div class="card-title">${article.title_or_headline}</div>
                                </div>`;

    article_outer_div.appendChild(article_div);
    return article_outer_div;
}

function readArticle(article_id){
    localStorage.setItem('articleID', article_id);
    window.location.href = '/the-pillar-frontend/html/articleView.html';
}
