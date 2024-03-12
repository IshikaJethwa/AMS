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
    // Assuming user ID is passed in the URL
    const userId = new URLSearchParams(window.location.search).get('id');

    if (userId) {
        // Make an AJAX request to fetch user details
        $.ajax({
            type: 'GET',
            url: `http://localhost:62416/api/Admin/User/${userId}`, // Replace with your actual API endpoint
            success: function (response) {
                // Handle the success response
                displayUserData(response);
            },
            error: function (error) {
                // Handle the error response (if needed)
                alert('Error fetching user details:', error);
            }
        });

        document.getElementById('updateBtn').addEventListener('click', function () {
            // Make an AJAX request to fetch the current user details
            $.ajax({
                type: 'GET',
                url: `http://localhost:62416/api/Admin/User/${userId}`, // Replace with your actual API endpoint
                success: function (response) {
                    // Populate the modal with current user details
                    document.getElementById('updateUsername').value = response.User_username;
                    document.getElementById('updateUnitID').value = response.UnitID;
                    document.getElementById('updateName').value = response.Name;
                    document.getElementById('updateEmail').value = response.Email;
                    document.getElementById('updateMobileNo').value = response.MobileNo;

                    // Handle the update form submission
                   
                },
                error: function (error) {
                    // Handle the error response (if needed)
                    alert('Error fetching user details:', error);
                }
            });
        });

        document.getElementById('deleteBtn').addEventListener('click', function () {
            $.ajax({
                type: 'DELETE',
                url: `http://localhost:62416/api/Admin/User/${userId}`,
                success: function (response) {
                    alert(response); // Display success message
                    window.location.href = 'users.html'; // Redirect to users.html after a successful delete
                },
                error: function (error) {
                    alert('Error deleting user:', error);
                }
            });
        });
        $.validator.addMethod("nowhitespace", function (value, element) {
            return this.optional(element) || /^\S+$/i.test(value);
        }, "Whitespace is not allowed");
        $.validator.addMethod("indianMobile", function (value, element) {
            // Indian mobile numbers should have 10 digits and start with a digit from 6 to 9
            const indianMobileRegex = /^[6-9]\d{9}$/;
            return this.optional(element) || indianMobileRegex.test(value);
        }, "Please enter a valid Indian mobile number");
        $('#updateForm').validate({
            rules: {
                updateName: {
                    required: true
                },
                updateEmail: {
                    required: true,
                    email: true
                },
                updateMobileNo: {
                    required: true,
                    indianMobile: true,
                    nowhitespace: true // Custom rule to disallow whitespaces
                }
                // Add other validation rules as needed
            },
            messages: {
                updateName: {
                    required: "Please enter the name"
                },
                updateEmail: {
                    required: "Please enter the email",
                    email: "Please enter a valid email address"
                },
                updateMobileNo: {
                    required: "Please enter the mobile number",
                    indianMobile: "Please enter a valid Indian mobile number",
                    nowhitespace: "Whitespace is not allowed"
                }
                // Add other validation messages as needed
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
                // Handle the form submission
                document.getElementById('updateForm').addEventListener('submit', function (event) {
                    event.preventDefault();
                    // Get the updated user details from the form
                    var updatedUserData = {
                        User_username: document.getElementById('updateUsername').value,
                        UnitID: document.getElementById('updateUnitID').value,
                        Name: document.getElementById('updateName').value,
                        Email: document.getElementById('updateEmail').value,
                        MobileNo: document.getElementById('updateMobileNo').value
                        // Add other fields as needed
                    };

                    // Make the AJAX request to update user details
                    $.ajax({
                        type: 'PATCH',
                        url: `http://localhost:62416/api/Admin/User/${userId}`,
                        contentType: 'application/json',
                        data: JSON.stringify(updatedUserData),
                        success: function (response) {
                            // Handle success response
                            alert('User details updated successfully!');
                            // Redirect to users.html after a successful update
                            window.location.href = 'users.html';
                        },
                        error: function (error) {
                            // Handle error response
                            alert('Error updating user details:', error);
                        }
                    });
                });
                // Add your logic to update the user details here
            }
        });
        var updateName = document.getElementById('updateName');
       

        updateName.addEventListener('focusout', function () {
            // Trim spaces only at the beginning and end
            updateName.value = updateName.value.trim();
        });
        var updateEmail = document.getElementById('updateEmail');


        updateEmail.addEventListener('focusout', function () {
            // Trim spaces only at the beginning and end
            updateEmail.value = updateEmail.value.trim();
        });
        function displayUserData(userData) {
            // Modify this function to display user details in your HTML
            // Example:
            document.getElementById('user-id').innerText = userData.UserID_id;
            document.getElementById('username').innerText = userData.User_username;
            document.getElementById('unit-id').innerText = userData.UnitID;
            document.getElementById('name').innerText = userData.Name;
            document.getElementById('email').innerText = userData.Email;
            document.getElementById('mobile-no').innerText = userData.MobileNo;
        }
    } else {
        alert('User ID not provided in the URL.');
    }
});