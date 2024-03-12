using EmployeeService.Auth;
using shreeji.Models;
using shreeji.Service;
using System;
using System.Collections.Generic;
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

        [HttpPut]
        [Route("api/User/ChangePassword/{id}")]
        public IHttpActionResult ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {


            // Call the ChangePassword method from AdminService
            bool passwordChanged = _userService.ChangePassword(id, request.CurrentPassword, request.NewPassword);

            if (passwordChanged)
            {
                return Ok("Password changed successfully");
            }
            else
            {
                return BadRequest("Incorrect current password");
            }
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
            try
            {
                _userService.AddUser(newUser);
                return Ok("Added");
            }
            catch (InvalidOperationException ex)
            {
                // Handle the duplicate entry error
                return BadRequest(ex.Message); // Return a 400 Bad Request status with the error message
            }
            catch (Exception)
            {
                // Handle other exceptions if needed
                return InternalServerError(); // Return a 500 Internal Server Error status
            }
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
        [HttpGet]
        [Route("api/Admin/GetAllExpenses")]
        public IHttpActionResult GetAllExpenses()
        {
            var expensesList = _expensesService.GetAllExpenses();
            return Ok(expensesList);
        }

        [HttpGet]
        [Route("api/Admin/GetExpensesById/{expensesId}")]
        public IHttpActionResult GetExpensesById(int expensesId)
        {
            var expenses = _expensesService.GetExpensesById(expensesId);
            if (expenses != null)
                return Ok(expenses);
            else
                return NotFound(); // Or return BadRequest("Expenses not found");
        }
        [HttpPut]
        [Route("api/Admin/UpdateExpenses")]
        public IHttpActionResult UpdateExpenses([FromBody] Expenses expenses)
        {
            _expensesService.UpdateExpenses(expenses);
            return Ok("Expenses updated successfully");
        }

        [HttpDelete]
        [Route("api/Admin/DeleteExpenses/{expensesId}")]
        public IHttpActionResult DeleteExpenses(int expensesId)
        {
            _expensesService.DeleteExpenses(expensesId);
            return Ok("Expenses deleted successfully");
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

        [HttpGet]
        [Route("api/Admin/GetAvailableBalance")]
        public IHttpActionResult GetAvailableBalance()
        {
            try
            {
                double availableBalance = _expensesService.GetAvailableBalance();
                return Ok($"Available Balance: {availableBalance}");
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting available balance.", ex));
            }
        }

        [HttpGet]
        [Route("api/Admin/GetTotalmaintanance")]
        public IHttpActionResult GetTotalmaintanance()
        {
            try
            {
                double availableBalance = _expensesService.GetTotalMaintanance();
                return Ok($"Total Maintanance Balance: {availableBalance}");
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting available balance.", ex));
            }
        }
        [HttpGet]
        [Route("api/Admin/GetTotalBookingFund")]
        public IHttpActionResult GetTotalBookingFund()
        {
            try
            {
                double availableBalance = _expensesService.GetTotalBookingAmount();
                return Ok($"Total Booking Balance: {availableBalance}");
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting available balance.", ex));
            }
        }

        [HttpGet]
        [Route("api/Admin/GetTotalExpense")]
        public IHttpActionResult GetTotalExpense()
        {
            try
            {
                double availableBalance = _expensesService.GetTotalExpense();
                return Ok($"Total Expense: {availableBalance}");
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting available balance.", ex));
            }
        }

        [HttpGet]
        [Route("api/Admin/GetMaintancebyMonth/{startmonth}/{endmonth}")]
        public IHttpActionResult GetMaintancebyMonth(int startmonth , int endmonth)
        {
            try
            {
             
                return Ok(_maintenanceService.GenerateMaintancebymonth(startmonth, endmonth));
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting available balance.", ex));
            }
        }
        [HttpGet]
        [Route("api/Admin/GetExpensesByStartEndMonth/{startmonth}/{endmonth}")]
        public IHttpActionResult GetExpensesByStartEndMonth(int startMonth, int endMonth)
        {
            try
            {
                // Call the new method from ExpensesService
                IEnumerable<Expenses> expenses = _expensesService.GetExpensesByStartEndMonth(startMonth, endMonth);

                // Return the result
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an error response if needed
                return InternalServerError(ex);
            }
        }


        [HttpGet]
        [Route("api/Expenses/GetTotalFunds")]
        public IHttpActionResult GetTotalFunds()
        {
            try
            {
                // Call the GetTotalFunds method from ExpensesService
                double totalFunds = _expensesService.GetTotalFunds();
                return Ok($"Total Funds: {totalFunds}");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
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
        [HttpGet]
        [Route("api/Admin/GetPendingMaintenanceByMonth/{startmonth}/{endmonth}")]
        public IHttpActionResult GetMaintanceByMonth(int startmonth, int endmonth)
        {
            try
            {
                var maintenanceByMonth = _maintenanceService.GetPendingMaintenanceByMonth(startmonth, endmonth);
                return Ok(maintenanceByMonth);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return InternalServerError(new Exception("Error getting maintenance by month.", ex));
            }
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
