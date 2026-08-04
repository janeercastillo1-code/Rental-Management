document.addEventListener("DOMContentLoaded", () => {
    // Session and Auth Elements
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
    const statusGroup = document.getElementById("statusGroup");
    const modalStatus = document.getElementById("modalStatus");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const saveModalBtn = document.getElementById("saveModalBtn");

    // Data Storage Structure (Starts empty)
    let appData = {
        properties: [],
        units: [],
        tenants: [],
        rentals: [],
        transactions: []
    };

    let activeCategoryKey = null;
    let editIndex = null;

    // Load persisted data from LocalStorage
    const loadSavedData = () => {
        const storedData = localStorage.getItem("rental_app_data");
        if (storedData) {
            try { appData = JSON.parse(storedData); } catch(e) {}
        }
        renderAllLists();
        updateStats();
    };

    const saveData = () => {
        localStorage.setItem("rental_app_data", JSON.stringify(appData));
        renderAllLists();
        updateStats();
    };

    // Calculate and update top stats automatically
    const updateStats = () => {
        document.getElementById("statProperties").textContent = appData.properties.length;
        document.getElementById("statTenants").textContent = appData.tenants.length;

        const occupiedCount = appData.properties.filter(p => p.status === "Occupied").length;
        document.getElementById("statOccupied").textContent = occupiedCount;

        // Try summing transaction amounts if numbers exist
        let totalRev = 0;
        appData.transactions.forEach(t => {
            const num = parseFloat(t.title.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) totalRev += num;
        });
        document.getElementById("statRevenue").textContent = `₱${totalRev.toLocaleString()}`;
    };

    // Render List Items dynamically
    const renderAllLists = () => {
        const keys = ['properties', 'units', 'tenants', 'rentals', 'transactions'];
        keys.forEach(key => {
            const listEl = document.getElementById(`${key}List`);
            if (!listEl) return;

            listEl.innerHTML = '';
            if (appData[key].length === 0) {
                listEl.innerHTML = `<li class="empty-state">No items added yet. Click "+ Add" above to start.</li>`;
                return;
            }

            appData[key].forEach((item, index) => {
                const li = document.createElement("li");
                
                const statusBadge = item.status 
                    ? `<em class="status ${item.status.toLowerCase()}">${item.status}</em>` 
                    : '';

                li.innerHTML = `
                    <span class="item-info">${item.title} ${statusBadge}</span>
                    <div class="actions">
                        <button class="action-btn edit-btn" data-key="${key}" data-index="${index}">Edit</button>
                        <button class="action-btn delete-btn" data-key="${key}" data-index="${index}">Delete</button>
                    </div>
                `;
                listEl.appendChild(li);
            });
        });
    };

    // Check Session on Reload
    const checkSavedSession = () => {
        const savedUser = localStorage.getItem("rental_user");
        if (savedUser) {
            openDashboard(savedUser);
        }
    };

    const toggleForm = (hideSection, showSection) => {
        hideSection.classList.add("hidden");
        showSection.classList.remove("hidden");
    };

    showSignupBtn.addEventListener("click", () => toggleForm(loginSection, signupSection));
    showLoginBtn.addEventListener("click", () => toggleForm(signupSection, loginSection));

    // Password Toggle
    document.querySelectorAll(".toggle-password").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-target");
            const input = document.getElementById(targetId);
            input.type = input.type === "password" ? "text" : "password";
            toggle.textContent = input.type === "password" ? "Show" : "Hide";
        });
    });

    const openDashboard = (userName) => {
        localStorage.setItem("rental_user", userName);
        authContainer.classList.add("hidden");
        fullDashboard.classList.remove("hidden");
        document.body.classList.remove("login-mode");
        document.body.classList.add("dashboard-mode");
        welcomeUser.textContent = `Welcome back, ${userName}!`;
        loadSavedData();
    };

    // Form Submissions with validation
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }
        const email = document.getElementById("loginEmail").value.trim();
        openDashboard(email.split('@')[0]);
        loginForm.reset();
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!signupForm.checkValidity()) {
            signupForm.reportValidity();
            return;
        }
        const name = document.getElementById("signupName").value.trim();
        openDashboard(name);
        signupForm.reset();
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("rental_user");
        fullDashboard.classList.add("hidden");
        authContainer.classList.remove("hidden");
        document.body.classList.remove("dashboard-mode");
        document.body.classList.add("login-mode");
    });

    // Sidebar Navigation
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

    // --- ADD / EDIT / DELETE LISTENERS --- //

    document.addEventListener("click", (e) => {
        // Delete Action
        if (e.target.classList.contains("delete-btn")) {
            const key = e.target.getAttribute("data-key");
            const idx = parseInt(e.target.getAttribute("data-index"));

            if (confirm("Are you sure you want to delete this item?")) {
                appData[key].splice(idx, 1);
                saveData();
            }
        }

        // Edit Action
        if (e.target.classList.contains("edit-btn")) {
            activeCategoryKey = e.target.getAttribute("data-key");
            editIndex = parseInt(e.target.getAttribute("data-index"));

            const item = appData[activeCategoryKey][editIndex];
            modalTitle.textContent = "Edit Item";
            modalInput.value = item.title;

            if (activeCategoryKey === "properties") {
                statusGroup.classList.remove("hidden");
                modalStatus.value = item.status || "Occupied";
            } else {
                statusGroup.classList.add("hidden");
            }

            actionModal.classList.remove("hidden");
        }

        // Add Action
        if (e.target.classList.contains("add-btn")) {
            activeCategoryKey = e.target.getAttribute("data-key");
            const categoryName = e.target.getAttribute("data-category");

            editIndex = null;
            modalTitle.textContent = `Add New ${categoryName}`;
            modalInput.value = "";

            if (activeCategoryKey === "properties") {
                statusGroup.classList.remove("hidden");
            } else {
                statusGroup.classList.add("hidden");
            }

            actionModal.classList.remove("hidden");
        }
    });

    closeModalBtn.addEventListener("click", () => {
        actionModal.classList.add("hidden");
    });

    saveModalBtn.addEventListener("click", () => {
        const titleVal = modalInput.value.trim();
        if (!titleVal) return;

        const newItemObj = { title: titleVal };
        if (activeCategoryKey === "properties") {
            newItemObj.status = modalStatus.value;
        }

        if (editIndex !== null) {
            // Edit existing
            appData[activeCategoryKey][editIndex] = newItemObj;
        } else {
            // Add new
            appData[activeCategoryKey].push(newItemObj);
        }

        saveData();
        actionModal.classList.add("hidden");
    });

    // Initial session check on page load
    checkSavedSession();
});