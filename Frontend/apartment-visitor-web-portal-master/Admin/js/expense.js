

document.addEventListener('DOMContentLoaded', function () {
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
                     <td>
                        <button class="btn btn-link" title="update" onclick="openUpdateModal(${expense.ExpensesId},'${expense.Title}','${expense.Amount}','${expense.DateTime}')">
                            <i class="fa fa-edit fa-1x"></i>
                        </button>
                    </td>
                `;
            tableBody.append(row);
        }
    },
    error: function (error) {
        console.error('Error fetching expense data:', error);
        // Handle the error, display a message, or perform other actions as needed
    }
});
function openAddExpenseModal() {
    // Redirect to AddExpense.html or implement modal logic
    window.location.href = 'add-expense.html';
}
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
function openUpdateModal(ExpensesId, title, amount, datetime) {
    $('#expensesID').val(ExpensesId);
    $('#title').val(title);
    $('#amount').val(amount);
    $('#datetime').val(datetime);
    // Implement logic to populate modal fields based on complaintId if needed
    $('#updateExpenseModal').modal('show');
    $("#updateExpenseForm").validate({
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
            updateExpense();
        }
    });
}

// Function to download PDF
function downloadPDF() {
    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Expense Report</title>');
    printWindow.document.write('<link rel="stylesheet" href="../css/theme.css" type="text/css" />'); // Include your styles
    printWindow.document.write('</head><body>');

    // Additional content (Shreeji Apartment, etc.)
    printWindow.document.write('<h2 style="text-align: center;">Shreeji Apartment</h2>');
    printWindow.document.write('<div style="padding-top: 20px;"></div>');

    // Get the main content container
    var content = document.getElementById('pdf-content');

    // Clone the content and append it to the print-friendly window
    var contentClone = content.cloneNode(true);
    
    printWindow.document.body.appendChild(contentClone);
    
    var tablecontent = document.getElementById('tablecontent');
    
    var tblclone = tablecontent.cloneNode(true);
    // Remove the "Action" column from the cloned table
    var headers = tblclone.querySelectorAll('th');
    headers.forEach(header => {
        if (header.textContent.trim() === 'Action') {
            header.remove();
        }
    });

    var rows = tblclone.querySelectorAll('td:nth-child(5)'); // Assuming "Action" is the 5th column
    rows.forEach(row => row.remove());
    printWindow.document.body.appendChild(tblclone);

    // Close the print-friendly window
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Allow some time for the content to be rendered before printing
    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 1000); // Adjust the delay as needed
}
$(document).ready(function () {
    // Fetch and display available balance
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
});
function updateExpense() {
    // Get the values from the modal fields
    var expensesID = $('#expensesID').val();
    var title = $('#title').val();
    var amount = $('#amount').val();
    var datetime = $('#datetime').val();

    // Create a data object to send in the request
    var data = {
        ExpensesId: expensesID,
        Title: title,
        Amount: amount,
        DateTime: datetime
    };

    // Send the AJAX request to update the expense
    $.ajax({
        type: 'PUT', // Change the HTTP method if needed
        url: 'http://localhost:62416//api/Admin/UpdateExpenses', // Adjust the API endpoint accordingly
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            // Handle the success response, you might want to reload the table or perform other actions
            alert('Expense updated successfully:', response);
            window.location.href = 'expense.html';

        },
        error: function (error) {
            // Handle the error, display a message, or perform other actions as needed
            alert('Error updating expense:', error);
        }
    });
}
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
            <td>
                <button class="btn btn-link" title="update" onclick="openUpdateModal(${expense.ExpensesId},'${expense.Title}','${expense.Amount}','${expense.DateTime}')">
                    <i class="fa fa-edit fa-1x"></i>
                </button>
            </td>
        `;
        tableBody.append(row);
    }
}
