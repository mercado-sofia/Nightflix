document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // Function to display messages
    const showMessage = (message, type) => {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${type}`; // Add class for styling based on type (success, error)
        messageContainer.textContent = message;

        document.body.prepend(messageContainer); // Add the message at the top of the body

        // Automatically remove the message after 3 seconds
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    };

    // For signup.html
    if (currentPath.includes('signup.html')) {
        const signupForm = document.getElementById('signup-form');

        signupForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();

            if (!name || !email || !password) {
                showMessage('All fields are required.', 'error');
                return;
            }

            // Retrieve existing users from localStorage
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = storedUsers.some((user) => user.email === email);

            if (userExists) {
                showMessage('This email is already registered. Redirecting to login...', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login
                }, 2000); // Wait 2 seconds before redirect
            } else {
                // Save new user
                storedUsers.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(storedUsers));
                showMessage('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login
                }, 2000); // Wait 2 seconds before redirect
            }
        });
    }

    // For login.html
    if (currentPath.includes('login.html')) {
        const loginForm = document.getElementById('login-form');

        loginForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!email || !password) {
                showMessage('Both email and password are required.', 'error');
                return;
            }

            // Retrieve users from localStorage
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = storedUsers.find((user) => user.email === email && user.password === password);

            if (user) {
                // Redirect without a welcome message
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to main page
                }, 2000); // Wait 2 seconds before redirect
            } else {
                showMessage('Invalid email or password. Please try again.', 'error');
            }
        });
    }
});
