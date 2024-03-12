document.addEventListener('DOMContentLoaded', function () {
    var userForm = document.getElementById('user-form');
    var unitIDSelect = document.getElementById('unitID');

    // Fetch existing unit IDs from your backend API
    fetchExistingUnitIDs()
        .then(existingUnitIDs => {
            // Filter available unit IDs
            var availableUnitIDs = filterAvailableUnitIDs(existingUnitIDs);

            // Populate the selection menu with available unit IDs
            populateUnitIDSelect(availableUnitIDs);
        })
        .catch(error => {
            console.error('Error fetching existing unit IDs:', error);
        });

    function fetchExistingUnitIDs() {
        // Make a fetch request to your backend API to get existing unit IDs
        return fetch('http://localhost:62416/api/Admin/User')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching existing unit IDs: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if the response contains unit IDs
                if (!data || !data.length) {
                    throw new Error('Invalid response format: No unit IDs found');
                }

                // Extract unit IDs from the response data
                var existingUnitIDs = data.map(entry => entry.UnitID);

                return existingUnitIDs;
            })
            .catch(error => {
                console.error(error.message);
                return []; // Return an empty array in case of an error
            });
    }

    function filterAvailableUnitIDs(existingUnitIDs) {
        // Define all possible unit IDs (1 to 10)
        var allUnitIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // Filter out existing unit IDs from the available unit IDs
        var availableUnitIDs = allUnitIDs.filter(id => !existingUnitIDs.includes(id));
        return availableUnitIDs;
    }

    function populateUnitIDSelect(unitIDs) {
        // Clear existing options
        unitIDSelect.innerHTML = '';

        // Add default option
        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Unit ID';
        unitIDSelect.appendChild(defaultOption);

        // Add available unit IDs as options
        unitIDs.forEach(id => {
            var option = document.createElement('option');
            option.value = id;
            option.textContent = id;
            unitIDSelect.appendChild(option);
        });
    }

    userForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            // Fetch form details
            var username = $('#username').val();
            var password = $('#password').val();
            var unitID = $('#unitID').val();
            var name = $('#name').val();
            var email = $('#email').val();
            var mobileNo = $('#mobileNo').val();

            // Create an object with form details
            var userObject = {
                User_username: username,
                User_Password: password,
                UnitID: unitID,
                Name: name,
                Email: email,
                MobileNo: mobileNo
            };

            // Make an AJAX POST request
            fetch('http://localhost:62416/api/Admin/User', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userObject)
            })
                .then(response => {
                    if (response.ok) {
                        // Handle the success response
                        alert('User added successfully!'); // Show an alert
                        window.location.href = 'users.html'; // Redirect to user.html
                    } else if (response.status === 400) {
                        // Bad request (duplicate entry)
                        alert('Error: Duplicate entry. The username is already taken.');
                    } else {
                        // Other errors
                        throw new Error('Server error');
                    }
                })
               
                .catch(error => {
                    // Handle other errors
                    alert('Error: ' + error.message);
                });
        }
    });
    password.addEventListener('keypress', function (event) {
        // Check if the pressed key is a space
        if (event.key === ' ') {
            // Prevent the space from being added to the password
            event.preventDefault();

            // Trim spaces and update the password field value
            password.value = password.value.trim();
        }
    });

    var username = document.getElementById('username');


    username.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        username.value = username.value.trim();
    });
    var name = document.getElementById('name');


    name.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        name.value = name.value.trim();
    });
    var email = document.getElementById('email');


    email.addEventListener('focusout', function () {
        // Trim spaces only at the beginning and end
        email.value = email.value.trim();
    });
    userForm.addEventListener('change', function (event) {
        var targetField = event.target;
        var errorSpan = createErrorSpan(targetField);

        if (!validateField(targetField, errorSpan)) {
            targetField.focus();
        } else {
            errorSpan.textContent = ''; // Clear any previous error messages
        }
    });

    function createErrorSpan(targetField) {
        var errorSpanId = targetField.id + '-error';
        var errorSpan = document.getElementById(errorSpanId);

        if (!errorSpan) {
            // Create the error span dynamically if it doesn't exist
            errorSpan = document.createElement('span');
            errorSpan.id = errorSpanId;
            errorSpan.style.color = 'red';
            targetField.parentNode.appendChild(errorSpan); // Assuming the span should be placed next to the input field
        }

        return errorSpan;
    }

    function validateForm() {
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var unitID = document.getElementById('unitID');
        var name = document.getElementById('name');
        var email = document.getElementById('email');
        var mobileNo = document.getElementById('mobileNo');

        var fields = [username, password, unitID, name, email, mobileNo];

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var errorSpan = createErrorSpan(field);

            if (!validateField(field, errorSpan)) {
                field.focus();
                return false;
            } else {
                errorSpan.textContent = ''; // Clear any previous error messages
            }
        }

        return true;
    }

    function validateField(field, errorSpan) {
        var fieldName = field.id;
        var fieldValue = field.value.trim();

        switch (fieldName) {
            case 'username':
                if (fieldValue === '') {
                    showError(errorSpan, 'Please enter a username');
                    return false;
                }
                if (!isValidUsername(fieldValue)) {
                    showError(errorSpan, 'Username cannot start with a special character');
                    return false;
                }
                break;
            case 'password':
                if (fieldValue === '' || fieldValue.length < 8 || fieldValue.length > 20) {
                    showError(errorSpan, 'Please enter a valid password');
                    return false;
                }
                break;
            case 'unitID':
                if (fieldValue === '') {
                    showError(errorSpan, 'Please select a Unit ID');
                    return false;
                }
                break;
            case 'name':
                if (fieldValue === '') {
                    showError(errorSpan, 'Please enter a name');
                    return false;
                }
                if (!isValidName(fieldValue)) {
                    showError(errorSpan, 'Name cannot start with a special character');
                    return false;
                }
                break;
            case 'email':
                if (fieldValue === '') {
                    showError(errorSpan, 'Please enter an email address');
                    return false;
                }
                if (!isValidEmail(fieldValue)) {
                    showError(errorSpan, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'mobileNo':
                if (fieldValue === '') {
                    showError(errorSpan, 'Please enter a mobile number');
                    return false;
                }
                if (!isValidMobileNumber(fieldValue)) {
                    showError(errorSpan, 'Please enter a valid mobile number');
                    return false;
                }
                break;
            default:
                break;
        }

        return true;
    }

    function isValidUsername(username) {
        // Check if the username starts with a special character
        var specialCharacterRegex = /^[^\w]/;
        return !specialCharacterRegex.test(username);
    }

    function isValidName(name) {
        // Check if the name starts with a special character
        var specialCharacterRegex = /^[^\w]/;
        return !specialCharacterRegex.test(name);
    }

    function isValidEmail(email) {
        // Basic email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidMobileNumber(mobileNo) {
        // Basic mobile number validation (10 digits)
        var indianMobileRegex = /^[6789]\d{9}$/;
        return indianMobileRegex.test(mobileNo);
    }

    function showError(errorSpan, errorMessage) {
        errorSpan.textContent = errorMessage;
    }

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
});
