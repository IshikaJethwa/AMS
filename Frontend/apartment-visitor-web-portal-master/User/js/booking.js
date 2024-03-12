
document.addEventListener('DOMContentLoaded', function () {
    // Fetch and include sidebar content
    fetch('../includes/sidebarUser.html')
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

    $.ajax({
        url: 'http://localhost:62416/api/User/GetAllBooking',
        type: 'GET',
        dataType: 'json',
        success: function (bookings) {
            // Clear existing table rows
            $('#booking-table-body').empty();

            // Get current time
            const currentTime = new Date();

            // Iterate through the fetched bookings and update the table for bookings with StartTime greater than the current time
            bookings.forEach(booking => {
                const startTime = new Date(booking.StartTime);

                if (startTime > currentTime) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.PropertyName}</td>
                        <td>${booking.Purpose}</td>
                        <td>${booking.StartTime}</td>
                        <td>${booking.EndTime}</td>
                    `;
                    $('#booking-table-body').append(row);
                }
            });
        },
        error: function (error) {
            console.error('Error fetching booking data:', error);
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
                    
                    <td>${booking.PropertyName}</td>
                    <td>${booking.Purpose}</td>      
                    <td>${booking.StartTime}</td>
                    <td>${booking.EndTime}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
            // Handle the error, display a message, or perform other actions as needed
        });
}