// Authentication Helper for Colosseum Fighters
class AuthHelper {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('colosseumUsers');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('colosseumUsers', JSON.stringify(this.users));
    }

    // Load current logged-in user
    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Save current user session
    saveCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user session (logout)
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        return password.length >= 6; // Minimum 6 characters
    }

    // Check if username is available
    isUsernameAvailable(username) {
        return !this.users.some(user => user.username.toLowerCase() === username.toLowerCase());
    }

    // Check if email is available
    isEmailAvailable(email) {
        return !this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Register a new user
    register(userData) {
        const { username, email, password, dateOfBirth } = userData;
        
        // Validation
        if (!username || username.trim().length < 3) {
            return { success: false, message: 'Username must be at least 3 characters long.' };
        }

        if (!this.isUsernameAvailable(username)) {
            return { success: false, message: 'Username is already taken.' };
        }

        if (!email || !this.validateEmail(email)) {
            return { success: false, message: 'Please enter a valid email address.' };
        }

        if (!this.isEmailAvailable(email)) {
            return { success: false, message: 'Email is already registered.' };
        }

        if (!password || !this.validatePassword(password)) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        // Create new user
        const newUser = {
            id: Date.now(), // Simple ID generation
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In a real app, this should be hashed
            dateOfBirth: dateOfBirth || null,
            registeredAt: new Date().toISOString(),
            lastLogin: null,
            gamesPlayed: 0,
            highScore: 0
        };

        // Add user to storage
        this.users.push(newUser);
        this.saveUsers();

        return { 
            success: true, 
            message: 'Registration successful! You can now log in.',
            user: { ...newUser, password: undefined } // Don't return password
        };
    }

    // Login user
    login(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Please enter both username and password.' };
        }

        const user = this.users.find(u => 
            (u.username.toLowerCase() === username.toLowerCase() || 
             u.email.toLowerCase() === username.toLowerCase()) &&
            u.password === password
        );

        if (!user) {
            return { success: false, message: 'Invalid username/email or password.' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        this.saveCurrentUser({ ...user, password: undefined });

        return { 
            success: true, 
            message: 'Login successful!',
            user: { ...user, password: undefined }
        };
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
        return { success: true, message: 'Logged out successfully.' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user stats (for game integration)
    updateUserStats(gamesPlayed = 0, score = 0) {
        if (!this.currentUser) return false;

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].gamesPlayed += gamesPlayed;
            if (score > this.users[userIndex].highScore) {
                this.users[userIndex].highScore = score;
            }
            this.saveUsers();
            
            // Update current user session
            this.currentUser = { ...this.users[userIndex], password: undefined };
            this.saveCurrentUser(this.currentUser);
            return true;
        }
        return false;
    }

    // Get leaderboard data
    getLeaderboard() {
        return this.users
            .map(user => ({
                username: user.username,
                highScore: user.highScore,
                gamesPlayed: user.gamesPlayed,
                registeredAt: user.registeredAt
            }))
            .sort((a, b) => b.highScore - a.highScore)
            .slice(0, 10); // Top 10 players
    }
}

// Create global instance
const auth = new AuthHelper();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthHelper;
}