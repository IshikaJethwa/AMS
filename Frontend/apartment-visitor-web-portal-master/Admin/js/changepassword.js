// changepassword.js

$(document).ready(function () {
    var currentPassword = document.getElementById('currentpassword');
    var newPassword = document.getElementById('newpassword');
    var confirmpassword = document.getElementById('confirmpassword');


    currentPassword.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        currentPassword.value = currentPassword.value.trim();
    });

    newPassword.addEventListener('focusout', function () {
        newPassword.value = newPassword.value.trim();

    });
    confirmpassword.addEventListener('focusout', function () {
        confirmpassword.value = confirmpassword.value.trim();

    });
    $("#passwordform").validate({
        rules: {
            currentpassword: {
                required: true
            },
            newpassword: {
                required: true,
                minlength: 8,
                maxlength: 16
            },
            confirmpassword: {
                required: true,
                minlength: 8,
                maxlength: 16

            }

        },
        messages: {
            currentpassword: {
                required: "Please enter Current password"
            },
            newpassword: {
                required: "Please select a newpassword",
                minlength: "password must be 8 digits long",
                maxlength: "password must be 16 digits long"
            },
            confirmpassword: {
                required: "Please enter Confirmpassword",
                minlength: "password must be 8 digits long",
                maxlength: "password must be 16 digits long"
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
        },
        submitHandler: function (form) {

            // Get form data
            var currentPassword = $('#currentpassword').val();
            var newPassword = $('#newpassword').val();

            if (document.changepassword.newpassword.value != document.changepassword.confirmpassword.value) {
                alert('New Password and Confirm Password field do not match');
                document.changepassword.confirmpassword.focus();
                return;
            }

            // Retrieve user ID from sessionStorage
            var userId = sessionStorage.getItem('userid');

            if (!userId) {
                alert('User ID not available. Please log in.'); // Handle the case where user ID is not available
                return;
            }

            // Make an AJAX request to the server to change the password
            $.ajax({
                type: 'PUT',
                url: 'http://localhost:62416/api/SuperAdmin/Admin/ChangePassword/' + userId,
                data: JSON.stringify({ currentpassword: currentPassword, newpassword: newPassword }),
                contentType: 'application/json',
                success: function (response) {
                    alert('Password changed successfully!');
                    window.location.href = 'dashboard.html';
                    // Handle success, e.g., redirect or show a success message
                },
                error: function (error) {
                    alert('Error changing password: ' + error.responseText);
                    // Handle error, e.g., display an error message
                }
            });
        }
    });
});
