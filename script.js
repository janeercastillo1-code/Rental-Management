document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const signupSection = document.getElementById("signupSection");
    
    const showSignupBtn = document.getElementById("showSignup");
    const showLoginBtn = document.getElementById("showLogin");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Toggle Form Views
    const toggleForm = (hideSection, showSection) => {
        hideSection.classList.add("hidden");
        showSection.classList.remove("hidden");
    };

    showSignupBtn.addEventListener("click", () => toggleForm(loginSection, signupSection));
    showLoginBtn.addEventListener("click", () => toggleForm(signupSection, loginSection));

    // Show/Hide Password functionality
    const passwordToggles = document.querySelectorAll(".toggle-password");
    passwordToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-target");
            const input = document.getElementById(targetId);

            if (input.type === "password") {
                input.type = "text";
                toggle.textContent = "Hide";
            } else {
                input.type = "password";
                toggle.textContent = "Show";
            }
        });
    });

    // Form Submissions
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        alert(`Sign in successful!\nWelcome back, ${email}`);
        loginForm.reset();
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const cpnumber = document.getElementById("Cpnumber").value;
        alert(`Account created successfully!\nWelcome, ${name}`);
        signupForm.reset();
    });
});