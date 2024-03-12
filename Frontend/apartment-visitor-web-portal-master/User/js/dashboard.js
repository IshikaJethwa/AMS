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