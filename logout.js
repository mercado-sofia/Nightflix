// logout.js
document.addEventListener('DOMContentLoaded', function() {
document.querySelector('.logout').addEventListener('click', function(e) {
    e.preventDefault();  // Prevent default behavior of the link or button
    
    // Clear session or cookies if necessary
    // Example of clearing localStorage if you're storing user data there:
    localStorage.removeItem('userToken');  // Adjust this based on how you're handling sessions
    
    // Log out action (could be logging to the console or any other logic)
    console.log('Logged out');

    // Hide the sign-up button after logout
    const signUpButton = document.querySelector('signup');  // Select the sign-up button
    if (signUpButton) {
        signUpButton.style.display = 'none';  // Hide the sign-up button
    }
    
    // Redirect to login page or home page after logging out
    window.location.href = 'login.html';  // Change this if needed (e.g., redirect to homepage)
});
});
