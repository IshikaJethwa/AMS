function downloadVisitorsReport() {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();

    // Fetch visitor data using AJAX
    fetch('http://localhost:62416/api/Visitor')
        .then(response => response.json())
        .then(data => {
            // Filter data based on the date range
            const filteredData = data.filter(visitor => {
                return visitor.EnteringTime >= startDate && visitor.EnteringTime <= endDate;
            });

            // Create a data table
            const table = document.createElement('table');
            table.className = 'table table-borderless table-striped table-earning';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Visitor Name</th>
                        <th>Contact Number</th>
                        <th>Whom To Visit</th>
                        <th>Unit No.</th>
                        <th>Reason</th>
                        <th>Entering Time</th>
                        <th>Outing Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredData.map((visitor, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${visitor.VisitorName}</td>
                            <td>${visitor.MobileNumber}</td>
                            <td>${visitor.WhomToMeet}</td>
                            <td>${visitor.ApartmentNo}</td>
                            <td>${visitor.ReasonToMeet}</td>
                            <td>${visitor.EnteringTime}</td>
                            <td>${visitor.OutingTime}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            // Create a new window with a document containing the table
            const newWindow = window.open();
            newWindow.document.write('<html><head><title>Visitor Report</title>');
            // Include the necessary stylesheets
            newWindow.document.write('<link rel="stylesheet" href="../vendor/bootstrap-4.1/bootstrap.min.css">');
            newWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">');
            newWindow.document.write('<link rel="stylesheet" href="../vendor/css-hamburgers/hamburgers.min.css">');
            newWindow.document.write('<link rel="stylesheet" href="../css/theme.css">');
            newWindow.document.write('</head><body>');
            // Append the table to the body
            newWindow.document.write('<h2>Visitor Report</h2>');
            newWindow.document.write(table.outerHTML);
            newWindow.document.write('</body></html>');
            newWindow.document.close();

            // Trigger the print function
            newWindow.print();
        })
        .catch(error => console.error('Error fetching visitor data:', error));
}

// Fetch and include sidebar content
fetch('../includes/sidebarAdmin.html')
    .then(response => response.text())
    .then(data => document.getElementById('sidebar-container').innerHTML = data);

// Fetch and include header content
fetch('../includes/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
        var menu = $('.js-item-menu');
        var sub_menu_is_showed = -1;

        for (var i = 0; i < menu.length; i++) {
            $(menu[i]).on('click', function (e) {
                e.preventDefault();
                $('.js-right-sidebar').removeClass("show-sidebar");
                if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
                    $(this).toggleClass('show-dropdown');
                    sub_menu_is_showed = -1;
                }
                else {
                    for (var i = 0; i < menu.length; i++) {
                        $(menu[i]).removeClass("show-dropdown");
                    }
                    $(this).toggleClass('show-dropdown');
                    sub_menu_is_showed = jQuery.inArray(this, menu);
                }
            });
        }
        $(".js-item-menu, .js-dropdown").click(function (event) {
            event.stopPropagation();
        });

        var userDataString = sessionStorage.getItem('user');


        // Step 2: Parse the JSON string to get the user data as an object
        var userData = userDataString ? JSON.parse(userDataString) : null;

        // Step 3: Update the content of the header dynamically if userData is not null
        if (userData) {

            document.getElementById('adminNameLink').textContent = userData.username;
            document.getElementById('adminNameDropdown').textContent = userData.username;
        } else {
            console.error('User data is missing or invalid.');
        }
    });

document.addEventListener('DOMContentLoaded', function () {
    // Fetch visitor data using AJAX
    fetchVisitorData();
});

function filterReport() {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();

    // Fetch all visitor data
    fetchVisitorData(function (allData) {
        // Filter the data based on the date range
        var filteredData = allData.filter(function (visitor) {
            return visitor.EnteringTime >= startDate && visitor.EnteringTime <= endDate;
        });

        // Display the filtered data in the table
        displayVisitors(filteredData);
    });
}

function fetchVisitorData(callback) {
    // Make an AJAX call to your API endpoint for fetching visitor data
    $.ajax({
        url: 'http://localhost:62416/api/Visitor',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Check if the callback is a function before calling it
            if (typeof callback === 'function') {
                // Call the provided callback function with the fetched data
                callback(data);
            } else {
                console.error('Callback is not a function.');
            }
        },
        error: function (error) {
            console.error('Error fetching visitor data:', error);
            // Handle error as needed
        }
    });
}

// Initial fetch and display without filtering
fetchVisitorData(function (allData) {
    displayVisitors(allData);
});

function displayVisitors(visitorData) {
    const tableBody = document.querySelector('.table-earning tbody');
    tableBody.innerHTML = '';

    // Loop through the fetched data and append rows to the table
    visitorData.forEach(function (visitor, index) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${visitor.VisitorName}</td>
        <td>${visitor.MobileNumber}</td>
        <td>${visitor.WhomToMeet}</td>
        <td>${visitor.ApartmentNo}</td>

        `;
        tableBody.appendChild(row);
    });
}