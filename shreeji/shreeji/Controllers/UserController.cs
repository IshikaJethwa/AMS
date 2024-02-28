using EmployeeService.Auth;
using shreeji.Models;
using shreeji.Service;
using System.Collections.Generic;
using System.Web.Http;

namespace shreeji.Controllers
{
    public class UserController : ApiController
    {
        private readonly UserService _userService;
        private readonly ComplaintService _complaintService;
        private readonly BookingService _bookingService;
        private readonly MaintenanceService _maintenanceService;
        private readonly NotificationService _notificationService;

        public UserController()
        {
            _userService = new UserService();
            _complaintService = new ComplaintService();
            _bookingService = new BookingService(); 
            _maintenanceService = new MaintenanceService();
            _notificationService = new NotificationService();
        }

        [HttpGet]
        [Route("api/User/{id}")]
       // [BLBasicAuthentication]
        public IHttpActionResult GetUserProfile(int id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut]
        [Route("api/User/{id}")]
        public IHttpActionResult UpdateUserProfile(int id, [FromBody] User updatedUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != updatedUser.UserID_id)
            {
                return BadRequest();
            }

            _userService.UpdateUser(id, updatedUser);

            return Ok(updatedUser); 
        }

        [HttpPost]
        [Route("api/User/SubmitComplaint")]
        public IHttpActionResult SubmitComplaint([FromBody] Complaint complaint)
        {
            // Implement logic to submit a complaint
            _complaintService.AddComplaint(complaint);

            return Ok("Complaint submitted successfully");
        }

        [HttpGet]
        [Route("api/User/CheckComplaintStatus/{id}")]
        public IHttpActionResult CheckComplaintStatus(int id)
        {
            // Implement logic to check the status of a complaint by ID
            var complaintStatus = _complaintService.GetComplaintStatus(id);

            return Ok($"Complaint status: {complaintStatus}");
        }
        [HttpGet]
        [Route("api/User/GetAllBooking")]
        public IHttpActionResult GetBooking()
        {
          

            return Ok(_bookingService.GetAllBookings());
        }

        [HttpPost]
        [Route("api/User/PostBooking")]
        public IHttpActionResult PostBooking([FromBody] Booking booking)
        {
            // Implement logic to process a booking
            _bookingService.AddBooking(booking);

            return Ok("Booking submitted successfully");
        }
        [HttpGet]
        [Route("api/User/GetBookingDetails/{id}")]
        public IHttpActionResult GetBookingDetails(int id)
        {

            return Ok(_bookingService.GetBookingById(id));
        }
        [HttpGet]
        [Route("api/User/CheckMaintanace/{unitid}")]
        public IHttpActionResult CheckMaintanace(int unitid)
        {
            return Ok(_maintenanceService.GetMaintenanceByUnitId(unitid));
        }

        [HttpPut]
        [Route("api/User/updateComplaint/{idComplaint}")]
        public IHttpActionResult updateComplaint(int idComplaint , Complaint objcomplaint)
        {
            _complaintService.UpdateComplaint(idComplaint, objcomplaint);
            return Ok();
        }

        [HttpPost]
        [Route("api/User/PayMaintenance")]
        public IHttpActionResult PayMaintenance([FromBody] Maintenance maintenance)
        {
            // Implement logic to process maintenance payment
            _maintenanceService.AddMaintenanceRecord(maintenance);

            return Ok("Maintenance payment successful");
        }

        [HttpGet]
        [Route("api/User/GetExpensesReport")]
        public IHttpActionResult GetExpensesReport()
        {
            // Implement logic to generate and retrieve expenses report
            var expensesReport = _maintenanceService.GenerateExpensesReport();

            return Ok($"Expenses report: {expensesReport}");
        }

        [HttpGet]
        [Route("api/User/GetNotifications/{userId}")]
        public IEnumerable<Notification> GetNotifications(string userId)
        {
            // Implement logic to retrieve notifications for the user
            var notifications = _notificationService.GetNotificationsByUserId(userId);

            return notifications;
        }
    }
}
