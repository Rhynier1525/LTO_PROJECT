const sections = {
    dashboard: document.getElementById('dashboard'),
    claimStatus: document.getElementById('claimStatus'),
    plateLookup: document.getElementById('plateLookup'),
    stockManagement: document.getElementById('stockManagement'),
    bulkUpload: document.getElementById('bulkUpload'),
    notifications: document.getElementById('notifications')
};

window.onload = function() {
    const loggedInAdmin = localStorage.getItem('loggedInAdmin');
    if (loggedInAdmin) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainDashboard').classList.remove('hidden');
        document.getElementById('adminName').textContent = `Good morning, ${loggedInAdmin}!`;
        document.getElementById('backgroundImage').classList.add('hidden');
        fetchDashboardData(); // Fetch initial dashboard data
        setInterval(fetchDashboardData, 5000); // Update every 5 seconds
        loadRecentActivity(); // Load recent activity on page load
    }
};

function fetchDashboardData() {
    // Simulated API call to fetch dashboard data
    const pendingClaimsCount = Math.floor(Math.random() * 20); // Simulated random data
    const stockCount = Math.floor(Math.random() * 200); // Simulated random data
    const notificationCount = Math.floor(Math.random() * 10); // Simulated random data

    // Update the dashboard with the fetched data
    document.getElementById('pendingClaimsCount').textContent = pendingClaimsCount;
    document.getElementById('stockCount').textContent = stockCount;
    document.getElementById('notificationCount').textContent = notificationCount;
}

function loadRecentActivity() {
    const activityList = JSON.parse(localStorage.getItem('recentActivity')) || [];
    const activityContainer = document.getElementById('activityList');
    activityContainer.innerHTML = ''; // Clear existing activities

    activityList.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'flex items-center space-x-4';
        activityItem.innerHTML = `
            <i class="fas fa-info-circle text-blue-500 text-2xl"></i>
            <p>${activity}</p>
        `;
        activityContainer.appendChild(activityItem);
    });
}

function addActivity(activity) {
    const activityList = JSON.parse(localStorage.getItem('recentActivity')) || [];
    activityList.push(activity);
    localStorage.setItem('recentActivity', JSON.stringify(activityList));
    loadRecentActivity(); // Refresh the activity display
}

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    const storedAdmin = JSON.parse(localStorage.getItem('adminCredentials')) || {};
    if (storedAdmin[username] && storedAdmin[username] === password) {
        localStorage.setItem('loggedInAdmin', username);
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainDashboard').classList.remove('hidden');
        document.getElementById('adminName').textContent = `Good morning, ${username}!`;
        document.getElementById('backgroundImage').classList.add('hidden');
        showSection('dashboard');
        fetchDashboardData(); // Fetch initial dashboard data
        setInterval(fetchDashboardData, 5000); // Update every 5 seconds
        addActivity(`${username} logged in.`); // Log activity
    } else {
        errorMessage.textContent = 'Invalid admin credentials. Please try again.';
        errorMessage.classList.remove('hidden');
    }
});

document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInAdmin');
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('backgroundImage').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('errorMessage').classList.add('hidden');
    addActivity("User  logged out."); // Log activity
});

// Button event listeners for section navigation
document.getElementById('dashboardBtn').addEventListener('click', () => {
    showSection('dashboard');
});

document.getElementById('claimStatusBtn').addEventListener('click', () => {
    showSection('claimStatus');
    fetchClaimStatus(); // Fetch claim status data
});

document.getElementById('plateLookupBtn').addEventListener('click', () => {
    showSection('plateLookup');
    // No need to fetch data here, handled in the form submission
});

document.getElementById('stockManagementBtn').addEventListener('click', () => {
    showSection('stockManagement');
    fetchStockManagement(); // Fetch stock management data
});

document.getElementById('bulkUploadBtn').addEventListener('click', () => {
    showSection('bulkUpload');
    fetchBulkUpload(); // Fetch bulk upload data
});

document.getElementById('notificationsBtn').addEventListener('click', () => {
    showSection('notifications');
    fetchNotifications(); // Fetch notifications data
});

// Function to show the selected section
function showSection(section) {
    Object.values(sections).forEach(s => s.classList.add('hidden'));
    sections[section].classList.remove('hidden');
}

// Fetch Claim Status Data
function fetchClaimStatus() {
    fetch("claim_status.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#claimStatus tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="p-2">${item.plate_number}</td>
                    <td class="p-2">${item.owner}</td>
                    <td class="p-2">
                        <select class="border p-1 rounded">
                            <option ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option ${item.status === 'Claimed' ? 'selected' : ''}>Claimed</option>
                            <option ${item.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
                        </select>
                    </td>
                    <td class="p-2">
                        <button class="bg-red-500 text-white p-1 rounded">Update</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching claim status:", error));
}

// Fetch Stock Management Data
function fetchStockManagement() {
    fetch("stock_management.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#stockManagement tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="p-2">${item.plate_number}</td>
                    <td class="p-2">${item.status}</td>
                    <td class="p-2">
                        <button class="bg-red-500 text-white p-1 rounded">Mark as Claimed</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching stock management:", error));
}

// Fetch Bulk Upload Data
function fetchBulkUpload() {
    fetch("bulk_upload.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#bulkUpload tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="p-2">${item.plate_number}</td>
                    <td class="p-2">${item.owner}</td>
                    <td class="p-2">${item.status}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching bulk upload:", error));
}

// Fetch Notifications Data
function fetchNotifications() {
    fetch("notifications.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#notifications tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="p-2">${item.type}</td>
                    <td class="p-2">${item.message}</td>
                    <td class="p-2">${item.date}</td>
                    <td class="p-2">
                        <button class="bg-red-500 text-white p-1 rounded">Resend</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching notifications:", error));
}

// Plate Lookup Functionality
document.getElementById("plateLookupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    let plateNumber = document.getElementById("plate_number").value;

    fetch("plate_lookup.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "plate_number=" + encodeURIComponent(plateNumber)
    })
    .then(response => response.json())
    .then(data => {
        let resultDiv = document.getElementById("lookupResult");
        resultDiv.innerHTML = ""; // Clear previous results
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="border-2 border-white p-4 mt-4 rounded">
                    <h3 class="font-bold">Plate Information</h3>
                    <p><strong>Plate Number:</strong> ${data.plate_number}</p>
                    <p><strong>Owner:</strong> ${data.owner}</p>
                    <p><strong>Status:</strong> ${data.status}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="text-red-500 mt-4">${data.message}</p>`;
        }
    })
    .catch(error => console.error("Error:", error));
});