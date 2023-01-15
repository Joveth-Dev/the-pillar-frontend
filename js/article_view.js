async function fetchSingleArticle(){
    const article_id = localStorage.getItem('articleID');
    const single_article_url = domain + `/publication/articles/?id=${article_id}`;

    try{
        const response = await fetch(single_article_url, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if(!response.ok){
            throw new Error(`Failed to fetch article : ${response.status}`);
        }

        return await response.json()
    }catch(error){
        console.log(error)
    }
}

function getSingleArticle(){
    fetchSingleArticle()
    .then(data => {
        displaySingleArticle(data.results[0]);
    })
}

function displayArticleImage(article){
    let article_picture = document.getElementById('article-picture');
    let article_body_div = document.getElementById('article-body');

    // make an array for the article images, alt text, and caption
    let article_img = [], article_img_alt = [], image_caption = [];
    let count;

    const body_arr = article.body.split('\n').filter(paragraph => paragraph !== '').filter(element => element !== '\r');

    if(body_arr.length >= article.article_images.length){
        // loop through the images and body and display
        for(let i = 0; i < article.article_images.length; i++){
            article_img[i] = article.article_images[i].image;
            article_img_alt[i] = article.article_images[i].image.replace(/^.*[\\\/]/, '');
            image_caption[i] = article.article_images[i].image_caption;
    
            // set article_picture
            article_picture.innerHTML += `<div class="m-auto article-view-img">
                                            <img src="${article_img[i]}" alt="${article_img_alt[i]}">
                                        </div>
                                        <p class="m-auto pb-3 article-img-caption">${image_caption[i]}</p>
                                        <p class="m-auto preformatted article-text-view">${body_arr[i]+'\n\n'}</p>`;
            count = i+1;
        }
        // for displaying the rest of the body array
        for(let i = count; i < body_arr.length; i++){
            article_body_div.textContent += body_arr[i] + '\n\n';
        }
    }else{
        // loop through the images and body and display
        for(let i = 0; i < article.article_images.length; i++){
            article_img[i] = article.article_images[i].image;
            article_img_alt[i] = article.article_images[i].image.replace(/^.*[\\\/]/, '');
            image_caption[i] = article.article_images[i].image_caption;
    
            // set article_picture
            article_picture.innerHTML += `<div class="m-auto article-view-img">
                                            <img src="${article_img[i]}" alt="${article_img_alt[i]}">
                                        </div>
                                        <p class="m-auto pb-3 article-img-caption">${image_caption[i]}</p>`;
        }
        // for displaying the rest of the body array
        for(let i = 0; i < body_arr.length; i++){
            article_body_div.textContent += body_arr[i] + '\n\n';
        }
    }
}

function displaySingleArticle(article){
    // get article elements
    let title = document.getElementById('article-title');
    let category = document.getElementById('article-category');
    let author = document.getElementById('article-author');
    let date_published = document.getElementById('date-published');
    let article_picture = document.getElementById('article-picture');
    let article_body_div = document.getElementById('article-body');

    let article_img, article_img_alt, image_caption = '';
    let data_category = article.category;

    // populate article image if exists
    if(article.article_images.length !== 0){
        displayArticleImage(article);
    }
    else{
        if(data_category === 'N'){
            article_img = "../default_article_images/default_news.png";
            article_img_alt = "Default News";
        }
        if(data_category === 'NF'){
            article_img = "../default_article_images/default_news_feature.png";
            article_img_alt = "Default News Feature";
        }
        if(data_category === 'F'){
            article_img = "../default_article_images/default_feature.png";
            article_img_alt = "Default Feature";
        }
        if(data_category === 'O'){
            article_img = "../default_article_images/default_opinion.png";
            article_img_alt = "Default Opinion";
        }
        if(data_category === 'C'){
            article_img = "../default_article_images/default_culture.png";
            article_img_alt = "Default Culture";
        }
        if(data_category === 'E'){
            article_img = "../default_article_images/default_editorial.png";
            article_img_alt = "Default Editorial";
        }
        if(data_category === 'CL'){
            article_img = "../default_article_images/default_column.png";
            article_img_alt = "Default Column";
        }
        
        // set article_picture
        article_picture.innerHTML = `<div class="m-auto article-view-img">
                                            <img src="${article_img}" alt="${article_img_alt}">
                                        </div>
                                        <p class="m-auto pb-3 article-img-caption">${image_caption}</p>`;
        article_body_div.textContent = article.body;
    }

    // set category
    if(data_category == 'N'){
        data_category = 'NEWS';
    }
    if(data_category == 'NF'){
        data_category = 'NEWS FEATURE';
    }
    if(data_category == 'F'){
        data_category = 'FEATURE';
    }
    if(data_category == 'O'){
        data_category = 'OPINION';
    }
    if(data_category == 'C'){
        data_category = 'CULTURE';
    }
    if(data_category == 'E'){
        data_category = 'EDITORIAL';
    }
    if(data_category == 'CL'){
        data_category = 'COLUMN';
    }

    // set date_published
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let data_date_published = new Date(article.date_published);
    data_date_published = `${monthNames[data_date_published.getMonth()]} ${data_date_published.getDate()}, ${data_date_published.getFullYear()}`;

    // set element contents
    category.textContent = data_category;
    title.textContent = article.title_or_headline;
    author.textContent = `by ${article.author}`;
    date_published.textContent = data_date_published;
}


// -------------------------- FOR MUST READ SECTION --------------------------------
async function fetchMustRead(){
    try{
        let must_read_url = domain + '/publication/articles/?ordering=-date_published';

        const response = await fetch(must_read_url);

        if(!response.ok){
            throw new Error(`Failed to fetch must read articles : ${response.status}`);
        }

        return await response.json();
    }
    catch(error){
        console.log(error);
    }
}


function getMustRead(article){
    let article_div = document.getElementById('article-container');

    fetchMustRead()
    .then(data => {
        if(!data){
            article_div.innerHTML = '';
        }

        for(i = 0; i < 2; i++){
            article_div.appendChild(displayMustRead(data.results[i]));
            if(data.results.length === 1){
                break;   
            }
        }
    })
    .catch(error => console.log(error));
}

function displayMustRead(article){
    let article_outer_div = document.createElement('div');
    let article_div = document.createElement('div');

    article_outer_div.setAttribute('class', 'col-12 col-md-6 d-flex justify-content-center');
    article_div.setAttribute('class', 'article');
    article_div.setAttribute('onclick', `readArticle(${article.id})`);
    
    let article_img = [], article_img_alt =[], image_caption = '';
    let data_category = article.category;

    // populate article image if exists
    if(article.article_images.length !== 0){
        article_img.push(article.article_images[0].image);
        article_img_alt.push(article.article_images[0].image.replace(/^.*[\\\/]/, ''));
        image_caption = article.article_images[0].image_caption
    }
    else{
        if(data_category === 'N'){
            article_img = "../default_article_images/default_news.png";
            article_img_alt = "Default News";
        }
        if(data_category === 'NF'){
            article_img = "../default_article_images/default_news_feature.png";
            article_img_alt = "Default News Feature";
        }
        if(data_category === 'F'){
            article_img = "../default_article_images/default_feature.png";
            article_img_alt = "Default Feature";
        }
        if(data_category === 'O'){
            article_img = "../default_article_images/default_opinion.png";
            article_img_alt = "Default Opinion";
        }
        if(data_category === 'C'){
            article_img = "../default_article_images/default_culture.png";
            article_img_alt = "Default Culture";
        }
        if(data_category === 'E'){
            article_img = "../default_article_images/default_editorial.png";
            article_img_alt = "Default Editorial";
        }
        if(data_category === 'CL'){
            article_img = "../default_article_images/default_column.png";
            article_img_alt = "Default Column";
        }
    }

    article_div.innerHTML = `<div class="article-img">
                                <img src="${article_img}" alt="${article_img_alt}">
                            </div>`;


    // set date_published
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let data_date_published = new Date(article.date_published);
    data_date_published = `${monthNames[data_date_published.getMonth()]} ${data_date_published.getDate()}, ${data_date_published.getFullYear()}`;

    article_div.innerHTML += `<h5 class="article-title">${article.title_or_headline}</h5>
                                <div class="article-writer">by<span class="article-name-of-writer"> ${article.author}</span></div>
                                <div class="article-date-published">${data_date_published}</div>`;

    article_outer_div.appendChild(article_div);

    return article_outer_div;
}
// ---------------------------------------------------------------------------------

function readArticle(article_id){
    localStorage.setItem('articleID', article_id);
    window.location.href = 'http://127.0.0.1:5500/html/articleView.html';
}
