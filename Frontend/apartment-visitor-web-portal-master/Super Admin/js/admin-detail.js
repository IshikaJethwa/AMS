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
            console.log('Parsed user data:', userData);
            document.getElementById('adminNameLink').textContent = userData.username;
            document.getElementById('adminNameDropdown').textContent = userData.username;
        } else {
            console.error('User data is missing or invalid.');
        }
    });

$(document).ready(function () {
    // Extract Admin_Id from the URL
    var adminId = new URLSearchParams(window.location.search).get('id');

    // AJAX call to fetch specific admin details
    $.ajax({
        url: 'http://localhost:62416/api/SuperAdmin/Admin/' + adminId,
        type: 'GET',
        dataType: 'json',
        success: function (admin) {
            // Populate the admin details on the page
            $('#admin-id').text(admin.Admin_Id);
            $('#admin-name').text(admin.Name);
            $('#admin-email').text(admin.Email);
            $('#admin-phone').text(admin.PhoneNo);
            $('#admin-username').text(admin.Username);
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
});

// Function to open the Update Admin modal
function openUpdateAdminModal() {
    $('#updateAdminModal').modal('show');
}

// Function to open the Delete Admin modal
function openDeleteAdminModal() {
    $('#deleteAdminModal').modal('show');
}
   
        function updateAdmin() {
            // Get the values from the form fields
            var adminId = $('#update-admin-id').val();
            var adminName = $('#update-admin-name').val();
            var adminEmail = $('#update-admin-email').val();
            var adminPhone = $('#update-admin-phone').val();
            var adminUsername = $('#update-admin-username').val();

            // Create an object with the updated admin data
            var updatedAdminData = {

                "Name": adminName,
                "Email": adminEmail,
                "PhoneNo": adminPhone,
                "Username": adminUsername
                // Add more fields as needed
            };

            // Perform an AJAX request to update the admin
            $.ajax({
                url: 'http://localhost:62416/api/SuperAdmin/Admin?id=' + adminId,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedAdminData),
                success: function (response) {
                    // Handle success response
                    alert('Admin updated successfully:', response);

                    // Close the modal after successful update
                    $('#updateAdminModal').modal('hide');
                    window.location.href = 'manageAdmin.html'
                },
                error: function (error) {
                    // Handle error response
                    alert('Error updating admin:', error);
                }
            });
        }
   
        $('#updateAdminModal').on('show.bs.modal', function (event) {
            var adminId = new URLSearchParams(window.location.search).get('id');
            // AJAX call to fetch specific admin details
            $.ajax({
                url: 'http://localhost:62416/api/SuperAdmin/Admin/' + adminId,
                type: 'GET',
                dataType: 'json',
                success: function (admin) {

                    $('#update-admin-id').val(admin.Admin_Id);
                    $('#update-admin-name').val(admin.Name);
                    $('#update-admin-email').val(admin.Email);
                    $('#update-admin-phone').val(admin.PhoneNo);
                    $('#update-admin-username').val(admin.Username);
                },
                error: function (error) {
                    console.log('Error:', error);
                }
            });



        });
   
        function deleteAdmin() {
            // Get the admin ID from the page
            var adminId = $('#admin-id').text();

            // Perform an AJAX request to delete the admin
            $.ajax({
                url: 'http://localhost:62416/api/SuperAdmin/Admin/' + adminId,
                type: 'DELETE',
                success: function (response) {
                    // Handle success response
                    alert('Admin deleted successfully:', response);

                    // Redirect or perform any other action after successful deletion
                    window.location.href = 'manageAdmin.html';
                },
                error: function (error) {
                    // Handle error response
                    alert('Error deleting admin:', error);
                }
            });
        }