

document.addEventListener('DOMContentLoaded', function () {
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
    $.ajax({
        type: 'GET',
        url: 'http://localhost:62416/api/Admin/GetAvailableBalance',
        success: function (data) {
            $('#available-balance').text(data);
        },
        error: function (error) {
            console.error('Error fetching available balance:', error);
            $('#available-balance').text('Error');
        }
    });
    $.ajax({
        type: 'GET',
        url: 'http://localhost:62416/api/Expenses/GetTotalFunds',
        success: function (data) {
            $('#total-income').text(data);
        },
        error: function (error) {
            console.error('Error fetching available balance:', error);
            $('#total-income').text('Error');
        }
    });
    $.ajax({
        type: 'GET',
        url: 'http://localhost:62416/api/Admin/GetTotalExpense',
        success: function (data) {
            $('#total-expense').text(data);
        },
        error: function (error) {
            console.error('Error fetching available balance:', error);
            $('#total-expense').text('Error');
        }
    });
    $.ajax({
        type: 'GET',
        url: 'http://localhost:62416/api/Admin/GetAllExpenses', // Adjust the API endpoint accordingly
        success: function (data) {
            const tableBody = document.getElementById('expense-table-body');

            // Clear existing rows
            tableBody.innerHTML = '';

            // Iterate through the fetched expense data and append rows to the table
            for (let i = data.length - 1; i >= 0; i--) {
                const expense = data[i];
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${expense.ExpensesId}</td>
                <td>${expense.Title}</td>
                <td>${expense.Amount}</td>
                <td>${expense.DateTime}</td>
            `;
                tableBody.appendChild(row);
            }
        },
        error: function (error) {
            console.error('Error fetching expense data:', error);
            // Handle the error, display a message, or perform other actions as needed
        }
    });

  
});

function filterDataByMonth() {
    // Get the desired month from the user, you can use a prompt or any other UI component
    var selectedMonth = prompt('Enter the month (1-12):');

    // Validate the input to ensure it's a valid month (1-12)
    if (isValidMonth(selectedMonth)) {
        // Call the API endpoint with the selected month for filtering
        fetch(`http://localhost:62416/api/Admin/GetExpensesByStartEndMonth/${selectedMonth}/${selectedMonth}`)
            .then(response => response.json())
            .then(data => {
                // Handle the filtered data, you might want to update the table or perform other actions
                updateTableWithData(data);
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                // Handle the error, display a message, or perform other actions as needed
            });
    } else {
        // Display an error message for an invalid month input
        alert('Invalid month. Please enter a number between 1 and 12.');
    }
}
// Helper function to validate the input as a valid month (1-12)
function isValidMonth(month) {
    return !isNaN(month) && parseInt(month) >= 1 && parseInt(month) <= 12;
}

// Helper function to update the table with the filtered data
function updateTableWithData(data) {
    const tableBody = document.getElementById('expense-table-body');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Iterate through the fetched expense data and append rows to the table
    for (let i = data.length - 1; i >= 0; i--) {
        const expense = data[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.ExpensesId}</td>
            <td>${expense.Title}</td>
            <td>${expense.Amount}</td>
            <td>${expense.DateTime}</td>
           
        `;
        tableBody.append(row);
    }
}

