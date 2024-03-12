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
$("#maintenanceForm").validate({
    rules: {
        Unit_ID: {
            required: true
        },
        month: {
            required: true
        },
        year: {
            required: true,
            minlength: 4,      // Require at least 4 digits
            maxlength: 4,
            digits: true // Only allow digits
        },
        paymentDate: {
            required: true
        },
        amount: {
            required: true,
            number: true // Only allow numbers
        },
        Transaction_ID: {
            required: true
        }
    },
    messages: {
        Unit_ID: {
            required: "Please enter Unit ID"
        },
        month: {
            required: "Please select a Month"
        },
        year: {
            required: "Please enter Year",
            digits: "Please enter only digits",
            minlength: "Year must be 4 digits long",
            maxlength: "Year must be 4 digits long"
        },
        paymentDate: {
            required: "Please enter Payment Date"
        },
        amount: {
            required: "Please enter Amount",
            number: "Please enter a valid number"
        },
        Transaction_ID: {
            required: "Please enter Transaction ID"
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
    errorPlacement: function (error, element) {
        if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

// Function to add maintenance record
function addMaintenanceRecord() {
    if ($("#maintenanceForm").valid()) {
        // Add your logic to submit the form or handle the data

        // Serialize form data
        var formData = $('#maintenanceForm').serialize();
       // console.log(formData);

        // Perform AJAX request
        $.ajax({
            type: 'POST',
            url: 'http://localhost:62416/api/User/PayMaintenance', // Replace with your actual server endpoint
            data: formData,
            success: function (response) {
              //  console.log(response);
                alert('Maintenance record added successfully.');
                window.location.href = 'payment-success.html';
                // Optionally, you can handle the response from the server r
            },
            error: function (error) {
                alert('Error adding maintenance record:', error);
                // Optionally, you can handle the error response
            }
        });
    }
}
$(document).ready(function () {
    // Use AJAX or fetch to get user details from the server and update the HTML elements
    // Example:
    var userid;
    const userDataString = sessionStorage.getItem('user');

    // Check if user data exists
    if (userDataString) {
        // Parse the JSON string to get the user data as an object
        const userData = JSON.parse(userDataString);

        // Send a POST request to the server to get user details
        $.ajax({
            url: 'http://localhost:62416/api/getUser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                role: userData.role,
                username: userData.username,
                password: userData.password
            }),
            success: function (user) {
                $('#Unit_ID').val(user.UnitID);

            },
            error: function (error) {
                alert('Error:', error);
            }
        });
    } else {
        alert('User data is missing or invalid.');
    }
});