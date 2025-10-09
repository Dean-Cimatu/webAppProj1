// Main Page User Status Handler
document.addEventListener('DOMContentLoaded', function() {
    updateUserStatus();
    updateNavigation();
});

function updateUserStatus() {
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        const mainContent = document.querySelector('.main-content');
        const mainMenu = document.querySelector('#mainMenu');
        
        if (mainContent && mainMenu) {
            // Create layout container
            const layoutContainer = document.createElement('div');
            layoutContainer.className = 'game-layout';
            layoutContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 30px;
                width: 100%;
                max-width: 1000px;
                margin: 20px auto;
            `;
            
            // Create welcome panel
            const welcomePanel = document.createElement('div');
            welcomePanel.className = 'welcome-panel';
            welcomePanel.innerHTML = `
                <div class="welcome-header">
                    <h2>Welcome Back!</h2>
                    <h3>${user.username}</h3>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-label">Games Played:</span>
                        <span class="stat-value">${user.gamesPlayed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">High Score:</span>
                        <span class="stat-value">${user.highScore}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Member Since:</span>
                        <span class="stat-value">${new Date(user.registeredAt).toLocaleDateString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Last Login:</span>
                        <span class="stat-value">${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First time'}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button onclick="logout()" class="logout-btn">Logout</button>
                    <button onclick="viewProfile()" class="profile-btn">View Profile</button>
                </div>
            `;
            
            // Style the main menu for left positioning
            mainMenu.style.cssText = `
                width: 375px;
                margin: 0;
                padding: 25px;
                background: rgba(0,0,0,0.6);
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                text-align: center;
                flex-shrink: 0;
            `;
            
            // Insert layout container after title
            const title = mainContent.querySelector('#title');
            if (title) {
                // Remove mainMenu from its current position
                mainMenu.remove();
                
                // Add mainMenu and welcome panel to layout container
                layoutContainer.appendChild(mainMenu);
                layoutContainer.appendChild(welcomePanel);
                
                // Insert layout container after title
                title.insertAdjacentElement('afterend', layoutContainer);
                
                // Add CSS styles for welcome panel
                addWelcomePanelStyles();
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

function addWelcomePanelStyles() {
    // Check if styles are already added
    if (document.getElementById('welcome-panel-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'welcome-panel-styles';
    style.textContent = `
        .welcome-panel {
            width: 400px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            border: 2px solid gold;
            font-family: 'Pickyside', monospace;
        }
        
        .welcome-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid gold;
            padding-bottom: 15px;
        }
        
        .welcome-header h2 {
            color: gold;
            font-size: 1.8em;
            margin: 0 0 5px 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .welcome-header h3 {
            color: white;
            font-size: 1.4em;
            margin: 0;
            font-weight: bold;
        }
        
        .player-stats {
            margin: 20px 0;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .stat-item:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            color: white;
            font-weight: bold;
        }
        
        .stat-value {
            color: gold;
            font-weight: bold;
            font-size: 1.1em;
        }
        
        .user-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid gold;
        }
        
        .logout-btn, .profile-btn {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 7.5px;
            cursor: pointer;
            font-family: 'Pickyside', monospace;
            font-weight: bold;
            transition: all 0.2s;
            font-size: 0.9em;
        }
        
        .logout-btn {
            background: maroon;
            color: gold;
            border: 2px solid gold;
        }
        
        .logout-btn:hover {
            background: gold;
            color: maroon;
            transform: translateY(-2px);
        }
        
        .profile-btn {
            background: rgba(70, 130, 180, 0.8);
            color: white;
            border: 2px solid white;
        }
        
        .profile-btn:hover {
            background: white;
            color: steelblue;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .game-layout {
                flex-direction: column !important;
                align-items: center !important;
            }
            
            .welcome-panel {
                width: 375px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

function viewProfile() {
    // Placeholder for future profile page
    alert('Profile page coming soon!');
}

// Make functions globally available
window.logout = logout;
window.viewProfile = viewProfile;