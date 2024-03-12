let meetingData = [];
let currentId = 0;
function fetchMeetingDataAndDisplay(filter) {
    // Make an AJAX call to your API endpoint
    fetch('http://localhost:62416/api/Admin/GetMeeting')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Replace the dummy meeting data with the fetched data
            meetingData = data;

            // Display meetings based on the filter
            displayMeetings(filter);
        })
        .catch(error => console.error('Error fetching meeting data:', error));
}

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

    // Display all meetings by default
    fetchMeetingDataAndDisplay('upcoming');

    // Button click event for upcoming meetings
    document.getElementById('btnUpcoming').addEventListener('click', function () {
        // Fetch meeting data only if not already fetched
        if (!meetingData || meetingData.length === 0) {
            fetchMeetingDataAndDisplay('upcoming');
        } else {
            displayMeetings('upcoming');
        }
    });

    // Button click event for past meetings
    document.getElementById('btnPast').addEventListener('click', function () {
        // Fetch meeting data only if not already fetched
        if (!meetingData || meetingData.length === 0) {
            fetchMeetingDataAndDisplay('past');
        } else {
            displayMeetings('past');
        }
    });

    // Add Meeting button click event
    document.getElementById('btnAddMeeting').addEventListener('click', function () {
        openAddMeetingModal();
    });

    // Download Report button click event
    document.getElementById('btnDownloadReport').addEventListener('click', function () {
        downloadMeetingReport();
    });
});

// Placeholder functions for edit and delete actions
function saveEdit() {
    // Get the edited values from the form
    const editedTitle = document.getElementById('editTitle').value;
    const editedDescription = document.getElementById('editDescription').value;
    const editedDatetime = document.getElementById('editDatetime').value;

    // Create an object with the edited data
    const editedMeetingData = {
        Title: editedTitle,
        Description: editedDescription,
        DateTime: editedDatetime
    };

    // Make an AJAX call to update the meeting data
    $.ajax({
        url: `http://localhost:62416/api/Admin/UpdateMeeting/${currentId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(editedMeetingData),
        success: function (data) {
            // Handle the response from the server (if needed)
            alert('Meeting updated successfully:', data);
            window.location.href = 'meeting.html';

            // You can perform additional actions based on the response

            // Hide the modal after handling the action
            $('#editMeetingModal').modal('hide');

            // Optionally, refresh the meeting data on the page
            fetchMeetingDataAndDisplay('upcoming');
        },
        error: function (error) {
            alert('Error updating meeting:', error);
        }
    });
}

function confirmDelete() {
    // Make an AJAX call to delete the meeting by its ID
    $.ajax({
        url: `http://localhost:62416/api/Admin/CancelMeeting/${currentId}`,
        method: 'DELETE',
        success: function (data) {
            // Handle the response from the server (if needed)
            alert('Meeting deleted successfully:', data);

            // You can perform additional actions based on the response

            // Hide the modal after handling the action
            $('#deleteMeetingModal').modal('hide');
            window.location.href = 'meeting.html';

            // Optionally, refresh the meeting data on the page
            fetchMeetingDataAndDisplay('upcoming');
        },
        error: function (error) {
            alert('Error deleting meeting:', error);
        }
    });
}

function displayMeetings(filter) {
    const tableBody = document.getElementById('meeting-table-body');
    const tableHeaders = document.getElementById('meeting-table-headers');
    const actionHeader = document.getElementById('action-header');

    // Clear existing table content
    tableBody.innerHTML = '';

    meetingData.forEach(meeting => {
        const row = document.createElement('tr');

        const meetingDate = new Date(meeting.DateTime);
        const currentDate = new Date();

        const actionCell = generateActionCell(filter, meetingDate, meeting.MeetingId);

        if ((filter === 'upcoming' && meetingDate > currentDate) ||
            (filter === 'past' && meetingDate <= currentDate)) {
            // Include "Action" column only for upcoming or past meetings
            row.innerHTML = `
                        <td>${meeting.MeetingId}</td>
                        <td>${meeting.Title}</td>
                        <td>${meeting.Description}</td>
                        <td>${meeting.DateTime}</td>
                    `;
            if (actionCell) {
                row.appendChild(actionCell);
            }
        }

        tableBody.appendChild(row);
    });

    // Hide or show the "Action" column header based on the filter
    actionHeader.innerHTML = filter === 'past' ? '' : 'Action';
}

function generateActionCell(filter, meetingDate, meetingId) {
    const currentDate = new Date();
    const td = document.createElement('td');

    if (filter !== 'past' && meetingDate > currentDate) {
        // Edit button
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'mr-2');
        editButton.setAttribute('data-toggle', 'modal');
        editButton.setAttribute('data-target', '#editMeetingModal');
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        // Set the onclick function to fetch meeting details and open the modal
        editButton.onclick = function () {
            getMeetingById(meetingId);
            
        };

        td.appendChild(editButton);

    }

    return td;
}

function openAddMeetingModal() {
    // Redirect to AddMeeting.html or implement modal logic
    window.location.href = 'add-meeting.html';
}

function downloadMeetingReport() {
    // Implement logic for downloading expense report
    alert('Downloading Expense Report');
    // You can redirect to a report generation endpoint or trigger a download
    // For illustration, an alert is shown here
}

function getMeetingById(meetingId) {
    
    // Make an AJAX call to retrieve the details of the meeting by its ID
    $.ajax({
        url: `http://localhost:62416/api/Admin/GetMeetingID/${meetingId}`,
        method: 'GET',
        success: function (data) {
            // Handle the response from the server
            // Update the form in the modal with the retrieved meeting details
            currentId = meetingId;
            $('#editTitle').val(data.Title);
            $('#editDescription').val(data.Description);
            $('#editDatetime').val(data.DateTime);

            // Display the modal
            $('#editMeetingModal').modal('show');
            $.validator.addMethod("datetimeGreaterThanNow", function (value, element) {
                // Get the selected datetime value
                var selectedDatetime = new Date(value);
                // Get the current datetime
                var currentDatetime = new Date();

                // Check if the selected datetime is greater than the current datetime
                return selectedDatetime > currentDatetime;

            }, "Selected datetime must be greater than the current time");

            // jQuery Validation
            $("#editForm").validate({
                rules: {
                    editTitle: {
                        required: true,
                        minlength: 3,
                        maxlength: 50
                    },
                    editDescription: {
                        required: true,
                        minlength: 5,
                        maxlength: 200
                    },
                    editDatetime: {
                        required: true,
                        datetimeGreaterThanNow: true
                        // You can add additional date/time validation rules here
                    }
                },
                messages: {
                    editTitle: {
                        required: "Please enter a title",
                        minlength: "Title must be at least 3 characters",
                        maxlength: "Title cannot exceed 50 characters"
                    },
                    editDescription: {
                        required: "Please enter a description",
                        minlength: "Description must be at least 5 characters",
                        maxlength: "Description cannot exceed 200 characters"
                    },
                    editDatetime: {
                        required: "Please select a date and time",
                        datetimeGreaterThanNow: "Selected datetime must be greater than the current time"

                        // Add custom messages for date/time validation rules
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
                invalidHandler: function (event, validator) {
                    // Log validation errors to the console
                    console.log(validator.errorList);
                },
                submitHandler: function (form) {
                    // Handle the form submission if it passes validation
                    saveEdit();
                }
            });

            var editTitle = document.getElementById('editTitle');


            editTitle.addEventListener('focusout', function () {
                // Trim spaces only at the beginning and end
                editTitle.value = editTitle.value.trim();
            });
            var editDescription = document.getElementById('editDescription');


            editDescription.addEventListener('focusout', function () {
                // Trim spaces only at the beginning and end
                editDescription.value = editDescription.value.trim();
            });

        },
        error: function (error) {
            alert('Error fetching meeting details:', error);
        }
    });
}