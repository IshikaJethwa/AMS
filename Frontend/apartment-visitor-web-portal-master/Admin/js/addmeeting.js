// Wrap your code in document ready function
jQuery(document).ready(function () {

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
    $.validator.addMethod("datetimeGreaterThanNow", function (value, element) {
        // Get the selected datetime value
        var selectedDatetime = new Date(value);
        // Get the current datetime
        var currentDatetime = new Date();

        // Check if the selected datetime is greater than the current datetime
        return selectedDatetime > currentDatetime;

    }, "Selected datetime must be greater than the current time");

    // jQuery Validation
    $("#meetingForm").validate({
        rules: {
            title: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            description: {
                required: true,
                minlength: 5,
                maxlength: 200
            },
            datetime: {
                required: true,
                datetimeGreaterThanNow: true
                // You can add additional date/time validation rules here
            }
        },
        messages: {
            title: {
                required: "Please enter a title",
                minlength: "Title must be at least 3 characters",
                maxlength: "Title cannot exceed 50 characters"
            },
            description: {
                required: "Please enter a description",
                minlength: "Description must be at least 5 characters",
                maxlength: "Description cannot exceed 200 characters"
            },
            datetime: {
                required: "Please select a date and time",
                datetimeGreaterThanNow: "Selected datetime must be greater than the current time"
                
                // Add custom messages for date/time validation rules
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
            // Handle the form submission if it passes validation
            handleFormSubmission(form);
        }
    });

    var title = document.getElementById('title');
    

    title.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        title.value = title.value.trim();
    });
    var description = document.getElementById('description');


    description.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        description.value = description.value.trim();
    });
    // Function to handle the form submission
    function handleFormSubmission(form) {
       

        // Get form data
        const formData = new FormData(event.target);

        // Convert FormData to a plain JavaScript object
        const plainFormData = {};
        formData.forEach((value, name) => {
            plainFormData[name] = value;
        });

        // Convert the data to JSON
        const jsonData = JSON.stringify(plainFormData);

        // Make an AJAX call to your API endpoint for creating a meeting
        fetch('http://localhost:62416/api/Admin/CreateMeeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: jsonData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Handle the response from the server (if needed)
                alert('Meeting created successfully:', data);
                window.location.href = 'meeting.html';
                // You can perform additional actions based on the response
            })
            .catch(error => alert('Error creating meeting:', error));
    }
});
