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
                    } else {
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
    console.log('yrthyfrrh');
    // Initialize validation for the update modal form
    $('#updateBookingForm').validate({
        rules: {
            propertyName: {
                required: true,
            },
            updateStartTime: {
                required: true,
                // datetime: true
            },
            updateEndTime: {
                required: true,
                // datetime: true,
                greaterThanStartTime: true
            },
            purpose: {
                required: true
            },
            amount: {
                required: true,
                number: true
            }
            // Add other validation rules as needed
        },
        messages: {
            propertyName: {
                required: "Please enter the property name"
            },
            updateStartTime: {
                required: "Please enter the start time",
                // datetime: "Please enter a valid date and time"
            },
            updateEndTime: {
                required: "Please enter the end time",
                // datetime: "Please enter a valid date and time",
                greaterThanStartTime: "End time must be greater than start time"
            },
            purpose: {
                required: "Please enter the purpose"
            },
            amount: {
                required: "Please enter the amount",
                number: "Please enter a valid number"
            }
            // Add other validation messages as needed
        },
        errorElement: "span",
        errorClass: "text-danger",
    
     
        submitHandler: function (form) {
            console.log("submit");
            updateBooking();
        }
    });
    var updatePropertyName = document.getElementById('updatePropertyName');
    var updatePurpose = document.getElementById('updatePurpose');

    updatePropertyName.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        updatePropertyName.value = updatePropertyName.value.trim();
    });

    updatePurpose.addEventListener('focusout', function (event) {
        updatePurpose.value = updatePurpose.value.trim();

    });
    // Add custom validation method
    $.validator.addMethod("greaterThanStartTime", function (value, element) {
        var startDateTime = $('#updateStartTime').val();
        var endDateTime = value;
        return new Date(endDateTime) > new Date(startDateTime);
    }, "End time must be greater than start time");

    // Fetch bookings and filter based on the current time
    $.ajax({
        url: 'http://localhost:62416/api/User/GetAllBooking',
        type: 'GET',
        dataType: 'json',
        success: function (bookings) {
            // Clear existing table rows
            $('#booking-table-body').empty();
            // console.log(bookings);

            // Get the current time
            var currentTime = new Date();

            // Filter bookings where StartTime is greater than the current time
            const filteredbookings = bookings.filter(booking => new Date(booking.StartTime) > currentTime);
            // console.log(filteredbookings);

            // Iterate through the filtered bookings and update the table
            filteredbookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.BookingID}</td>
                    <td>${booking.PropertyName}</td>
                    <td>${booking.Purpose}</td> 
                    <td>${booking.Amount}</td> 
                    <td>${booking.StartTime}</td>
                    <td>${booking.EndTime}</td>
                    <td>
                        <button class="btn btn-link" title="View Full Details" onclick="openUpdateModal(${booking.BookingID})">
                            <i class="fa fa-edit fa-1x"></i>
                        </button>
                    </td>
                `;
                $('#booking-table-body').append(row);
            });
        },
        error: function (error) {
            console.error('Error fetching booking data:', error);
        }
    });

});

function openUpdateModal(id) {
    // Fetch booking details for the specific BookingID
    $.ajax({
        url: `http://localhost:62416/api/User/GetBookingDetails/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (booking) {
            // Populate modal fields with the retrieved data
            $('#updatebookingid').val(booking.BookingID);
            $('#updatePropertyName').val(booking.PropertyName);
            $('#updateStartTime').val(booking.StartTime);
            $('#updateEndTime').val(booking.EndTime);
            $('#updatePurpose').val(booking.Purpose);
            $('#updateAmount').val(booking.Amount);

            // Show the modal
            $('#updateBookingModal').modal('show');
        },
        error: function (error) {
            console.error('Error fetching booking details:', error);
        }
    });
}

function deleteBooking() {
    // You can show a confirmation dialog before canceling the booking if needed
    if (confirm('Are you sure you want to cancel this booking?')) {
        var id = $('#updatebookingid').val();
        // Call the cancelBooking function with the bookingId
        $.ajax({
            url: `http://localhost:62416/api/User/CancelBooking/${id}`, // Update the URL accordingly
            type: 'DELETE', // You can use 'DELETE' if your API supports it

            success: function (response) {
                // Handle success, if needed
                window.location.href = 'booking.html';
            },
            error: function (error) {
                console.error('Error canceling booking:', error);
            }
        });
    }
}

function updateBooking() {
    var bookingId = $('#updatebookingid').val();

    // Get updated booking details from modal fields
    var updatedBooking = {
        PropertyName: $('#updatePropertyName').val(),
        StartTime: $('#updateStartTime').val(),
        EndTime: $('#updateEndTime').val(),
        Purpose: $('#updatePurpose').val(),
        Amount: $('#updateAmount').val()
        // Add other fields as needed
    };

    // Make AJAX call to update booking
    $.ajax({
        url: `http://localhost:62416/api/User/UpdateBooking/${bookingId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedBooking),
        success: function (response) {
            // Handle success, if needed
            alert("updated successfully");
            window.location.href = "booking.html";

        },
        error: function (error) {
            console.error('Error updating booking:', error);
        }
    });
}

