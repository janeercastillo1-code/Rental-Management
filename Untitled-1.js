document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (event) => {
        // Prevent actual form submission from refreshing the page
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Basic frontend validation check simulation
        if (email && password) {
            alert(`Simulated Login Successful!\nWelcome, ${email}`);
            
            // You can clear the form if desired
            loginForm.reset();
        } else {
            alert("Please fill in all fields.");
        }
    });
});