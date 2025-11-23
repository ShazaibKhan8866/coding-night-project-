let users = {};
let profileName = "User";
let profilePic = "https://i.pravatar.cc/40?img=1";
let selectedAvatar = profilePic;

// Avatar options for profile
const profileAvatars = [
    "https://i.pravatar.cc/40?img=1",
    "https://i.pravatar.cc/40?img=2",
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=4",
    "https://i.pravatar.cc/40?img=5"
];

// Random avatars for posts
const postAvatars = [
    "https://i.pravatar.cc/50?img=10",
    "https://i.pravatar.cc/50?img=11",
    "https://i.pravatar.cc/50?img=12",
    "https://i.pravatar.cc/50?img=13",
    "https://i.pravatar.cc/50?img=14",
    "https://i.pravatar.cc/50?img=15"
];

// Show screens
function showLogin() { document.getElementById('signup-screen').classList.add('hidden'); document.getElementById('login-screen').classList.remove('hidden'); }
function showSignup() { document.getElementById('login-screen').classList.add('hidden'); document.getElementById('signup-screen').classList.remove('hidden'); }

// Signup
function signup() {
    let username = document.getElementById('signup-user').value.trim();
    let password = document.getElementById('signup-pass').value.trim();
    if (!username || !password) { alert('Enter username & password'); return; }
    if (users[username]) { alert('Username already exists'); return; }
    users[username] = password;
    alert('Account created! Ab login karein.');
    showLogin();
}

// Login
function login() {
    let username = document.getElementById('login-user').value.trim();
    let password = document.getElementById('login-pass').value.trim();
    if (!username || !password) { alert('Enter username & password'); return; }
    if (users[username] !== password) { alert('Invalid credentials'); return; }
    profileName = username;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    loadContent();
}

// Open/Close profile
function openProfile() {
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('profile-screen').classList.remove('hidden');
    renderAvatarOptions();
}
function closeProfile() {
    document.getElementById('profile-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
}

// Render avatar options
function renderAvatarOptions() {
    const container = document.getElementById('avatar-selection');
    container.innerHTML = "";
    profileAvatars.forEach(src => {
        let img = document.createElement('img');
        img.src = src;
        if (src === selectedAvatar) img.classList.add('selected');
        img.onclick = () => selectAvatar(src);
        container.appendChild(img);
    });
}

// Select avatar
function selectAvatar(src) {
    selectedAvatar = src;
    renderAvatarOptions();
}

// Save profile
function saveProfile() {
    profileName = document.getElementById('profile-name').value || profileName;
    profilePic = selectedAvatar;
    alert('Profile Saved!');
    closeProfile();
    loadContent();
}

// Load posts with random avatars
function loadContent() {
    let posts = document.getElementById('posts');
    posts.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
        let randomPic = `https://picsum.photos/500/300?random=${Math.floor(Math.random() * 100 + i)}`;
        let randomAvatar = postAvatars[Math.floor(Math.random() * postAvatars.length)];
        let randomName = "User" + (i + Math.floor(Math.random() * 50));
        let timestamp = Math.floor(Math.random() * 23 + 1) + "h ago";

        let postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <div class='post-header'>
                <img src="${randomAvatar}" alt="Profile Pic">
                <h4>${randomName}</h4>
                <span>${timestamp}</span>
            </div>
            <div class='post-content'>
                Ye ek random post hai number ${i}.
                <img src="${randomPic}" alt="Post Image">
            </div>
            <div class='post-actions'>
                <button class="like-btn">Like 0</button>
                <button class="comment-btn">Comment</button>
                <div class="comment-list"></div>
            </div>
        `;

        // Like button
        let likeBtn = postDiv.querySelector('.like-btn');
        let likeCount = 0;
        likeBtn.onclick = () => {
            likeCount++;
            likeBtn.textContent = `Like ${likeCount}`;
        };

        // Comment button
        let commentBtn = postDiv.querySelector('.comment-btn');
        let commentList = postDiv.querySelector('.comment-list');
        commentBtn.onclick = () => {
            let comment = prompt("Enter your comment:");
            if (comment) {
                let p = document.createElement('p');
                p.textContent = `${profileName}: ${comment}`;
                commentList.appendChild(p);
            }
        };

        posts.appendChild(postDiv);
    }
}