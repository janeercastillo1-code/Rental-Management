// ========================================
// RENTFLOW LOGIN JAVASCRIPT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // GET HTML ELEMENTS
    // ========================================

    const form = document.getElementById("loginForm");

    const emailField = document.getElementById("emailField");
    const pwField = document.getElementById("pwField");

    const emailInput = document.getElementById("email");
    const pwInput = document.getElementById("password");

    const togglePw = document.getElementById("togglePw");
    const statusBanner = document.getElementById("statusBanner");

    const googleBtn = document.getElementById("googleBtn");
    const githubBtn = document.getElementById("githubBtn");


    // ========================================
    // CHECK LOGIN FORM
    // ========================================

    if (!form) {
        console.error("RentFlow: loginForm not found.");
        return;
    }

    if (!emailInput || !pwInput) {
        console.error("RentFlow: email or password input not found.");
        return;
    }


    // ========================================
    // ADMIN ACCOUNT
    // ========================================

    const ADMIN_EMAIL = "admin@rentflow.com";
    const ADMIN_PASSWORD = "admin123";


    // ========================================
    // SHOW / HIDE PASSWORD
    // ========================================

    if (togglePw) {

        togglePw.addEventListener("click", function () {

            if (pwInput.type === "password") {

                pwInput.type = "text";
                togglePw.textContent = "Hide";

            } else {

                pwInput.type = "password";
                togglePw.textContent = "Show";

            }

        });

    }


    // ========================================
    // EMAIL VALIDATION
    // ========================================

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    // ========================================
    // SET ERROR
    // ========================================

    function setError(element, hasError) {

        if (!element) {
            return;
        }

        element.classList.toggle("error", hasError);

    }


    // ========================================
    // SHOW MESSAGE
    // ========================================

    function showMessage(message) {

        if (!statusBanner) {
            return;
        }

        statusBanner.textContent = message;
        statusBanner.classList.add("show");

    }


    // ========================================
    // HIDE MESSAGE
    // ========================================

    function hideMessage() {

        if (!statusBanner) {
            return;
        }

        statusBanner.textContent = "";
        statusBanner.classList.remove("show");

    }


    // ========================================
    // CLEAR SESSION
    // ========================================

    function clearSession() {

        localStorage.removeItem("rentflow_user_email");
        localStorage.removeItem("rentflow_user_role");
        localStorage.removeItem("rentflow_logged_in");

    }


    // ========================================
    // SAVE SESSION
    // ========================================

    function saveSession(email, role) {

        localStorage.setItem(
            "rentflow_user_email",
            email
        );

        localStorage.setItem(
            "rentflow_user_role",
            role
        );

        localStorage.setItem(
            "rentflow_logged_in",
            "true"
        );

    }


    // ========================================
    // EMAIL LIVE VALIDATION
    // ========================================

    emailInput.addEventListener("input", function () {

        const email = emailInput.value.trim();

        if (isValidEmail(email)) {

            setError(
                emailField,
                false
            );

        }

    });


    // ========================================
    // PASSWORD LIVE VALIDATION
    // ========================================

    pwInput.addEventListener("input", function () {

        if (pwInput.value.length >= 8) {

            setError(
                pwField,
                false
            );

        }

    });


    // ========================================
    // LOGIN
    // ========================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        hideMessage();


        // ====================================
        // GET VALUES
        // ====================================

        const email = emailInput.value
            .trim()
            .toLowerCase();

        const password = pwInput.value;


        console.log("================================");
        console.log("RentFlow Login");
        console.log("Email:", email);
        console.log("================================");


        // ====================================
        // VALIDATE EMAIL
        // ====================================

        if (!isValidEmail(email)) {

            setError(
                emailField,
                true
            );

            showMessage(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;

        }

        setError(
            emailField,
            false
        );


        // ====================================
        // VALIDATE PASSWORD
        // ====================================

        if (password.length < 8) {

            setError(
                pwField,
                true
            );

            showMessage(
                "Password must be at least 8 characters."
            );

            pwInput.focus();

            return;

        }

        setError(
            pwField,
            false
        );


        // ====================================
        // CLEAR OLD SESSION
        // ====================================

        clearSession();


        // ====================================
        // ADMIN LOGIN
        // ====================================

        if (email === ADMIN_EMAIL) {

            console.log("Admin email detected.");

            // Check admin password

            if (password !== ADMIN_PASSWORD) {

                console.error(
                    "Incorrect admin password."
                );

                setError(
                    pwField,
                    true
                );

                showMessage(
                    "Incorrect admin password. Use admin123 for the demo admin account."
                );

                pwInput.focus();

                return;

            }


            // =================================
            // ADMIN AUTHENTICATED
            // =================================

            saveSession(
                ADMIN_EMAIL,
                "admin"
            );

            console.log(
                "ADMIN LOGIN SUCCESS"
            );

            console.log(
                "Redirecting to admindashboard.html"
            );


            showMessage(
                "Admin login successful. Opening admin dashboard..."
            );


            // Give browser time to display message

            setTimeout(function () {

                window.location.assign(
                    "admindashboard.html"
                );

            }, 500);


            return;

        }


        // ====================================
        // CLIENT LOGIN
        // ====================================

        console.log(
            "Client login detected."
        );


        saveSession(
            email,
            "client"
        );


        console.log(
            "CLIENT LOGIN SUCCESS"
        );

        console.log(
            "Client email:",
            email
        );


        showMessage(
            "Login successful. Opening your dashboard..."
        );


        setTimeout(function () {

            window.location.assign(
                "dashboard.html"
            );

        }, 500);

    });


    // ========================================
    // GOOGLE LOGIN
    // ========================================

    if (googleBtn) {

        googleBtn.addEventListener(
            "click",
            function () {

                showMessage(
                    "Google sign-in is not connected yet."
                );

            }
        );

    }


    // ========================================
    // GITHUB LOGIN
    // ========================================

    if (githubBtn) {

        githubBtn.addEventListener(
            "click",
            function () {

                showMessage(
                    "GitHub sign-in is not connected yet."
                );

            }
        );

    }


    // ========================================
    // DEBUG INFORMATION
    // ========================================

    console.log(
        "RentFlow login JavaScript loaded."
    );

    console.log(
        "Admin email:",
        ADMIN_EMAIL
    );

});