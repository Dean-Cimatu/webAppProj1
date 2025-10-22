document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('#registerForm form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                dateOfBirth: document.getElementById('DateOfBirth').value
            };
            
            const result = auth.register(formData);
            
            displayMessage(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                registerForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
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
    
    const form = document.querySelector('#registerForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}