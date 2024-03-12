// Fetch sidebar content and insert it into the sidebar container
fetch('../includes/sidebarUser.html')
    .then(response => response.text())
    .then(data => document.getElementById('sidebar-container').innerHTML = data);

// Fetch header content and insert it into the header container
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

        // Parse the JSON string to get the user data as an object
        var userData = userDataString ? JSON.parse(userDataString) : null;

        // Update the content of the header dynamically if userData is not null
        if (userData) {
            document.getElementById('adminNameLink').textContent = userData.username;
            document.getElementById('adminNameDropdown').textContent = userData.username;
        } else {
            console.error('User data is missing or invalid.');
        }
    });

// Fetch user details from the server and update the HTML elements
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
            userid = user.UserID_id;
            // Update the HTML elements with user details
            $('#user-id').text(user.UserID_id);
            $('#unit-id').text(user.UnitID);
            $('#user-name').text(user.Name);
            $('#user-email').text(user.Email);
            $('#user-mobile').text(user.MobileNo);
            $('#user-username').text(user.User_username);

            $('#updateUserId').val(user.UserID_id);
            $('#updateUnitId').val(user.UnitID);
            $('#updateName').val(user.Name);
            $('#updateEmail').val(user.Email);
            $('#updateMobile').val(user.MobileNo);
            $('#updateUsername').val(user.User_username);
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
} else {
    console.error('User data is missing or invalid.');
}

// Add an event listener to the modal to execute a function when it is shown
$(document).ready(function () {
    $('#updateModal').on('show.bs.modal', function (event) {
        // Fetch the user details and populate the form fields
        const userId = sessionStorage.getItem('userid');

        if (!userId) {
            console.error('User ID is missing or invalid.');
            return;
        }

        // Fetch user details using AJAX or fetch
        $.ajax({
            url: 'http://localhost:62416/api/User/' + userId,
            type: 'GET',
            success: function (user) {
                // Populate the form fields with the user details
                $('#updateUserId').val(user.UserID_id);
                $('#updateUnitId').val(user.UnitID);
                $('#updateName').val(user.Name);
                $('#updateEmail').val(user.Email);
                $('#updateMobile').val(user.MobileNo);
                $('#updateUsername').val(user.User_username);
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });



    });

   



});

function updateUserProfile() {
    // if ($("#updateForm").valid()) {
    const updatedName = $('#updateName').val();
    const updatedEmail = $('#updateEmail').val();
    const updatedMobile = $('#updateMobile').val();

    const updatedUser = {
        UserID_id: userid,
        Name: updatedName,
        Email: updatedEmail,
        MobileNo: updatedMobile
    };

    $.ajax({
        url: `http://localhost:62416/api/User/${userid}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedUser),
        success: function (response) {
            alert('User updated successfully', response);
            // Optionally, you can close the modal after successful update
            $('#updateModal').modal('hide');
            window.location.href= 'profile.html';
            // Refresh the page or update the displayed user details
            // based on your application's requirements
        },
        error: function (error) {
            console.log('Error updating user', error);
        }
    });
    // }
}


// // Add custom validation method to disallow whitespaces
$.validator.addMethod("nowhitespace", function (value, element) {
    return this.optional(element) || /^\S+$/i.test(value);
}, "Whitespace is not allowed");
$.validator.addMethod("indianMobile", function (value, element) {
    // Indian mobile numbers should have 10 digits and start with a digit from 6 to 9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return this.optional(element) || indianMobileRegex.test(value);
}, "Please enter a valid Indian mobile number");
$.validator.addMethod("alphabetsOnly", function (value, element) {
    // Allow only alphabets (letters)
    return this.optional(element) || /^[A-Za-z]+$/.test(value);
}, "Only alphabets are allowed");
// Initialize form validation on the updateForm
$("#updateForm").validate({
    rules: {

        updateName: {
            required: true,
            maxlength: 50,
            alphabetsOnly: true,
            nowhitespace: true // Custom rule to disallow whitespaces
        },
        updateEmail: {
            required: true,
            email: true,
            nowhitespace: true // Custom rule to disallow whitespaces
        },
        updateMobile: {
            required: true,
            number: true,
            indianMobile: true,
            nowhitespace: true // Custom rule to disallow whitespaces
        }
        // Add rules for other fields
    },
    messages: {
        updateName: {
            required: "Please enter your name",
            maxlength: "Name must not exceed 50 characters",
            minlength: "Name must be at least 8 characters long",
            nowhitespace: "Whitespace is not allowed"
        },
        updateEmail: {
            required: "Please enter your email address",
            email: "Please enter a valid email address",
            nowhitespace: "Whitespace is not allowed"
        },
        updateMobile: {
            required: "Please enter your mobile number",
            number: "Please enter a valid number",
            indianMobile: "Please enter a valid Indian mobile number",
            nowhitespace: "Whitespace is not allowed"
        }
        // Add messages for other fields
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
        // Log a message when the form is submitted
        console.log("Form submitted");
        // form.submit();
        updateUserProfile();
    }
});