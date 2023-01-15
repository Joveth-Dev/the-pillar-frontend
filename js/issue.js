const publication_url = domain + '/publication';
var issue_url = publication_url + '/issues/';

async function fetchIssues(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

// DEFAULT FUNCTION FOR STARTING THE PAGE
function listIssues() {
    let issueContainerElement = document.getElementById('issue-container');

    issue_url = issue_url + '?ordering=-date_published';

    if (!issueContainerElement) {
        return;
    }

    fetchIssues(issue_url)
        .then(json_response => {
            if (!json_response) {
                issueContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let issue of json_response.results) {
                diplayIssues(issue, issueContainerElement);
            }
            displayIssueNav(json_response['count']);
        })
        .catch(e => {
            console.log(e);
        });
}

// FUNCTION FOR ISSUE PAGINATION
function listIssuesSelectedPage(url) {
    let issueContainerElement = document.getElementById('issue-container');

    if (!issueContainerElement) {
        return;
    }

    fetchIssues(url)
        .then(json_response => {
            if (!json_response) {
                issueContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let issue of json_response.results) {
                diplayIssues(issue, issueContainerElement);
            }
        })
        .catch(e => {
            console.log(e);
        });
}

// FUNCTION FOR ISSUE SEARCH
function listSearchedIssues(url) {
    let issueContainerElement = document.getElementById('issue-container');

    if (!issueContainerElement) {
        return;
    }

    fetchIssues(url)
        .then(json_response => {
            if (!json_response) {
                issueContainerElement.innerHTML = 'No issues matches your search.';
                return;
            }
            // looping through results
            for (let issue of json_response.results) {
                diplayIssues(issue, issueContainerElement);
            }
            displayIssueNav(json_response['count']);
        })
        .catch(e => {
            console.log(e);
        });
}

// FUNCTION FOR ISSUE SORT
function listOrderedOrFilteredIssues(url) {
    let issueContainerElement = document.getElementById('issue-container');

    if (!issueContainerElement ) {
        return;
    }

    fetchIssues(url)
        .then(json_response => {
            if (!json_response) {
                issueContainerElement.innerHTML = '';
                return;
            }
            // looping through results
            for (let issue of json_response.results) {
                diplayIssues(issue, issueContainerElement);
            }
            displayIssueNav(json_response['count']);
        })
        .catch(e => {
            console.log(e);
        });
}

// FOR DISPLAYNG ISSUES
function diplayIssues(issue, issue_main_div){
    let issue_outer_div = document.createElement('div');
    let issue_div = document.createElement('div');
    let category = issue.category;

    // set attributes of outer divs
    issue_outer_div.setAttribute('class', 'col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center');
    issue_outer_div.setAttribute('onclick', `readIssue(${issue.id})`);
    issue_div.setAttribute('class', 'custom-card-issue');

    // set issue category
    if(category == 'LF'){
        category = 'LITERARY FOLIO';
    }
    if(category == 'T'){
        category = 'TABLOID';
    }
    if(category == 'SM'){
        category = 'SPORTS MAGAZINE';
    }
    if(category == 'N'){
        category = 'NEWSLETTER';
    }

    // format date_published
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date_published = new Date(issue.date_published);
    date_published = `${monthNames[date_published.getMonth()]} ${date_published.getDate()}, ${date_published.getFullYear()}`;

    issue_div.innerHTML += `<div class="card-image-issue">
                                <img src="${issue.issue_file.image_for_thumbnail}" alt="${issue.issue_file.image_for_thumbnail.replace(/^.*[\\\/]/, '')}">
                            </div>
                            <div class="card-title-issue">ISSUE NO. ${issue.issue_number}</div>
                            <div class="custom-card-issue-information">
                                <div class="card-issue-volume">Volume ${issue.volume_number}</div>
                                <div class="card-issue-category">${category}</div>
                                <div class="card-published-date">${date_published}</div>
                            </div>`;
    
    issue_outer_div.appendChild(issue_div);
    issue_main_div.appendChild(issue_outer_div);
}

// FUNCTION FOR DISPLAYING ISSUE PAGINATION NAV
function displayIssueNav(count){
    let nav_element = document.getElementById('issue-nav');
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
        count = count-8;
    }

    while(count>0){
        page_num++;
        nav_element.innerHTML += `<li class="page-item" id="inactive-${page_num}" aria-current="page">
                                        <a class="page-link" id="nav_number${page_num}" href="#paginate-here" onclick="paginateToSelectedPage(${page_num})">${page_num}</a>
                                    </li>`;
        count = count-8;
    }

    // display right arrow
    nav_element.innerHTML += `<li class="page-item">
                                    <a class="page-link" href="#paginate-here" onclick="paginateToNextPage()" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li`;
}

// FOR ISSUE PAGINATION SELECT PAGE
function paginateToSelectedPage(page_num){
    let success = paginateToSelectedNav(page_num);

    if(success){
        // first empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';
    
        selected_page_url = issue_url + `&page=${page_num}`;
    
        listIssuesSelectedPage(selected_page_url);
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

// FOR ISSUE PAGINATION NEXT PAGE
function paginateToNextPage(){
    let success = paginateToNextNav();

    if(success){
        // first empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';

        // get active nav element
        const curr_active = document.getElementById(`curr-active`);
        let curr_active_number = parseInt(curr_active.textContent.trim());
    
        selected_page_url = issue_url + `&page=${curr_active_number}`;
    
        listIssuesSelectedPage(selected_page_url);
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
        // first empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';

        // get active nav element
        const curr_active = document.getElementById(`curr-active`);
        let curr_active_number = parseInt(curr_active.textContent.trim());
    
        selected_page_url = issue_url + `&page=${curr_active_number}`;
    
        listIssuesSelectedPage(selected_page_url);
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
function searchIssue(){
    let search_input = document.getElementById('search-issue');
    let show_search_input = document.getElementById('show-search-input');

    // validate search input
    let valid = validateSearchInput(search_input, show_search_input);

    if(valid){
        // replace prevoous search from issue url
        let previous_search = localStorage.getItem('isrchinpt');
        if(previous_search){
            issue_url = issue_url.replace(previous_search, "");
        }

        // concat issue url with search input
        issue_url = issue_url + `&search=${search_input.value}`;

        localStorage.setItem('isrchinpt', `&search=${search_input.value}`);
    
        // empty the nav first
        emptyNav();
    
        // first empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';
        listSearchedIssues(issue_url);
        
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

// FOR EMPTYING ISSUE NAV
function emptyNav(){
    let nav_element = document.getElementById('issue-nav');

    nav_element.innerHTML = '';
}

// FOR DATE PUBLISHED ARROW ANIMATION
function displayIssuesByDatePublished(){
    try{
        // empty the nav
        emptyNav();
    
        // empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';
    
        let icon = document.getElementById('arrow-icon');
        icon.classList.toggle('rotated');
        
        // order issues in ascending
        if(icon.getAttribute('class') === 'bi bi-arrow-up arrow'){
            issue_url = issue_url.replace("ordering=date_published", "ordering=-date_published");
            listOrderedOrFilteredIssues(issue_url);
        }
        // order issues in descending
        else{
            issue_url = issue_url.replace("ordering=-date_published", "ordering=date_published");
            listOrderedOrFilteredIssues(issue_url);
        }
    }
    catch(error){
        console.log(error);
    }
}


// FOR FILTERING ARTICLES BY CATEGORY
function displayIssuesByCategory(category){
    try{
        // replace prevoous category from issue url
        let previous_category = localStorage.getItem('ictgry');
        if(previous_category){
            issue_url = issue_url.replace(previous_category, "");
        }

        issue_url = issue_url + `&category=${category}`;
        localStorage.setItem('ictgry', `&category=${category}`)

        let category_display = document.getElementById('paginate-here');

        // set up category display
        if(category === ''){
            category_display.textContent = '';
        }
        if(category === 'LF'){
            category_display.textContent = 'LITERARY FOLIO';
        }
        if(category === 'N'){
            category_display.textContent = 'NEWSLETTER';
        }
        if(category === 'SM'){
            category_display.textContent = 'SPORTS MAGAZINE';
        }
        if(category === 'T'){
            category_display.textContent = 'TABLOID';
        }

        // empty the nav
        emptyNav();
    
        // empty issues div
        let issue_div = document.getElementById('issue-container');
        issue_div.innerHTML = '';
        listOrderedOrFilteredIssues(issue_url);
    }
    catch(error){
        console.log(error);
    }
}

function readIssue(issue_id){
    localStorage.setItem('issueID', issue_id);
    window.location.href = '/the-pillar-frontend/html/issueView.html';
}
