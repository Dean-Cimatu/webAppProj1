document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#loginForm form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = auth.login(username, password);
            
            displayMessage(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                loginForm.reset();
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        });
    }
    
    if (auth.isLoggedIn()) {
        const currentUser = auth.getCurrentUser();
        displayMessage(`Welcome back, ${currentUser.username}! Redirecting to home...`, 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
});

function displayMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        padding: 10px 15px;
        margin: 10px 0;
        border-radius: 5px;
        font-family: 'Pickyside', monospace;
        font-weight: bold;
        text-align: center;
        ${type === 'success' ? 'background: rgba(0, 128, 0, 0.8); color: white;' : ''}
        ${type === 'error' ? 'background: rgba(220, 20, 60, 0.8); color: white;' : ''}
        ${type === 'info' ? 'background: rgba(70, 130, 180, 0.8); color: white;' : ''}
    `;
    
    const form = document.querySelector('#loginForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}