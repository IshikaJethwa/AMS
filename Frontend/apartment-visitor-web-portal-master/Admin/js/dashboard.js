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
$(document).ready(function () {
    // Make your AJAX call to get visitor data
    $.ajax({
        url: 'http://localhost:62416/api/Visitor', // Replace with your backend URL
        method: 'GET',
        success: function (data) {
            // Assuming data is an array of visitors
            var visitors = data;

            // Calculate counts
            var totalCount = visitors.length;
            var todayCount = getVisitorsCountToday(visitors);
            var yesterdayCount = getVisitorsCountYesterday(visitors);
            var last7DaysCount = getVisitorsCountLast7Days(visitors);

            // Update the counts in the HTML
            $('#total-visitors-count').text(totalCount);
            $('#today-visitors-count').text(todayCount);
            $('#yesterday-visitors-count').text(yesterdayCount);
            $('#last-7-days-visitors-count').text(last7DaysCount);

            // Display visitor data as needed
            displayVisitorData(visitors);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    var today = new Date();
    // Add your other functions for counting and displaying data here

    function getVisitorsCountToday(visitors) {

        today.setHours(0, 0, 0, 0);

        return visitors.filter(visitor => {
            var enteringTime = new Date(visitor.EnteringTime);
            return enteringTime >= today;
        }).length;
    }

    function getVisitorsCountYesterday(visitors) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        return visitors.filter(visitor => {
            var enteringTime = new Date(visitor.EnteringTime);
            return enteringTime >= yesterday && enteringTime < today;
        }).length;
    }

    function getVisitorsCountLast7Days(visitors) {
        var last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        return visitors.filter(visitor => {
            var enteringTime = new Date(visitor.EnteringTime);
            return enteringTime >= last7Days;
        }).length;
    }

    function displayVisitorData(visitors) {
        // Implement your logic to display visitor data as needed
    }
});