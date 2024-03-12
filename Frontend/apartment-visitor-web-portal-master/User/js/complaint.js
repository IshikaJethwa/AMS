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

    // console.log(sessionStorage.getItem('userid'));
    // Fetch complaint details using AJAX
    fetchComplaintData(sessionStorage.getItem('userid'));

    $("#addComplaintForm ").validate({
        rules: {
            addtitle: {
                required: true,
                minlength: 5, // Example: Minimum length is 5 characters
            },
            adddescription: {
                required: true,
                minlength: 10, // Example: Minimum length is 10 characters
            }
        },
        messages: {
            addtitle: {
                required: "Please enter a title",
                minlength: "Title must be at least 5 characters long",
            },
            adddescription: {
                required: "Please enter a description",
                minlength: "Description must be at least 10 characters long",
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
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            // Log a message when the form is submitted
            console.log("Form submitted");
            // form.submit();
            addComplaint();
        }
    });

    $("#updateComplaintform ").validate({
        rules: {
            addtitle: {
                required: true,
                minlength: 5,
                // Example: Minimum length is 5 characters
            },
            adddescription: {
                required: true,
                minlength: 10,
                // Example: Minimum length is 10 characters
            }
        },
        messages: {
            addtitle: {
                required: "Please enter a title",
                minlength: "Title must be at least 5 characters long",
            },
            adddescription: {
                required: "Please enter a description",
                minlength: "Description must be at least 10 characters long",
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
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            // Log a message when the form is submitted

            // form.submit();
            updateComplaint();

        }
    });
});
var title = document.getElementById('title');
var discription = document.getElementById('description');

title.addEventListener('focusout', function () {
    // Trim spaces only at the beginning and end
    title.value = title.value.trim();
});

discription.addEventListener('focusout', function (event) {
    discription.value = discription.value.trim();

});
var addtitle = document.getElementById('addtitle');
var adddescription = document.getElementById('adddescription');

addtitle.addEventListener('focusout', function () {
    // Trim spaces only at the beginning and end
    addtitle.value = addtitle.value.trim();
});

adddescription.addEventListener('focusout', function (event) {
    adddescription.value = adddescription.value.trim();

});

function fetchComplaintData() {
    userid = sessionStorage.getItem('userid');

    // Make an AJAX call to your API endpoint for fetching complaint data
    fetch(`http://localhost:62416/api/Admin/GetComplaintById/${userid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log(response.json())
            return response.json();
        })
        .then(data =>
            filterComplaints('pending'))
}

function displayComplaints(complaintData) {
    // console.log('Type of complaintData:', typeof complaintData);
    const tableBody = document.getElementById('complaint-table-body');

    tableBody.innerHTML = '';

    for (let i = complaintData.length - 1; i >= 0; i--) {
        const complaint = complaintData[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.idComplaint}</td>
            <td>${complaint.ComplaintTitle}</td>
            <td>${complaint.Description}</td>
            <td>${complaint.Status}</td>
            <td>${complaint.ResolvedBy || 'Not Resolved'}</td>
            <td>
                <button class="btn btn-link" title="View Full Details" onclick="openUpdateModal(${complaint.idComplaint},'${complaint.ComplaintTitle}','${complaint.Description}')">
                    <i class="fa fa-edit fa-1x"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
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
            //console.log(sessionStorage.getItem('userid'));
            const filteredComplaints = data.filter(complaint => complaint.UserId == sessionStorage.getItem('userid'));

            // console.log("filtered", filteredComplaints)
            // Display the filtered complaints
            displayComplaints(filteredComplaints);

            // Hide the "Action" column in the header when Resolved Complaints are displayed
            const actionColumnHeader = document.querySelector('.table thead th:last-child ');


            if (status === 'Resolved') {
                const rows = document.querySelectorAll('.table tbody tr');
                rows.forEach(row => {
                    const lastCell = row.querySelector('td:last-child');
                    if (lastCell) {
                        lastCell.remove();
                    }
                });
                actionColumnHeader.style.display = 'none';

            } else {
                // Show the "Action" column in the header for other statuses
                actionColumnHeader.style.display = '';

            }
        })
        .catch(error => console.error('Error fetching filtered complaint data:', error));
}

var id = 0;

function openUpdateModal(complaintId, title, description) {
    // Implement logic to populate modal fields based on complaintId if needed
    $('#updateModal').modal('show');
    id = complaintId;
    $('#title').val(title);
    $('#description').val(description);
    $('#complaint_id').val(complaintId);

    // console.log(complaintId);
}

function updateComplaint() {
    // Get values from modal fields
    const id = $('#complaint_id').val();
    const Title = $('#title').val().trim();
    const discription = $('#description').val().trim();


    // Make AJAX call to update complaint
    $.ajax({
        url: `http://localhost:62416/api/User/updateComplaint/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ ComplaintTitle: Title, Description: discription }),
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


// Use AJAX or fetch to get user details from the server and update the HTML elements
// Example:
var userid;
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
            userid = user.userId;
            // Update the HTML elements with user details
            // $('#userId').text(user.UserID_id);


            $('#userId').val(user.UserID_id);
            $('#adduserid').val(user.UserID_id);



        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
} else {
    console.error('User data is missing or invalid.');
}
function addComplaint() {
    if ($('#addComplaintForm').valid()) {
        // Get values from modal fields
        const title = $('#addtitle').val().trim();
        const description = $('#adddescription').val().trim();
        const userId = $('#adduserid').val();

        // Make AJAX call to add complaint
        $.ajax({
            url: 'http://localhost:62416/api/User/SubmitComplaint',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                ComplaintTitle: title,
                Description: description,
                UserId: userId
                // Add other fields as needed
            }),
            success: function (data) {
                // Handle success, e.g., refresh complaint data

                // Close the modal
                $('#addComplaintModal').modal('hide');
                alert("Complaint added successfully");
                window.location.href = 'complaint.html';
            },
            error: function (error) {
                console.error('Error adding complaint:', error);
                // Handle error as needed
            }
        });
    }
}