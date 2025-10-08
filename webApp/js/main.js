// Main Page User Status Handler
document.addEventListener('DOMContentLoaded', function() {
    updateUserStatus();
    updateNavigation();
});

function updateUserStatus() {
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            // Create welcome message
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'user-status';
            welcomeDiv.innerHTML = `
                <div style="
                    background: rgba(0, 128, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 10px;
                    margin: 10px 0;
                    text-align: center;
                    font-family: 'Pickyside', monospace;
                ">
                    <p><strong>Welcome, ${user.username}!</strong></p>
                    <p>Games Played: ${user.gamesPlayed} | High Score: ${user.highScore}</p>
                    <button onclick="logout()" style="
                        background: maroon;
                        color: gold;
                        border: 1px solid gold;
                        padding: 5px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: 'Pickyside', monospace;
                        margin-top: 5px;
                    ">Logout</button>
                </div>
            `;
            
            // Insert after title
            const title = mainContent.querySelector('#title');
            if (title) {
                title.insertAdjacentElement('afterend', welcomeDiv);
            }
        }
    }
}

function updateNavigation() {
    const topNav = document.getElementById('topNav');
    if (!topNav) return;
    
    if (auth.isLoggedIn()) {
        // Hide register/login buttons if logged in
        const registerBtn = topNav.querySelector('a[href*="register"]');
        const loginBtn = topNav.querySelector('a[href*="login"]');
        
        if (registerBtn) registerBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
    }
}

function logout() {
    const result = auth.logout();
    if (result.success) {
        // Reload page to update UI
        window.location.reload();
    }
}

// Make logout function globally available
window.logout = logout;