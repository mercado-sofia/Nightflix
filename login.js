document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    // Handle tab switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
    });

    // Handle link switching
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signupTab.click();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginTab.click();
    });

    // Login function
    loginForm.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        // LocalStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find((user) => user.email === email && user.password === password);

        if (user) {
            alert(`Welcome back, ${user.name}!`);
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Signup function
    signupForm.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !email || !password) {
            alert('All fields are required.');
            return;
        }

        // Kapag user exist
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = storedUsers.some((user) => user.email === email);

        if (userExists) {
            alert('This email is already registered. Please log in.');
            loginTab.click();
        } else {
            // Save new user
            storedUsers.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(storedUsers));
            alert('Account created successfully! Please log in.');
            loginTab.click();
        }
    });

    // Redirect links for navigation from navbar
    const signupNavButton = document.querySelector('.signup');
    const loginNavButton = document.querySelector('.login');

    if (signupNavButton) {
        signupNavButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html'; // Redirect to login/signup page
        });
    }

    if (loginNavButton) {
        loginNavButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html'; // Redirect to login/signup page
        });
    }
});
