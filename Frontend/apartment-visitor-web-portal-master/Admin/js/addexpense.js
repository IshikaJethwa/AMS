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
var title = document.getElementById('title');


title.addEventListener('focusout', function () {
    // Trim spaces only at the beginning and end
    title.value = title.value.trim();
});
var amount = document.getElementById('amount');


amount.addEventListener('focusout', function () {
    // Trim spaces only at the beginning and end
    amount.value = amount.value.trim();
});
// Set up form validation rules
$("form").validate({
    rules: {
        title: {
            required: true,
            minlength: 3,
            maxlength: 50
        },
        amount: {
            required: true,
            number: true,
            min: 0
        },
        datetime: {
            required: true
        }
    },
    messages: {
        title: {
            required: "Please enter a title",
            minlength: "Title must be at least 3 characters",
            maxlength: "Title cannot exceed 50 characters"
        },
        amount: {
            required: "Please enter an amount",
            number: "Please enter a valid number",
            min: "Amount must be greater than or equal to 0"
        },
        datetime: {
            required: "Please select a date and time"
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
    submitHandler: function (form) {
        // If the form is valid, call the addExpense function
        addExpense();
    }
});


function addExpense() {


    // Dummy data for illustration purposes
    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const datetime = document.getElementById('datetime').value;

    const expenseData = {
        Title: title,
        Amount: amount,
        DateTime: datetime
    };

    // Make AJAX request to add expense
    $.ajax({
        type: 'POST',
        url: 'http://localhost:62416/api/Admin/PostExpenses', // Adjust the API endpoint accordingly
        contentType: 'application/json',
        data: JSON.stringify(expenseData),
        success: function (response) {
            alert('Expense added successfully:', response);
            window.location.href = 'expense.html';
            // Optionally, you can handle the response, display a message, or redirect the user
        },
        error: function (error) {
            alert('Error adding expense:', error);
            // Optionally, you can handle the error, display a message, or perform other actions
        }
    });

}