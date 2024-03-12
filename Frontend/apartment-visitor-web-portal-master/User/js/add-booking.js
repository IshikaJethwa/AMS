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
    var purpose = document.getElementById('purpose');
    var transactionID = document.getElementById('transactionID');

    purpose.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        purpose.value = purpose.value.trim();
    });

    transactionID.addEventListener('focusout', function (event) {
        transactionID.value = transactionID.value.trim();

    });
    // Handle form submission
    $('#bookingForm').validate({
        rules: {
            propertyName: {
                required: true,
              
            },
            purpose: {
                required: true
            },
            amount: {
                required: true,
                number: true // Ensure that the amount is a number
            },
            startTime: {
                required: true,
                // Add any additional datetime validation rules if needed
            },
            endTime: {
                required: true,
                // Add any additional datetime validation rules if needed
            },
            transactionID: {
                required: true
            }
        },
        messages: {
            propertyName: {
                required: "Please enter the property name",
            
            },
            purpose: {
                required: "Please enter the purpose"
            },
            amount: {
                required: "Please enter the amount",
                number: "Please enter a valid number"
            },
            startTime: {
                required: "Please enter the start time",
                // Add any additional datetime validation error message if needed
            },
            endTime: {
                required: "Please enter the end time",
                // Add any additional datetime validation error message if needed
            },
            transactionID: {
                required: "Please enter the transaction ID"
            }
        },
        errorElement: "span",
        errorClass: "text-danger",
        highlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').addClass("has-error");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').removeClass("has-error");
        },
        invalidHandler: function (event, validator) {
            // Log validation errors to the console
            console.log(validator.errorList);
        },
        submitHandler: function (form) {
            // Get form data
            var bookingData = {
                User_ID: sessionStorage.getItem('userid'),
                PropertyName: $('#propertyName').val(),
                Purpose: $('#purpose').val(),
                Amount: $('#amount').val(),
                StartTime: formatDateTime($('#startTime').val()),
                EndTime: formatDateTime($('#endTime').val()),
                TransactionID: $('#transactionID').val()
            };
            console.log(bookingData);

            // Make AJAX call to add booking
            $.ajax({
                url: 'http://localhost:62416/api/User/PostBooking',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(bookingData),
                success: function (response) {
                    console.log(response); // Log the response from the server
                    alert('Booking submitted successfully');
                    window.location.href = 'booking.html';
                    // Optionally, redirect to the booking details page or perform any other actions
                },
                error: function (error) {
                    console.error('Error submitting booking:', error);
                    alert('Error submitting booking. Please try again.');
                }
            });

            function formatDateTime(dateTimeString) {
                var date = new Date(dateTimeString);
                // Format date in "YYYY-MM-DD HH:mm:ss" format
                var formattedDateTime = date.toISOString().slice(0, 19).replace("T", " ");
                return formattedDateTime;
            }
        }
    });
});