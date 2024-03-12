document.addEventListener('DOMContentLoaded', function () {
    var flag = false;
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

    var propertyName = document.getElementById('propertyName');

    propertyName.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        propertyName.value = propertyName.value.trim();
    });
    var endTime = document.getElementById('endTime');

    endTime.addEventListener('focusout', function () {
        const startDateValue = document.getElementById('startTime').value;
        const endDateValue = endTime.value;

        // Convert string values to Date objects
        const startDate = new Date(startDateValue);
        //console.log(startDate)
        const endDate = new Date(endDateValue);
       // console.log(endDate)

        // Check if endDate is greater than startDate
        if (endDate > startDate) {
            removeErrorMessage();
            console.log("flag true")
            flag = true;
            // Your additional logic or validation message here
        } else {
            addErrorMessage();
            flag = false;
            console.log("flag false")
            // Your additional logic or validation message here
        }

    });
    function addErrorMessage() {
        // Remove existing error message
        removeErrorMessage();

        // Create a new span element
        const errorMessage = document.createElement('span');
        errorMessage.textContent = 'End date must be greater than start date';
        errorMessage.className = 'text-danger';

        // Insert the span after the endTime element
        endTime.parentNode.insertBefore(errorMessage, endTime.nextSibling);
    }

    function removeErrorMessage() {
        // Find and remove existing error message
        const existingErrorMessage = endTime.parentNode.querySelector('.text-danger');
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
    }

    var purpose = document.getElementById('purpose');

    purpose.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        purpose.value = purpose.value.trim();
    });
    $.validator.addMethod('greaterThanCurrentDate', function (value, element) {
        const currentDate = new Date();
        const selectedDate = new Date(value);

        return selectedDate >= currentDate;
    }, 'Start time must be greater than or equal to the current date');



    $('#form').validate({
        rules: {
            propertyName: {
                required: true
            },
            purpose: {
                required: true
            },
            startTime: {
                required: true,
                greaterThanCurrentDate: true
            },
            endTime: {
                required: true,
                //greaterThanStartTime: true
            }
        },
        messages: {
            propertyName: {
                required: 'Please enter the property name'
            },
            purpose: {
                required: 'Please enter the purpose'
            },
            startTime: {
                required: 'Please select the start time',
                greaterThanCurrentDate: 'Start time must be greater than or equal to the current date'
            },
            endTime: {
                required: 'Please select the end time',
                //greaterThanStartTime: 'End time must be greater than start time'
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
            // Handle the form submission here
            console.log("flag", flag)
            if (flag) {
               // console.log("Submit form")
                handleFormSubmission(form);
            }
            else {
                addErrorMessage()
                //console.log("Not Submitted")
            }
        }
    });

    function handleFormSubmission(form) {
        const startDate = $('#startTime').val();
        const endDate = $('#endTime').val();
        console.log(startDate, endDate);

        const user_ID = sessionStorage.getItem('userid');
        // Get form data
        const formData = new FormData(form);

        // Convert FormData to a plain JavaScript object
        const plainFormData = {};
        formData.forEach((value, name) => {
            plainFormData[name] = value;
        });
        plainFormData['User_ID'] = user_ID;

        // Convert the data to JSON
        const jsonData = JSON.stringify(plainFormData);

        // Make an AJAX call to your API endpoint for creating a meeting
        fetch('http://localhost:62416/api/User/PostBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: jsonData,
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        // Bad request (e.g., duplicate entry)
                        return response.json().then(data => Promise.reject(new Error(data.Message)));
                    } else {
                        // Other errors
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                // Handle the response from the server (if needed)
                alert('Booking successfully:', data);
                window.location.href = 'booking.html';
                // You can perform additional actions based on the response
            })
            .catch(error => alert('Error creating booking:', error.message));
    }
});
