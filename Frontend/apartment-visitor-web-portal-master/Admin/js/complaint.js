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

    // Fetch complaint details using AJAX
    filterComplaints('pending');
});

function fetchComplaintData() {
    // Make an AJAX call to your API endpoint for fetching complaint data
    fetch('http://localhost:62416/api/Admin/GetComplaint')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayComplaints(data))
        .catch(error => console.error('Error fetching complaint data:', error));
}

function displayComplaints(complaintData) {
    const tableBody = document.getElementById('complaint-table-body');
    tableBody.innerHTML = '';
    const reversedComplaintData = complaintData.slice().reverse();
    reversedComplaintData.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${complaint.idComplaint}</td>
                    <td>${complaint.ComplaintTitle}</td>
                    <td>${complaint.Description}</td>
                    <td>${complaint.Status}</td>
                    <td>${complaint.ResolvedBy || 'Not Resolved'}</td>
                    <td>${complaint.UserId}</td>
                    
                    <td>
                        <button class="btn btn-link" title="View Full Details" onclick="updateComplaint(${complaint.idComplaint})">
                            <i class="bi bi-check-circle-fill"></i>
                        </button>

                    </td>
                `;
        tableBody.appendChild(row);
    });
}

function filterComplaints(status) {
    // Fetch complaint data based on the selected status
    fetch(`http://localhost:62416/api/Admin/GetComplaintbyStatus/${status}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the filtered complaints
            displayComplaints(data);

            // Hide the "Action" column in the header when Resolved Complaints are displayed
            const actionColumnHeader = document.querySelector('.table thead th:last-child ');
            //const actionColumnbody = document.querySelector('.table tbody th:last-child ');



            if (status === 'Resolved') {
                const rows = document.querySelectorAll('.table tbody tr');
                rows.forEach(row => {
                    const lastCell = row.querySelector('td:last-child');
                    if (lastCell) {
                        lastCell.remove();
                    }
                });
                actionColumnHeader.style.display = 'none';
                //  actionColumnbody.style.display = 'none';

            } else {
                // Show the "Action" column in the header for other statuses
                actionColumnHeader.style.display = '';
                //actionColumnbody.style.display = '';
            }
        })
        .catch(error => console.error('Error fetching filtered complaint data:', error));
}
// var id = 0;
// function openUpdateModal(complaintId) {
//     // Implement logic to populate modal fields based on complaintId if needed
//     $('#updateModal').modal('show');
//     id = complaintId;

//     //console.log(complaintId);
// }

function updateComplaint(id) {
    // Get values from modal fields
    const status = "Resolved";
    const resolvedBy = sessionStorage.getItem('userid');

    // Make AJAX call to update complaint
    $.ajax({
        url: `http://localhost:62416/api/Admin/UpdateComplaintStatus/${id}?status=${status}&resolver=${resolvedBy}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ Status: status, ResolvedBy: resolvedBy }),
        success: function (data) {
            // Handle success, e.g., refresh complaint data

            // Close the modal
            $('#updateModal').modal('hide');
            alert("update success");
            window.location.href = 'complaint.html';

        },
        error: function (error) {
            console.error('Error updating complaint:', error);
            // Handle error as needed
        }
    });
}