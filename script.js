document.addEventListener("DOMContentLoaded", () => {
    const authContainer = document.getElementById("authContainer");
    const fullDashboard = document.getElementById("fullDashboard");
    const loginSection = document.getElementById("loginSection");
    const signupSection = document.getElementById("signupSection");
    
    const showSignupBtn = document.getElementById("showSignup");
    const showLoginBtn = document.getElementById("showLogin");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeUser = document.getElementById("welcomeUser");
    const tabTitle = document.getElementById("tabTitle");

    // Modal elements
    const actionModal = document.getElementById("actionModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalInput = document.getElementById("modalInput");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const saveModalBtn = document.getElementById("saveModalBtn");

    let currentTargetList = null;
    let editingElement = null;

    // Toggle Form Views inside Auth Card
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

    // Enter Full Dashboard Mode
    const openDashboard = (userName) => {
        authContainer.classList.add("hidden");
        fullDashboard.classList.remove("hidden");
        document.body.classList.remove("login-mode");
        document.body.classList.add("dashboard-mode");
        welcomeUser.textContent = `Welcome back, ${userName}!`;
    };

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        if (!email) return;
        openDashboard(email.split('@')[0]);
        loginForm.reset();
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        if (!name) return;
        openDashboard(name);
        signupForm.reset();
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        fullDashboard.classList.add("hidden");
        authContainer.classList.remove("hidden");
        document.body.classList.remove("dashboard-mode");
        document.body.classList.add("login-mode");
    });

    // Sidebar Tab Navigation
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTab = button.getAttribute("data-tab");

            navButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            tabContents.forEach(content => {
                if (content.id === `${selectedTab}Tab`) {
                    content.classList.remove("hidden");
                } else {
                    content.classList.add("hidden");
                }
            });

            const titles = {
                dashboard: "Overview Dashboard",
                units: "Units Management",
                tenants: "Tenants Management",
                rentals: "Rental Agreements",
                transactions: "Transaction Records"
            };
            tabTitle.textContent = titles[selectedTab] || "Dashboard";
        });
    });

    // --- ADD / EDIT / DELETE FUNCTIONALITY --- //

    // Handle Delete & Edit button clicks inside lists
    document.addEventListener("click", (e) => {
        // Delete action
        if (e.target.classList.contains("delete-btn")) {
            const item = e.target.closest("li");
            if (confirm("Are you sure you want to delete this item?")) {
                item.remove();
            }
        }

        // Edit action
        if (e.target.classList.contains("edit-btn")) {
            const item = e.target.closest("li");
            const infoSpan = item.querySelector(".item-info");
            
            editingElement = infoSpan;
            modalTitle.textContent = "Edit Item";
            modalInput.value = infoSpan.textContent.replace("Occupied", "").replace("Vacant", "").trim();
            actionModal.classList.remove("hidden");
        }

        // Add action
        if (e.target.classList.contains("add-btn")) {
            const category = e.target.getAttribute("data-category");
            const box = e.target.closest(".content-box");
            currentTargetList = box.querySelector(".data-list");
            
            editingElement = null;
            modalTitle.textContent = `Add New ${category}`;
            modalInput.value = "";
            actionModal.classList.remove("hidden");
        }
    });

    // Modal Close
    closeModalBtn.addEventListener("click", () => {
        actionModal.classList.add("hidden");
    });

    // Modal Save (Handles both Adding & Editing)
    saveModalBtn.addEventListener("click", () => {
        const value = modalInput.value.trim();
        if (!value) return;

        if (editingElement) {
            // Updating existing item
            editingElement.childNodes[0].textContent = value + " ";
        } else if (currentTargetList) {
            // Creating new item
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="item-info">${value}</span>
                <div class="actions">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Delete</button>
                </div>
            `;
            currentTargetList.appendChild(li);
        }

        actionModal.classList.add("hidden");
    });
});