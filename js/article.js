const publication_url = domain + '/publication';
var article_url = publication_url + '/articles/';

async function fetchArticles(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

// DEFAULT FUNCTION FOR STARTING THE PAGE
function listArticles() {
    // remove unneccessary items in localStorage first
    localStorage.removeItem('ctgry');
    localStorage.removeItem('srchinpt');
    
    let articleContainerElement = document.getElementById('article-container');
    
    article_url = article_url + '?ordering=-date_published';

    if (!articleContainerElement) {
        return;
    }

    fetchArticles(article_url)
    .then(json_response => {
        if (!json_response) {
            articleContainerElement.innerHTML = '';
            return;
        }
        // looping through results
        for (let article of json_response.results) {
            articleContainerElement.appendChild(articleElement(article));
        }
        displayArticleNav(json_response['count']);
    })
    .catch(e => {
        console.log(e);
    });
}

// FUNCTION FOR ARTICLE PAGINATION
function listArticlesSelectedPage(url) {
    let articleContainerElement = document.getElementById('article-container');

    if (!articleContainerElement) {
        return;
    }

    fetchArticles(url)
        .then(json_response => {
            if (!json_response) {
                articleContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let article of json_response.results) {
                articleContainerElement.appendChild(articleElement(article));
            }
        })
        .catch(e => {
            console.log(e);
        });
}

// FUNCTION FOR ARTICLE SEARCH
function listSearchedArticles(url) {
    let articleContainerElement = document.getElementById('article-container');

    if (!articleContainerElement) {
        return;
    }

    fetchArticles(url)
        .then(json_response => {
            if (!json_response) {
                articleContainerElement.innerHTML = 'No articles matches your search.';
                return;
            }
            // looping through results
            for (let article of json_response.results) {
                articleContainerElement.appendChild(articleElement(article));
            }
            displayArticleNav(json_response['count']);
        })
        .catch(e => {
            console.log(e);
        });
}

// FUNCTION FOR ARTICLE SORT
function listOrderedOrFilteredArticles(url) {
    let articleContainerElement = document.getElementById('article-container');

    if (!articleContainerElement) {
        return;
    }

    fetchArticles(url)
        .then(json_response => {
            if (!json_response) {
                articleContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let article of json_response.results) {
                articleContainerElement.appendChild(articleElement(article));
            }
            displayArticleNav(json_response['count']);
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
    article_outer_div.setAttribute('class', 'col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center');
    article_div.setAttribute('class', 'article');
    article_div.setAttribute('onclick', `readArticle(${article.id})`);

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
    article_div.innerHTML += `<div class="article-img">
                                    <img src="${article_img}" alt="${article_img_alt}">
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

    // format date_published
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date_published = new Date(article.date_published);
    date_published = `${monthNames[date_published.getMonth()]} ${date_published.getDate()}, ${date_published.getFullYear()}`;

    // input category, date_published, title_or_headline, & body
    article_div.innerHTML += `<h5 class="article-title">${article.title_or_headline}</h5>
                                <div class="article-view-category">${category}</div>
                                <div class="article-writer">BY
                                    <span class="article-name-of-writer">${article.full_name}</span>
                                </div>
                                <div class="article-date-published">${date_published}</div>`;

    article_outer_div.appendChild(article_div);

    return article_outer_div;
}

// FUNCTION FOR DISPLAYING ARTICLE PAGINATION NAV
function displayArticleNav(count){
    let nav_element = document.getElementById('article-nav');
    let page_num = 1;

    // display left arrow
    nav_element.innerHTML += `<li class="page-item">
                                    <a class="page-link" href="#paginate-here" onclick="paginateToPreviousPage(${page_num})" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>`;

    if(page_num == 1){
        nav_element.innerHTML += `<li class="page-item active" id="curr-active" aria-current="page">
                                        <a class="page-link" id="nav_number${page_num}" href="#paginate-here" onclick="paginateToSelectedPage(${page_num})">${page_num}</a>
                                    </li>`;
        count = count-10;
    }

    while(count>0){
        page_num++;
        nav_element.innerHTML += `<li class="page-item" id="inactive-${page_num}" aria-current="page">
                                        <a class="page-link" id="nav_number${page_num}" href="#paginate-here" onclick="paginateToSelectedPage(${page_num})">${page_num}</a>
                                    </li>`;
        count = count-10;
    }

    // display right arrow
    nav_element.innerHTML += `<li class="page-item">
                                    <a class="page-link" href="#paginate-here" onclick="paginateToNextPage()" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li`;
}

// FOR ARTICLE PAGINATION SELECT PAGE
function paginateToSelectedPage(page_num){
    let success = paginateToSelectedNav(page_num);

    if(success){
        // first empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';
    
        selected_page_url = article_url + `&page=${page_num}`;
    
        listArticlesSelectedPage(selected_page_url);
    }
}

// FOR PAGINATING TO SELECTED PAGE
function paginateToSelectedNav(page_num){
    // active nav element
    const curr_active = document.getElementById(`curr-active`);
    let curr_active_number = parseInt(curr_active.textContent.trim());
    // selected nav elements
    const selected = document.getElementById(`inactive-${page_num}`);
    
    // check if selected element id exists
    if(selected){
        // set active to inactive
        curr_active.setAttribute('class', 'page-item');
        curr_active.setAttribute('id', `inactive-${curr_active_number}`);

        // set inactive to active
        selected.setAttribute('class', 'page-item active');
        selected.setAttribute('id', 'curr-active');

        return true;
    }
    return false;
}

// FOR ARTICLE PAGINATION NEXT PAGE
function paginateToNextPage(){
    let success = paginateToNextNav();

    if(success){
        // first empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';

        // get active nav element
        const curr_active = document.getElementById(`curr-active`);
        let curr_active_number = parseInt(curr_active.textContent.trim());
    
        selected_page_url = article_url + `&page=${curr_active_number}`;
    
        listArticlesSelectedPage(selected_page_url);
    }
}

// FOR PAGINATING TO NEXT PAGE
function paginateToNextNav(){
    // active nav element
    const curr_active = document.getElementById(`curr-active`);
    let curr_active_number = parseInt(curr_active.textContent.trim());
    // next nav element
    const selected = document.getElementById(`inactive-${curr_active_number+1}`);

    if(selected){
        // set active to inactive
        curr_active.setAttribute('class', 'page-item');
        curr_active.setAttribute('id', `inactive-${curr_active_number}`);
        
        // set inactive to active
        selected.setAttribute('class', 'page-item active');
        selected.setAttribute('id', 'curr-active');

        return true;
    }
    return false;
}

// FOR PAGINATING TO PREVIOUS PAGE
function paginateToPreviousPage(page_num){
    let success = paginateToPreviousNav();

    if(success){
        // first empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';

        // get active nav element
        const curr_active = document.getElementById(`curr-active`);
        let curr_active_number = parseInt(curr_active.textContent.trim());
    
        selected_page_url = article_url + `&page=${curr_active_number}`;
    
        listArticlesSelectedPage(selected_page_url);
    }
}

// FOR PAGINATING NAV TO PREVIOUS PAGE
function paginateToPreviousNav(){
    // active nav element
    const curr_active = document.getElementById(`curr-active`);
    let curr_active_number = parseInt(curr_active.textContent.trim());
    // previous nav element
    const selected = document.getElementById(`inactive-${curr_active_number-1}`);

    if(selected){
        // set active to inactive
        curr_active.setAttribute('class', 'page-item');
        curr_active.setAttribute('id', `inactive-${curr_active_number}`);
        
        // set inactive to active
        selected.setAttribute('class', 'page-item active');
        selected.setAttribute('id', 'curr-active');
        
        return true;
    }
    return false;
}

// --------------------FOR SEARCH FUNCTION -----------------------------
function searchArticle(){
    let search_input = document.getElementById('search-article');
    let show_search_input = document.getElementById('show-search-input');

    // validate search input
    let valid = validateSearchInput(search_input, show_search_input);

    if(valid){
        // replace prevoous search from article url
        let previous_search = localStorage.getItem('srchinpt');
        if(previous_search){
            article_url = article_url.replace(previous_search, "");
        }

        // concat article url with search input
        article_url = article_url + `&search=${search_input.value}`;

        localStorage.setItem('srchinpt', `&search=${search_input.value}`);
    
        // empty the nav first
        emptyNav();
    
        // first empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';

        listSearchedArticles(article_url);
        
        if(search_input.value !== ''){
            // show result message
            show_search_input.textContent = `Showing results for : ${search_input.value}`;
        }
    
        // empty search bar
        search_input.value = '';
    }
}
// ---------------------------------------------------------------------

// FOR VALIDATING SEARCH INPUT
function validateSearchInput(input, message){
    let words_count = input.value.split(' ');
    let max_words = 10;

    if(words_count.length > max_words){
        message.textContent = `Your search must not exceed ${max_words} words.`;
        return false;
    }
    message.textContent = '';
    return true;
}

// FOR EMPTYING ARTICLE NAV
function emptyNav(){
    let nav_element = document.getElementById('article-nav');

    nav_element.innerHTML = '';
}

// FOR DATE PUBLISHED ARROW ANIMATION
function displayArticlesByDatePublished(){
    try{
        // empty the nav
        emptyNav();
    
        // empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';
    
        let icon = document.getElementById('arrow-icon');
        icon.classList.toggle('rotated');
        
        // order articles in ascending
        if(icon.getAttribute('class') === 'bi bi-arrow-up arrow'){
            article_url = article_url.replace("ordering=date_published", "ordering=-date_published");
            listOrderedOrFilteredArticles(article_url);
        }
        // order articles in descending
        else{
            article_url = article_url.replace("ordering=-date_published", "ordering=date_published");
            listOrderedOrFilteredArticles(article_url);
        }
    }
    catch(error){
        console.log(error);
    }
}

// FOR FILTERING ARTICLES BY CATEGORY
function displayArticlesByCategory(category){
    try{
        // replace prevoous category from article url
        let previous_category = localStorage.getItem('ctgry');
        if(previous_category){
            article_url = article_url.replace(previous_category, "");
        }

        article_url = article_url + `&category=${category}`;
        localStorage.setItem('ctgry', `&category=${category}`)

        let category_display = document.getElementById('paginate-here');

        // set up category display
        if(category === ''){
            category_display.textContent = '';
        }
        if(category === 'CL'){
            category_display.textContent = 'COLUMN';
        }
        if(category === 'C'){
            category_display.textContent = 'CULTURE';
        }
        if(category === 'E'){
            category_display.textContent = 'EDITORIAL';
        }
        if(category === 'F'){
            category_display.textContent = 'FEATURE';
        }
        if(category === 'N'){
            category_display.textContent = 'NEWS';
        }
        if(category === 'NF'){
            category_display.textContent = 'NEWS FEATURE';
        }
        if(category === 'O'){
            category_display.textContent = 'OPINION';
        }

        // empty the nav
        emptyNav();
    
        // empty articles div
        let article_div = document.getElementById('article-container');
        article_div.innerHTML = '';

        listOrderedOrFilteredArticles(article_url);
    }
    catch(error){
        console.log(error);
    }
}

function readArticle(article_id){
    localStorage.setItem('articleID', article_id);
    window.location.href = '/the-pillar-frontend/html/articleView.html';
}
