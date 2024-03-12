// Fetch and include sidebar content
fetch('../includes/sidebarUser.html')
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
$(document).ready(function () {
    // Use AJAX or fetch to get user details from the server and update the HTML elements
    // Example:
    var unitid;
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
                unitid = user.UnitID;
                // Update the HTML elements with user details

                fetchPaymentDetailsByUnitId(unitid);



            },
            error: function (error) {
                alert('Error:', error);
            }
        });
    } else {
        alert('User data is missing or invalid.');
    }
});
function fetchPaymentDetailsByUnitId(unitId) {
    $.ajax({
        url: `http://localhost:62416/api/User/CheckMaintanace/${unitId}`,
        type: 'GET',
        success: function (maintenanceList) {
            // Clear existing rows
            $('#paymentDetailsBody').empty();

            // Populate the table with fetched data
            for (let i = maintenanceList.length - 1; i >= 0; i--) {
                const maintenance = maintenanceList[i];
                $('#paymentDetailsBody').append(`
                    <tr>
                        <td>${maintenance.idMaintainance}</td>
                        <td>${maintenance.Unit_ID}</td>
                        <td>${maintenance.Month}</td>
                        <td>${maintenance.Year}</td>
                        <td>${maintenance.PaymentDate}</td>
                        <td>${maintenance.Amount}</td>
                        <td>${maintenance.Transaction_ID}</td>
                    </tr>
                `);
            }
        },
        error: function (error) {
            console.log('Error fetching payment details:', error);
        }
    });
}