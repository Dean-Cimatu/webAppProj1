document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('#registerForm form');
    // Enforce client-side 13+ by setting max attribute to today - 13 years and requiring DOB
    const dobInput = document.getElementById('DateOfBirth');
    if (dobInput) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        
        dobInput.max = maxDate.toISOString().split('T')[0];
        dobInput.min = minDate.toISOString().split('T')[0];
        dobInput.required = true;
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                dateOfBirth: document.getElementById('DateOfBirth').value
            };

            // Client-side age validation (mirrors server-side auth)
            const dobStr = formData.dateOfBirth;
            if (!dobStr) {
                displayMessage('Date of birth is required.', 'error');
                return;
            }
            const dob = new Date(dobStr);
            if (isNaN(dob.getTime())) {
                displayMessage('Please enter a valid date of birth.', 'error');
                return;
            }
            const today = new Date();
            
            // Prevent future dates
            if (dob > today) {
                displayMessage('Date of birth cannot be in the future.', 'error');
                return;
            }
            
            // Calculate age threshold (must be at least 13 years old)
            const threshold = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
            if (dob > threshold) {
                displayMessage('You must be at least 13 years old to register.', 'error');
                return;
            }
            
            // Sanity check: prevent unrealistic ages
            const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
            if (dob < maxAge) {
                displayMessage('Please enter a valid date of birth.', 'error');
                return;
            }
            
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