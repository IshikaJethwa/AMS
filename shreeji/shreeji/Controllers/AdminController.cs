using EmployeeService.Auth;
using shreeji.Models;
using shreeji.Service;
using System.Net;
using System.Runtime.CompilerServices;
using System.Web.Http;


namespace shreeji.Controllers
{
    public class AdminController : ApiController
    {
        private readonly UserService _userService;
        private readonly MaintenanceService _maintenanceService;
        private readonly MeetingService _meetingService;
        private readonly ExpensesService _expensesService;
        private readonly ComplaintService _complaintService;
        private readonly BookingService _bookingService;
        private readonly NotificationService _notificationService;

        public AdminController()
        {
            _userService = new UserService();
            _maintenanceService = new MaintenanceService();
            _meetingService = new MeetingService();
            _expensesService = new ExpensesService();
            _complaintService = new ComplaintService();
            _bookingService = new BookingService();
            _notificationService = new NotificationService();
        }
        //Get All user
        [HttpGet]
        [Route("api/Admin/User")]
       // [BLBasicAuthentication]
       // [BLBasicAuthorization(Roles = "Admin")]
        public IHttpActionResult GetUserProfile()
        {
            var user = _userService.GetAllUsers();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        // User CRUD Endpoints
        [HttpGet]
        [Route("api/Admin/User/{id}")]
        public IHttpActionResult GetUserProfile(int id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPatch]
        [Route("api/Admin/User/{id}")]
        public IHttpActionResult UpdateUserProfile(int id ,[FromBody] User updatedUser)
        {
            _userService.UpdateUser(id,updatedUser);

            return Ok("updated");
        }

        [HttpPost]
        [Route("api/Admin/User")]
        public IHttpActionResult CreateUser([FromBody] User newUser)
        {

            _userService.AddUser(newUser);

            return Ok("Added");
        }

        [HttpDelete]
        [Route("api/Admin/User/{id}")]
        public IHttpActionResult DeleteUser(int id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            _userService.DeleteUser(id);

            return Ok("Deleted");
        }

        // Get Pending Maintainance
        [HttpGet]
        [Route("api/Admin/PendingMaintenance")]
        public IHttpActionResult GetPendingMaintenance()
        {
            var pendingMaintenance = _maintenanceService.GetPendingMaintenance();

            return Ok(pendingMaintenance);
        }

        // Get Approved Maintainance
        [HttpGet]
        [Route("api/Admin/ApprovedMaintenance")]
        public IHttpActionResult GetApprovedMaintenance()
        {
            var approvedMaintenance = _maintenanceService.GetApprovedMaintenance();

            return Ok(approvedMaintenance);
        }
        // Create Meeting
        [HttpGet]
        [Route("api/Admin/GetMeetingID/{id}")]
        public IHttpActionResult GetAllMeetingID(int id)
        {

            return Ok(_meetingService.GetMeetingById(id));
        }
        // Create Meeting
        [HttpGet]
        [Route("api/Admin/GetMeeting")]
        public IHttpActionResult GetAllMeeting()
        {
          
            return Ok(_meetingService.GetAllMeetings());
        }

        // Create Meeting
        [HttpPost]
        [Route("api/Admin/CreateMeeting")]
        public IHttpActionResult CreateMeeting([FromBody] Meeting meeting)
        {
            _meetingService.AddMeeting(meeting);

            return Ok("Meeting created successfully");
        }
        // Create Meeting
        [HttpPut]
        [Route("api/Admin/UpdateMeeting/{id}")]
        public IHttpActionResult UpdateMeeting(int id,[FromBody] Meeting meeting)
        {
            _meetingService.UpdateMeeting(id ,meeting);

            return Ok("Meeting updated successfully");
        }

        [HttpDelete]
        [Route("api/Admin/CancelMeeting/{id}")]
        public IHttpActionResult CancelMeeting(int id)
        {
            _meetingService.DeleteMeeting(id);

            return Ok("Meeting updated successfully");
        }

        // Post Expenses
        [HttpPost]
        [Route("api/Admin/PostExpenses")]
        public IHttpActionResult PostExpenses([FromBody] Expenses expenses)
        {
            _expensesService.AddExpenses(expenses);

            return Ok("Expenses posted successfully");
        }

        // Generate Report Expenses
        [HttpGet]
        [Route("api/Admin/GenerateReportExpenses")]
        public IHttpActionResult GenerateReportExpenses()
        {
            var expensesReport = _expensesService.GenerateExpensesReport();

            return Ok($"Expenses report: {expensesReport}");
        }

        // Generate Report Expenses
        [HttpGet]
        [Route("api/Admin/GetComplaint")]
        public IHttpActionResult GetComplaint()
        {
            var lstcomplaints = _complaintService.GetComplaint();

            return Ok(lstcomplaints);   
        }

        [HttpGet]
        [Route("api/Admin/GetComplaintbyStatus/{status}")]
        public IHttpActionResult GetComplaintbyStatus(string status)
        {
            var filteredComplaints = _complaintService.GetComplaintsByStatus(status);

            return Ok(filteredComplaints);
        }

        [HttpGet]
        [Route("api/Admin/GetComplaintById/{complaintId}")]
        public IHttpActionResult GetComplaintById(int complaintId)
        {
            var complaint = _complaintService.GetComplaintById(complaintId);

            if (complaint != null)
            {
                return Ok(complaint);
            }
            else
            {
                return NotFound(); // Return 404 Not Found if the complaint with the specified ID is not found
            }
        }


        // Update Complaint Status
        [HttpPut]
        [Route("api/Admin/UpdateComplaintStatus/{id}")]
        public IHttpActionResult UpdateComplaintStatus(int id, string status , string resolver )
        {
      
            _complaintService.UpdateComplaintStatus(id, status, resolver);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // Generate Report of Booking
        [HttpGet]
        [Route("api/Admin/GenerateReportBooking")]
        public IHttpActionResult GenerateReportBooking()
        {
            var bookingReport = _bookingService.GenerateBookingReport();

            return Ok($"Booking report: {bookingReport}");
        }

        // Send Notification
        [HttpPost]
        [Route("api/Admin/SendNotification")]
        public IHttpActionResult SendNotification([FromBody] Notification notification)
        {
            _notificationService.AddNotification(notification);

            return Ok("Notification sent successfully");
        }
    }
}
