using System;
using System.ComponentModel.DataAnnotations;

namespace shreeji.Models
{
    public class Login
    {
        public string role { get; set; }
        public string username { get; set; }
        public string password { get; set; }

    }
    public class Admin
    {
       
        public int Admin_Id { get; set; } 
        public string Name { get; set; }
        public string Email { get; set; }
        public double PhoneNo { get; set; }
        public string Username { get; set; }

        public string Password { get; set; }
    }
   
    public class Booking
    {
        public int BookingID { get; set; }
        public int User_ID { get; set; }
        public string PropertyName { get; set; }
        public string Purpose { get; set; }
        public double Amount { get; set; } = 0;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string TransactionID { get; set; } = string.Empty;
        // Add other properties as needed
    }
    public class Visitors
    {
        public int VisitorID { get; set; }
        public string VisitorName { get; set; }
        public string MobileNumber { get; set; }
        public string ApartmentNo { get; set; }
        public string WhomToMeet { get; set; }
        public string ReasonToMeet { get; set; }
        public DateTime EnteringTime { get; set; } = DateTime.Now;
        public DateTime? OutingTime { get; set; }
    }

    public class Complaint
    {
        public int idComplaint { get; set; }
        public string ComplaintTitle { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } = "pending";
        public string ResolvedBy { get; set; }
        public int UserId { get; set; }
      
    }

    public class Floor
    {
        public int FloorId { get; set; }
        public int NoOfUnits { get; set; }
    }
    public class Maintenance
    {
        public int idMaintainance { get; set; }
        public int Unit_ID { get; set; }
     
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTime PaymentDate { get; set; }
        public double Amount { get; set; }
        public string Transaction_ID { get; set; }
    }
    public class Expenses
    {
        public int ExpensesId { get; set; }
        public string Title { get; set; }
        public double Amount { get; set; }
        public DateTime DateTime { get; set; }
    }
    public class Meeting
    {
        public int MeetingId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
    }

    public class Notification
    {
        public int idNotification { get; set; }
        public string FromUser { get; set; }
        public string ToUser { get; set; }
        public string Message { get; set; }
        public DateTime Time { get; set; }
    }

    public class Unit
    {
        public int UnitId { get; set; }
        public int UserId { get; set; }
        public string OwnerName { get; set; }
        public bool IsRental { get; set; }
        public string RentalName { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }


    public class User
    {
        public int UserID_id { get; set; }
        public int UnitID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string User_username { get; set; }   
        public string User_Password { get; set; }
        // Add other properties as needed
    }

    public class SuperAdmin
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

}