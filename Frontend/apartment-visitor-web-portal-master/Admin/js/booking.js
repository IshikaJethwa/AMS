
document.addEventListener('DOMContentLoaded', function () {
    // Fetch and include sidebar content
    fetch('../includes/sidebarAdmin.html')
        .then(response => response.text())
        .then(data => document.getElementById('sidebar-container').innerHTML = data);

    fetch('http://localhost:62416/api/User/GetAllBooking') // Adjust the API endpoint accordingly
        .then(response => response.json())
        .then(bookingData => {
            const tableBody = document.getElementById('booking-table-body');
            const currentDate = new Date();
            const filteredBookings = bookingData.filter(booking => new Date(booking.StartTime) >= currentDate);


            filteredBookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.BookingID}</td>
                    <td>${booking.User_ID}</td>
                    <td>${booking.PropertyName}</td>
                    <td>${booking.Purpose}</td>
                    <td>${booking.Amount}</td>
                    <td>${booking.StartTime}</td>
                    <td>${booking.EndTime}</td>
                    <td>${booking.TransactionID}</td>
                   
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
            // Handle the error, display a message, or perform other actions as needed
        });
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


});

function filterByDateRange() {
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    // Parse the selected dates to JavaScript Date objects
    var parsedStartDate = new Date(startDate);
    var parsedEndDate = new Date(endDate);

    if (parsedStartDate > parsedEndDate) {
        alert('Start date cannot be later than end date.');
        return;
    }

    // Fetch the booking data
    fetch('http://localhost:62416/api/User/GetAllBooking') // Adjust the API endpoint accordingly
        .then(response => response.json())
        .then(bookingData => {
            const tableBody = document.getElementById('booking-table-body');
            tableBody.innerHTML = ''; // Clear existing rows

            const filteredBookings = bookingData.filter(booking => {
                const bookingDate = new Date(booking.StartTime);
                return bookingDate >= parsedStartDate && bookingDate <= parsedEndDate;
            });

            filteredBookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.BookingID}</td>
                    <td>${booking.User_ID}</td>
                    <td>${booking.PropertyName}</td>
                    <td>${booking.Purpose}</td>
                    <td>${booking.Amount}</td>
                    <td>${booking.StartTime}</td>
                    <td>${booking.EndTime}</td>
                    <td>${booking.TransactionID}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
            // Handle the error, display a message, or perform other actions as needed
        });
}

function openAddBookingModal() {
    // Redirect to AddBooking.html or implement modal logic
    window.location.href = 'add-booking.html';
}
function downloadBookingReport() {
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    var url = 'http://localhost:62416/api/User/GetAllBooking';  // Adjust the API endpoint accordingly

    // Append start and end dates as query parameters
    url += '?startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);

    // Open a new window
    var newWindow = window.open();

    // Fetch booking data using AJAX
    fetch(url)
        .then(response => response.json())
        .then(bookingData => {
            // Create a data table
            var table = '<table border="1"><thead><tr><th>Booking ID</th><th>User ID</th><th>Property Name</th><th>Purpose</th><th>Amount</th><th>Start Time</th><th>End Time</th><th>Transaction ID</th></tr></thead><tbody>';

            // Append rows to the table
            bookingData.forEach(booking => {
                table += `<tr>
                    <td>${booking.BookingID}</td>
                    <td>${booking.User_ID}</td>
                    <td>${booking.PropertyName}</td>
                    <td>${booking.Purpose}</td>
                    <td>${booking.Amount}</td>
                    <td>${booking.StartTime}</td>
                    <td>${booking.EndTime}</td>
                    <td>${booking.TransactionID}</td>
                </tr>`;
            });

            table += '</tbody></table>';

            // Write the table to the new window
            newWindow.document.write('<html><head><title>Booking Report</title></head><body>');
            newWindow.document.write('<h2>Booking Report</h2>');
            newWindow.document.write(table);
            newWindow.document.write('</body></html>');

            // Close the document for editing (prevents the user from accidentally modifying the content)
            newWindow.document.designMode = 'off';

            // Focus and print the window
            newWindow.focus();
            newWindow.print();
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
            // Handle the error, display a message, or perform other actions as needed
        });
}
