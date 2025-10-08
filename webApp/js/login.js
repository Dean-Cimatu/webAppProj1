// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#loginForm form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form data
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Attempt login
            const result = auth.login(username, password);
            
            // Display result
            displayMessage(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                // Clear form
                loginForm.reset();
                
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        });
    }
    
    // Check if user is already logged in
    if (auth.isLoggedIn()) {
        const currentUser = auth.getCurrentUser();
        displayMessage(`Welcome back, ${currentUser.username}! Redirecting to home...`, 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
});

// Display message function (same as register.js)
function displayMessage(message, type = 'info') {
    // Remove any existing message
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
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
    
    // Insert message at the top of the form
    const form = document.querySelector('#loginForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}