using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;

namespace shreeji.Service
{
    public class BookingService
    {
       

        public IEnumerable<Booking> GetAllBookings()
        {
            List<Booking> bookings = new List<Booking>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM booking", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            bookings.Add(new Booking
                            {
                                BookingID = Convert.ToInt32(reader["BookingID"]),
                                User_ID = Convert.ToInt32(reader["User_ID"]),
                                PropertyName = reader["PropertyName"].ToString(),
                                Purpose = reader["Purpose"].ToString(),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                StartTime = Convert.ToDateTime(reader["StartTime"]),
                                EndTime = Convert.ToDateTime(reader["EndTime"]),
                                TransactionID = reader["TransactionID"].ToString()
                                // Add other properties as needed
                            });
                        }
                    }
                }
            }

            return bookings;
        }

        public Booking GetBookingById(int id)
        {
            Booking booking = null;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM booking WHERE BookingID = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            booking = new Booking
                            {
                                BookingID = Convert.ToInt32(reader["BookingID"]),
                                User_ID = Convert.ToInt32(reader["User_ID"]),
                                PropertyName = reader["PropertyName"].ToString(),
                                Purpose = reader["Purpose"].ToString(),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                StartTime = Convert.ToDateTime(reader["StartTime"]),
                                EndTime = Convert.ToDateTime(reader["EndTime"]),
                                TransactionID = reader["TransactionID"].ToString()
                                // Add other properties as needed
                            };
                        }
                    }
                }
            }

            return booking;
        }

        public void AddBooking(Booking booking)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO booking (User_ID, PropertyName, Purpose, Amount, StartTime, EndTime, TransactionID) VALUES (@userId, @propertyName, @purpose, @amount, @startTime, @endTime, @transactionId)", connection))
                {
                    cmd.Parameters.AddWithValue("@userId", booking.User_ID);
                    cmd.Parameters.AddWithValue("@propertyName", booking.PropertyName);
                    cmd.Parameters.AddWithValue("@purpose", booking.Purpose);
                    cmd.Parameters.AddWithValue("@amount", booking.Amount);
                    cmd.Parameters.AddWithValue("@startTime", booking.StartTime);
                    cmd.Parameters.AddWithValue("@endTime", booking.EndTime);
                    cmd.Parameters.AddWithValue("@transactionId", booking.TransactionID);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateBooking(Booking booking)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE booking SET User_ID = @userId, PropertyName = @propertyName, Purpose = @purpose, Amount = @amount, StartTime = @startTime, EndTime = @endTime, TransactionID = @transactionId WHERE BookingID = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", booking.BookingID);
                    cmd.Parameters.AddWithValue("@userId", booking.User_ID);
                    cmd.Parameters.AddWithValue("@propertyName", booking.PropertyName);
                    cmd.Parameters.AddWithValue("@purpose", booking.Purpose);
                    cmd.Parameters.AddWithValue("@amount", booking.Amount);
                    cmd.Parameters.AddWithValue("@startTime", booking.StartTime);
                    cmd.Parameters.AddWithValue("@endTime", booking.EndTime);
                    cmd.Parameters.AddWithValue("@transactionId", booking.TransactionID);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteBooking(int id)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM booking WHERE BookingID = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public string GenerateBookingReport()
        {
            // Placeholder for report generation logic
            return "Booking report content";
        }
    }
}