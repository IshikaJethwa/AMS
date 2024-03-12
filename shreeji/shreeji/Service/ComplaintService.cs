using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;


namespace shreeji.Service
{
    public class ComplaintService
    {

        public void AddComplaint(Complaint complaint)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO complaint (ComplaintTitle, Description, Status, ResolvedBy, UserId) VALUES (@title, @description, @status, @resolvedBy, @userId)", connection))
                {
                    cmd.Parameters.AddWithValue("@title", complaint.ComplaintTitle);
                    cmd.Parameters.AddWithValue("@description", complaint.Description);
                    cmd.Parameters.AddWithValue("@status", complaint.Status);
                    cmd.Parameters.AddWithValue("@resolvedBy", complaint.ResolvedBy);
                    cmd.Parameters.AddWithValue("@userId", complaint.UserId);
                    
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void UpdateComplaint(int id , Complaint complaint)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE complaint SET ComplaintTitle = @title, Description = @description WHERE idComplaint = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@title", complaint.ComplaintTitle);
                    cmd.Parameters.AddWithValue("@description", complaint.Description);
                   
                  

                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public string GetComplaintStatus(int complaintId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT Status FROM complaint WHERE idComplaint = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", complaintId);
                    connection.Open();
                    var status = cmd.ExecuteScalar();
                    return status != null ? status.ToString() : null;
                }
            }
        }
        public void UpdateComplaintStatus(int complaintId, string newStatus, string resolver)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE complaint SET Status = @newStatus , ResolvedBy = @ResolvedBy WHERE idComplaint = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@ResolvedBy", resolver);
                    cmd.Parameters.AddWithValue("@id", complaintId);
                    cmd.Parameters.AddWithValue("@newStatus", newStatus);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public List<Complaint> GetComplaintsByStatus(string status)
        {
            List<Complaint> filteredComplaints = new List<Complaint>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                string query = "SELECT * FROM complaint";

                // If a status is provided, add a WHERE clause to filter by status
                if (!string.IsNullOrEmpty(status))
                {
                    query += $" WHERE Status = '{status}'";
                }

                using (MySqlCommand cmd = new MySqlCommand(query, connection))
                {
                    connection.Open();

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            filteredComplaints.Add(new Complaint
                            {
                                idComplaint = Convert.ToInt32(reader["idComplaint"]),
                                ComplaintTitle = reader["ComplaintTitle"].ToString(),
                                Description = reader["Description"].ToString(),
                                Status = reader["Status"].ToString(),
                                ResolvedBy = reader["ResolvedBy"].ToString(),
                                UserId = Convert.ToInt32(reader["UserId"]),
                               
                            });
                        }
                    }
                }
            }

            return filteredComplaints;
        }

        public List<Complaint> GetComplaint()
        {
            List<Complaint> complaints = new List<Complaint>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM complaint", connection))
                {
                    connection.Open();

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            complaints.Add(new Complaint
                            {
                                idComplaint = Convert.ToInt32(reader["idComplaint"]),
                                ComplaintTitle = reader["ComplaintTitle"].ToString(),
                                Description = reader["Description"].ToString(),
                                Status = reader["Status"].ToString(),
                                ResolvedBy = reader["ResolvedBy"].ToString(),
                                UserId = Convert.ToInt32(reader["UserId"]),
                              
                            });
                        }
                    }
                }
            }

            return complaints;
        }

        public List<Complaint> GetComplaintById(int userId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM complaint WHERE userId = @id", connection))
                {
                    List<Complaint> complaints = new List<Complaint>();
                    cmd.Parameters.AddWithValue("@id", userId);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            complaints.Add(new Complaint
                            {
                                idComplaint = Convert.ToInt32(reader["idComplaint"]),
                                ComplaintTitle = reader["ComplaintTitle"].ToString(),
                                Description = reader["Description"].ToString(),
                                Status = reader["Status"].ToString(),
                                ResolvedBy = reader["ResolvedBy"].ToString(),
                                UserId = Convert.ToInt32(reader["UserId"]),
                                
                            });
                        }

                    }
                    return complaints;
                }
            }

            
        }
        public void CancelBooking(int bookingId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM booking WHERE BookingID = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", bookingId);

                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

    }
}