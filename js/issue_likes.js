const likes_url = domain + '/likes/likeditems/?content_type=9&object_id=';
const dislikes_url = domain + '/likes/dislikeditems/?content_type=9&object_id=';
const like_url = domain + '/likes/likeditems/'; // append with like_id
const dislike_url = domain + '/likes/dislikeditems/'; // append with like_id

var like_id, dislike_id;

// --------------------------------- FOR LOADING LIKES ----------------------------------
async function loadLikesAndDislikes(){
    try{
        let access = localStorage.getItem('access');
        // likes data storage
        let likes_data_cont, dislikes_data_cont;

        if(access){
            // fetch likes data
            likes_data_cont = await fetchLikes(access)
            .then(likes_data => {
                // console.clear();
                return likes_data;
            })
            .catch(error => console.log(error))

            // fetch dislikes data
            dislikes_data_cont = await fetchDislikes(access)
            .then(dislikes_data => {
                // console.clear();
                return dislikes_data;
            })
            .catch(error => console.log(error))

            displayLikesAndDislikes(likes_data_cont, dislikes_data_cont);
        }else{
            loadLoginPrompts();
        }
    }catch(error){
        console.log(error)
    }
}
// --------------------------------------------------------------------------------------


// -------------------------------- FOR FETCHING LIKES ----------------------------------
async function fetchLikes(access, method=null){
    try{
        let issue_id = localStorage.getItem('issueID');
        if(issue_id){
            if(!method){
                const response = await fetch(likes_url+issue_id, {
                    headers : {
                        Authorization: `JWT ${access}`
                    }
                })
                
                if(!response.ok){
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        window.location.href = 'http://127.0.0.1:5500/html/issueView.html';
                    })
                    .catch(error => console.log(error))
                }else{
                    return await response.json()
                }
            }
            else if(method === 'POST'){
                const response = await fetch(like_url, {
                    method: method,
                    headers : {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${access}`
                    },
                    body: JSON.stringify({
                        'content_type': 9,
                        'object_id': issue_id
                    })
                })
                
                if(!response.ok){
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        postLike();
                    })
                    .catch(error => console.log(error))
                }else{
                    return await response.json()
                }
            }
            else if(method === 'DELETE'){
                const response = await fetch(`${like_url+globalThis.like_id}/`, {
                    method: method,
                    headers : {
                        Authorization: `JWT ${access}`
                    }
                })
                
                if(response.status === 204){
                    loadLikesAndDislikes();
                }else{
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        deleteLike();
                    })
                    .catch(error => console.log(error))
                }
            }
        }
    }
    catch(error){
        console.log(error)
    }
}
// --------------------------------------------------------------------------------------


// -------------------------------- FOR FETCHING LIKES ----------------------------------
async function fetchDislikes(access, method=null){
    try{
        let issue_id = localStorage.getItem('issueID');
        if(issue_id){
            if(!method){
                const response = await fetch(dislikes_url+issue_id, {
                    headers : {
                        Authorization: `JWT ${access}`
                    }
                })
                
                if(!response.ok){
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        window.location.href = 'http://127.0.0.1:5500/html/issueView.html';
                    })
                    .catch(error => console.log(error))
                }else{
                    return await response.json()
                }
            }
            else if(method === 'POST'){
                const response = await fetch(dislike_url, {
                    method: method,
                    headers : {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${access}`
                    },
                    body: JSON.stringify({
                        'content_type': 9,
                        'object_id': issue_id
                    })
                })
                
                if(!response.ok){
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        postDislike();
                    })
                    .catch(error => console.log(error))
                }else{
                    return await response.json()
                }
            }
            else if(method === 'DELETE'){
                const response = await fetch(`${dislike_url+globalThis.dislike_id}/`, {
                    method: method,
                    headers : {
                        Authorization: `JWT ${access}`
                    }
                })
                
                if(response.status === 204){
                    loadLikesAndDislikes();
                }else{
                    fetchAccess()
                    .then(data => {
                        localStorage.setItem('access', data.access);
                        deleteDislike();
                    })
                    .catch(error => console.log(error))
                }
            }
        }
    }
    catch(error){
        console.log(error)
    }
}
// --------------------------------------------------------------------------------------


// ---------------------------- FOR DISPLAYING LIKES COUNT ------------------------------
function displayLikesAndDislikes(likes_data, dislikes_data){
    if(likes_data){
        // display number of likes
        document.getElementById('nummberOfLikesIssues').textContent = likes_data.count;
        
        let user_id = localStorage.getItem('user_id')
        // fill like-btn if user already liked the issue
        for(i = 0;i < likes_data.results.length;i++){
            if(user_id){
                if(likes_data.results[i].user_id === parseInt(user_id)){
                    document.getElementById('like-btn').setAttribute('class', 'bi bi-hand-thumbs-up-fill liking-btn');
                    globalThis.like_id = likes_data.results[i].id;
                }
            }else{
                window.location.href = 'http://127.0.0.1:5500/html/issueView.html'
            }
        }

        // fill dislike-btn if user already disliked the issue
        for(i = 0;i < dislikes_data.results.length;i++){
            if(user_id){
                if(dislikes_data.results[i].user_id === parseInt(user_id)){
                    document.getElementById('dislike-btn').setAttribute('class', 'bi bi-hand-thumbs-down-fill liking-btn');
                    globalThis.dislike_id = dislikes_data.results[i].id;
                }
            }else{
                window.location.href = 'http://127.0.0.1:5500/html/issueView.html'
            }
        }
        
        // set up onclick on like and dislike btn
        document.getElementById('like-btn').setAttribute('onclick', `likeOrDislikeIssue('like')`);
        document.getElementById('dislike-btn').setAttribute('onclick', `likeOrDislikeIssue('dislike')`);
    }
}
// --------------------------------------------------------------------------------------


// ------------------------ FOR TOGGLING LIKE/DISLIKE BUTTON ----------------------------
function likeOrDislikeIssue(activity){
    let like_btn = document.getElementById('like-btn');
    let dislike_btn = document.getElementById('dislike-btn');

    // for toggling like
    if(activity === 'like'){
        if(like_btn.getAttribute('class') === 'bi bi-hand-thumbs-up liking-btn'){
            // delete user dislike
            if(globalThis.dislike_id && (dislike_btn.getAttribute('class') === 'bi bi-hand-thumbs-down-fill liking-btn')){
                deleteDislike();
                dislike_btn.setAttribute('class', 'bi bi-hand-thumbs-down liking-btn');
            }
            // post a like
            postLike();
            like_btn.setAttribute('class', 'bi bi-hand-thumbs-up-fill liking-btn');
        }
        else if(like_btn.getAttribute('class') === 'bi bi-hand-thumbs-up-fill liking-btn'){
            // delete a like
            deleteLike();
            like_btn.setAttribute('class', 'bi bi-hand-thumbs-up liking-btn');
        }
    }
    // for toggling dislike
    else if(activity === 'dislike'){
        if(dislike_btn.getAttribute('class') === 'bi bi-hand-thumbs-down liking-btn'){
            // delete user like
            if(globalThis.like_id && (like_btn.getAttribute('class') === 'bi bi-hand-thumbs-up-fill liking-btn')){
                deleteLike();
                like_btn.setAttribute('class', 'bi bi-hand-thumbs-up liking-btn')
            }
            // post a dislike
            postDislike();
            dislike_btn.setAttribute('class', 'bi bi-hand-thumbs-down-fill liking-btn');
        }
        else if(dislike_btn.getAttribute('class') === 'bi bi-hand-thumbs-down-fill liking-btn'){
            // delete a like
            deleteDislike();
            dislike_btn.setAttribute('class', 'bi bi-hand-thumbs-down liking-btn');
        }
    }
}
// --------------------------------------------------------------------------------------


// ------------------------------- FOR POSTING A LIKE -----------------------------------
function postLike(){
    let access = localStorage.getItem('access');

    if(access){
        // fetch likes data
        fetchLikes(access, method='POST')
        .then(like_data => {
            loadLikesAndDislikes();
        })
        .catch(error => console.log(error))
    }else{
        loadLoginPrompts();
    }
}
// --------------------------------------------------------------------------------------


// ------------------------------- FOR DELETE A LIKE ------------------------------------
function deleteLike(){
    let access = localStorage.getItem('access');

    if(access){
        // fetch likes data
        fetchLikes(access, method='DELETE')
        .catch(error => console.log(error))
    }else{
        loadLoginPrompts();
    }
}
// --------------------------------------------------------------------------------------


// ------------------------------ FOR POSTING A DISLIKE ---------------------------------
function postDislike(){
    let access = localStorage.getItem('access');

    if(access){
        // fetch likes data
        fetchDislikes(access, method='POST')
        .then(dislike_data => {
            loadLikesAndDislikes();
        })
        .catch(error => console.log(error))
    }else{
        loadLoginPrompts();
    }
}
// --------------------------------------------------------------------------------------


// ----------------------------- FOR DELETE A DISLIKE -----------------------------------
function deleteDislike(){
    let access = localStorage.getItem('access');

    if(access){
        // fetch likes data
        fetchDislikes(access, method='DELETE')
        .catch(error => console.log(error))
    }else{
        loadLoginPrompts();
    }
}
// --------------------------------------------------------------------------------------


// ---------------------------- IF USER IS NOT LOGGED IN --------------------------------
function loadLoginPrompts(){
    document.getElementById('like-btn').setAttribute('onclick', 'login()');
    document.getElementById('dislike-btn').setAttribute('onclick', 'login()');
}

function login(){
    document.getElementById('login-btn').click();
}
// --------------------------------------------------------------------------------------
