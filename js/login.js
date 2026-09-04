// Interactive script for Login Page

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = emailInput?.value.trim();
            const password = passwordInput?.value.trim();

            if (!email || !password) {
                alert('Please fill in both Email and Password fields.');
                return;
            }

            // Simple demo login action -> redirect to index.html
            window.location.href = 'index.html';
        });
    }
});
