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
    // AJAX call to fetch admin details
    $.ajax({
        url: 'http://localhost:62416/api/SuperAdmin/Admin', // Assuming the PHP file is at this location
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Update table with fetched admin details
            var adminTable = $('#admin-table');
            $.each(data, function (index, admin) {
                var row = `<tr>
                            <td>${index + 1}</td>
                            <td>${admin.Admin_Id}</td>
                            <td>${admin.Name}</td>
                            <td>${admin.Email}</td>
                            <td>${admin.PhoneNo}</td>
                            <td>${admin.Username}</td>
                            <td><a href="admin-detail.html?id=${admin.Admin_Id}" title="View Full Details"><i class="fa fa-edit fa-1x"></i></a></td>
                        </tr>`;
                adminTable.append(row);
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
});