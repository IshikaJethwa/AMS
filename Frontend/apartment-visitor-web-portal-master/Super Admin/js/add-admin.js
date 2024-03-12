// Fetch and include sidebar content
fetch('../includes/sidebarSuperAdmin.html')
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

function addAdmin() {
    var adminData = {
        "Name": document.getElementById('admin-name').value,
        "Email": document.getElementById('admin-email').value,
        "PhoneNo": document.getElementById('admin-phone').value,
        "Username": document.getElementById('username').value,
        "Password": document.getElementById('password').value
    };

    // AJAX call to send data to the API endpoint
    $.ajax({
        url: 'http://localhost:62416/api/SuperAdmin/Admin',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(adminData),
        success: function (response) {
            // Handle success response
            alert('Admin added successfully:', response);
            window.location.href = 'manageAdmin.html';
        },
        error: function (xhr) {
            if (xhr.status === 400) {
                // Bad request (duplicate entry)
                alert('Error: Duplicate entry. The username is already taken.');
            } else {
                // Other errors
                alert('Error: ' + xhr.responseText);
            }
        }
    });
}