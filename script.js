<script>
    const sections = {
        dashboard: document.getElementById('dashboard'),
        claimStatus: document.getElementById('claimStatus'),
        plateLookup: document.getElementById('plateLookupForm'),
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
            updateDashboard(); // Fetch and display real-time data
        }
    };

    function fetchRealTimeData() {
        // Simulate an API call to get real-time data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    pendingClaims: 10,
                    stockStatus: 150,
                    recentNotifications: 3,
                    recentActivity: [
                        { message: "Dealer ABC just updated 20 plates to ‘Ready for Pickup’", type: "success" },
                        { message: "New batch of plates arrived for processing.", type: "info" },
                        { message: "Reminder: 3 plates overdue for claiming.", type: "warning" }
                    ]
                });
            }, 1000); // Simulate network delay
        });
    }

    function updateDashboard() {
        fetchRealTimeData().then(data => {
            document.querySelector('#dashboard .bg-gradient-to-r:nth-child(1) p:nth-child(2)').textContent = data.pendingClaims;
            document.querySelector('#dashboard .bg-gradient-to-r:nth-child(2) p:nth-child(2)').textContent = data.stockStatus;
            document.querySelector('#dashboard .bg-gradient-to-r:nth-child(3) p:nth-child(2)').textContent = data.recentNotifications;

            const activityContainer = document.createElement('div');
            activityContainer.className = 'space-y-4 recent-activity'; // Add a class for styling
            data.recentActivity.forEach(activity => {
                const activityDiv = document.createElement('div');
                activityDiv.className = 'flex items-center space-x-4';
                activityDiv.innerHTML = `
                    <i class="fas fa-${activity.type === 'success' ? 'check-circle text-green-500' : activity.type === 'info' ? 'truck text-blue-500' : 'exclamation-circle text-red-500'} text-2xl"></i>
                    <p>${activity.message}</p>
                `;
                activityContainer.appendChild(activityDiv);
            });

            // Append the activity container to the dashboard
            const recentActivitySection = document.querySelector('.recent-activity-section'); // Ensure you have a section for recent activity
            recentActivitySection.innerHTML = ''; // Clear previous activity
            recentActivitySection.appendChild(activityContainer);
        });
    }

    // Quick Actions functionality
    document.querySelectorAll('.quick-action button').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            switch (action) {
                case 'Mark All Pending Claims as Followed-Up':
                    alert('All pending claims have been marked as followed-up.');
                    break;
                case 'Send Bulk Notifications':
                    alert('Bulk notifications have been sent.');
                    break;
                case 'Generate Report':
                    alert('Report has been generated.');
                    break;
                case 'View Today\'s Appointments':
                    alert('Viewing today\'s appointments.');
                    break;
            }
        });
    });

    document.getElementById('loginBtn').addEventListener('click', () => {
        const role = document.getElementById('userRole').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        if (role === 'customer') {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainDashboard').classList.remove('hidden');
            document.getElementById('adminName').textContent = `Welcome, valued customer!`;
            document.getElementById('backgroundImage').classList.add('hidden');
            showSection('dashboard');
        } else if (role === 'admin') {
            const storedAdmin = JSON.parse(localStorage.getItem('adminCredentials')) || {};
            if (storedAdmin[username] && storedAdmin[username] === password) {
                localStorage.setItem('loggedInAdmin', username);
                document.getElementById('loginPage').classList.add('hidden');
                document.getElementById('mainDashboard').classList.remove('hidden');
                document.getElementById('adminName').textContent = `Good morning, ${username}!`;
                document.getElementById('backgroundImage').classList.add('hidden');
                showSection('dashboard');
                updateDashboard(); // Fetch and display real-time data
            } else {
                errorMessage.textContent = 'Invalid admin credentials. Please try again.';
                errorMessage.classList.remove('hidden');
            }
            if (!storedAdmin[username]) {
                storedAdmin[username] = password;
                localStorage.setItem('adminCredentials', JSON.stringify(storedAdmin));
            }
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
    });

    document.getElementById('dashboardBtn').addEventListener('click', () => showSection('dashboard'));
    document.getElementById('claimStatusBtn').addEventListener('click', () => showSection('claimStatus'));
    document.getElementById('plateLookupBtn').addEventListener('click', () => showSection('plateLookup'));
    document.getElementById('stockManagementBtn').addEventListener('click', () => showSection('stockManagement'));
    document.getElementById('bulkUploadBtn').addEventListener('click', () => showSection('bulkUpload'));
    document.getElementById('notificationsBtn').addEventListener('click', () => showSection('notifications'));

    function showSection(section) {
        Object.values(sections).forEach(s => s.classList.add('hidden'));
        if (section === 'plateLookup') {
            document.getElementById('lookupResult').innerHTML = ''; // Clear previous results
        }
        sections[section].classList.remove('hidden');
    }

    // Plate Lookup Functionality
    document.getElementById("plateLookupForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let plateNumber = document.getElementById("plate_number").value;

        fetch("plate_lookup.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "plate_number=" + encodeURIComponent(plateNumber)
        })
        .then(response => response.json())
        .then(data => {
            let resultDiv = document.getElementById("lookupResult");
            if (data.success) {
                resultDiv.innerHTML = `
                    <div class="border-2 border-gray-300 p-4 mt-4 rounded">
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
</script>