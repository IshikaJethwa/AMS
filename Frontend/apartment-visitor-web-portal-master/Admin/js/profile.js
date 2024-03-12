fetch('../includes/sidebarAdmin.html')
    .then(response => response.text())
    .then(data => document.getElementById('sidebar-container').innerHTML = data);

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
                     userid = user.Admin_Id;
                    // Update the HTML elements with user details
                    $('#user-id').text(user.Admin_Id);
                   
                    $('#user-name').text(user.Name);
                    $('#user-email').text(user.Email);
                    $('#user-mobile').text(user.PhoneNo);
                    $('#user-username').text(user.Username);

                    $('#updateAdmin_Id').val(user.Admin_Id);
                    
                    $('#updateName').val(user.Name);
                    $('#updateEmail').val(user.Email);
                    $('#updatePhoneNo').val(user.PhoneNo);
                    $('#updateUsername').val(user.Username);
                },
                error: function (error) {
                    console.log('Error:', error);
                }
            });
        } else {
            console.error('User data is missing or invalid.');
        }
  
        // Function to update user profile
        function updateUserProfile() {
                // Get the updated user details from the form
                const updatedName = $('#updateName').val();
        const updatedEmail = $('#updateEmail').val();
        const updatedMobile = $('#updatePhoneNo').val();

        // Prepare the updated user object
        const updatedUser = {
            Admin_Id: userid,
        Name: updatedName,
        Email: updatedEmail,
        PhoneNo: updatedMobile
                    // Add more properties as needed
                };

        // Send a PUT request to update the user profile
        $.ajax({
            url: `http://localhost:62416/api/SuperAdmin/Admin/${userid}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedUser),
        success: function (response) {
            // Handle success
            alert('Profile updated successfully:', response);

        // Update sessionStorage with the new user details
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
                            const userData = JSON.parse(userDataString);
        userData.Name = updatedName;
        userData.Email = updatedEmail;
        userData.MobileNo = updatedMobile;
        sessionStorage.setItem('user', JSON.stringify(userData));
                        }

        // Redirect to the desired page
        window.location.href = 'profile.html';

        // Close the modal
        $('#updateModal').modal('hide');
                    },
        error: function (error) {
            alert('Error:', error);
                    }
                });
            }

        // Add an event listener to the modal to execute a function when it is shown
        $(document).ready(function () {
            $('#updateModal').on('show.bs.modal', function (event) {
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
            
                $.validator.addMethod("indianMobile", function (value, element) {
                    // Indian mobile numbers should have 10 digits and start with a digit from 6 to 9
                    const indianMobileRegex = /^[6-9]\d{9}$/;
                    return this.optional(element) || indianMobileRegex.test(value);
                }, "Please enter a valid Indian mobile number");
              
                $("#updateForm").validate({
                    rules: {

                        updateName: {
                            required: true,
                            maxlength: 50,
                           
                        },
                        updateEmail: {
                            required: true,
                            email: true,
                          
                        },
                        updatePhoneNo: {
                            required: true,
                            number: true,
                            indianMobile: true,
                            
                        }
                        // Add rules for other fields as needed
                    },
                    messages: {
                        updateName: {
                            required: "Please enter your name",
                            maxlength: "Name must not exceed 50 characters",
                          
                           
                        },
                        updateEmail: {
                            required: "Please enter your email address",
                            email: "Please enter a valid email address",
                           
                        },
                        updatePhoneNo: {
                            required: "Please enter your mobile number",
                            number: "Please enter a valid number",
                            indianMobile: "Please enter a valid Indian mobile number",
                        
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
                        // Handle the form submission (call your update function)
                        updateUserProfile();
                    }
                });
                // Fetch the user details and populate the form fields
                const userDataString = sessionStorage.getItem('user');

                if (!userDataString) {
                    console.error('User data is missing or invalid.');
                    return;
                }

                // Parse the JSON string to get the user data as an object
                const userData = JSON.parse(userDataString);
                const userId = userData ? userData.UserID_id : null;

                if (!userId) {
                    console.error('User ID is missing or invalid.');
                    return;
                }

                // Fetch user details using AJAX or fetch
                $.ajax({
                    url: 'http://localhost:62416/api/SuperAdmin/Admin/' + userId,
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