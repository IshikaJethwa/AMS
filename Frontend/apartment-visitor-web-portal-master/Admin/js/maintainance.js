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
   
    function generateAndDownloadPDF(data) {
        var tableHTML = '<h3 style = "display: flex; justify-content: center; align-items: center; padding-top : 7%;"> Shreeji Apartment </h3> <br/> <h4 style = "display: flex;  padding-top : 2%; justify-content: center; align-items: center;"> Maintance report </h4>'
        tableHTML += '<h5 style = "display: flex; justify-content: center; align-items: center; padding-top : 2%;">' + document.getElementById('startMonth').value + ' To ' + document.getElementById('endMonth').value + '</h5>';
         tableHTML += '<div style="display: flex; justify-content: center; align-items: center; padding: 5%;">'; // Center the content vertically and horizontally
         tableHTML += '<table class = "table table-borderless table-striped table-earning ">';
        tableHTML += '<thead  class = "table-header"><tr><th>ID</th><th>Unit ID</th><th>Month</th><th>Year</th><th>Payment Date</th></tr></thead>';
        tableHTML += '<tbody>';

        data.forEach(function (item, index) {
            
            tableHTML += '<tr class =  ' + (index % 2 === 0 ? 'even-row' : 'odd-row') + ';">';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.idMaintainance + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.Unit_ID + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.Month + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.Year + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.PaymentDate + '</td>';
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
         tableHTML += '</div>'; 

        // Generate and download the PDF
        html2pdf(tableHTML);
    }
    $('#downloadPendingButton').click(function () {
        $('#pendingmodal').modal('show');
    });

    // Handle download button click inside the modal
    $("#pendingdownloadButton").on("click", function () {
        // Get the selected start and end months
        
        var startMonth = $("#pendingstartMonth").val().split('-');
        console.log(startMonth);// split to separate year and month
        var endMonth = $("#pendingendMonth").val().split('-'); // split to separate year and month
        

        // Make an AJAX call to fetch data based on the month range
        $.ajax({
            url: `http://localhost:62416/api/Admin/GetPendingMaintenanceByMonth/${startMonth[1]}/${endMonth[1]}`,
            type: "GET",
          
            success: function (data) {
                // Once the data is fetched, generate and download the PDF
                generateAndpendingDownloadPDF(data);
            },
            error: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    });

    function generateAndpendingDownloadPDF(data) {
        var tableHTML = '<h3 style = "display: flex; justify-content: center; align-items: center; padding-top : 7%;"> Shreeji Apartment </h3> <br/> <h4 style = "display: flex;  padding-top : 2%; justify-content: center; align-items: center;">Pending Maintance report </h4>'
        tableHTML += '<h5 style = "display: flex; justify-content: center; align-items: center; padding-top : 2%;">' + document.getElementById('pendingstartMonth').value + ' To ' + document.getElementById('pendingendMonth').value + '</h5>';
        tableHTML += '<div style="display: flex; justify-content: center; align-items: center; padding: 5%;">'; // Center the content vertically and horizontally
        tableHTML += '<table class = "table table-borderless table-striped table-earning ">';
        tableHTML += '<thead  class = "table-header"><tr><th>ID</th><th>Name</th><th>Email</th><th>MobileNo</th></tr></thead>';
        tableHTML += '<tbody>';

        data.forEach(function (item, index) {

            tableHTML += '<tr class =  ' + (index % 2 === 0 ? 'even-row' : 'odd-row') + ';">';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.UnitID + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.Name + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.Email + '</td>';
            tableHTML += '<td style="border: 1px solid #000; padding: 8px; color: #000;">' + item.MobileNo + '</td>';
           
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        tableHTML += '</div>';

        // Generate and download the PDF
        html2pdf(tableHTML);
    }
    $('#btnDownloadReport').click(function () {
        $('#dateRangeModal').modal('show');
    });

    // Handle download button click inside the modal
    $("#downloadButton").on("click", function () {
        // Get the selected start and end months

        var startMonth = $("#startMonth").val().split('-');
        console.log(startMonth);// split to separate year and month
        var endMonth = $("#endMonth").val().split('-'); // split to separate year and month


        // Make an AJAX call to fetch data based on the month range
        $.ajax({
            url: `http://localhost:62416/api/Admin/GetMaintancebyMonth/${startMonth[1]}/${endMonth[1]}`,
            type: "GET",

            success: function (data) {
                // Once the data is fetched, generate and download the PDF
                generateAndDownloadPDF(data);
            },
            error: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    });


    function fetchMaintenanceData(url) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (maintenanceData) {
                // Display maintenance details
                const tableBody = document.getElementById('maintenance-table-body');
                const tableHeaders = generateTableHeaders(maintenanceData);

                // Clear existing headers and rows
                tableBody.innerHTML = '';

                const table = document.getElementById('maintenance-table');
                const thead = document.getElementById('maintenance-table-thead');
                thead.innerHTML = ''; // Clear existing headers

                const headerRow = document.createElement('tr');

                // Exclude last two columns and headers if the URL is 'pending'
                const filteredTableHeaders = url.includes('PendingMaintenance') ? tableHeaders.slice(0, -2) : tableHeaders;

                filteredTableHeaders.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                headerRow.classList.add('table-header'); // Add class for styling

                maintenanceData.forEach((maintenance, index) => {
                    const row = document.createElement('tr');

                    // Exclude last two columns if the URL is 'pending'
                    const filteredMaintenanceData = url.includes('PendingMaintenance') ?
                        Object.keys(maintenance).slice(0, -2).reduce((acc, key) => {
                            acc[key] = maintenance[key];
                            return acc;
                        }, {}) : maintenance;

                    filteredTableHeaders.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = filteredMaintenanceData[header];
                        row.appendChild(td);
                    });

                    // Add even/odd class for alternating row colors
                    row.classList.add(index % 2 === 0 ? 'even-row' : 'odd-row');
                    tableBody.appendChild(row);
                });
            },
            error: function (error) {
                alert('Error fetching maintenance details:', error);
            }
        });
    }

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
        url: 'http://localhost:62416/api/Admin/GetTotalmaintanance',
        success: function (data) {
            $('#total-income').text(data);
        },
        error: function (error) {
            console.error('Error fetching available balance:', error);
            $('#total-income').text('Error');
        }
    });

    function generateTableHeaders(data) {
        if (data.length > 0) {
            return Object.keys(data[0]); // Assuming the keys of the first item in the array represent headers
        } else {
            return [];
        }
    }

    // Initial load: Paid maintenance
    fetchMaintenanceData('http://localhost:62416/api/Admin/ApprovedMaintenance');

    // Button click event for Paid maintenance
    document.getElementById('btnPaid').addEventListener('click', function () {
        fetchMaintenanceData('http://localhost:62416/api/Admin/ApprovedMaintenance');
    });

    // Button click event for Pending maintenance
    document.getElementById('btnPending').addEventListener('click', function () {
        fetchMaintenanceData('http://localhost:62416/api/Admin/PendingMaintenance');
    });
});
