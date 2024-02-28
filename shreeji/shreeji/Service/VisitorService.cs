using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace shreeji.Service
{
    public class VisitorService
    {
       

        public IEnumerable<Visitors> GetAllVisitors()
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                connection.Open();
                string query = "SELECT * FROM Visitors order by EnteringTime desc";
                MySqlCommand command = new MySqlCommand(query, connection);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    List<Visitors> visitors = new List<Visitors>();
                    while (reader.Read())
                    {
                        Visitors visitor = MapToVisitor(reader);
                        visitors.Add(visitor);
                    }
                    return visitors;
                }
            }
        }

        public Visitors GetVisitorById(int visitorId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                connection.Open();
                string query = "SELECT * FROM Visitors WHERE VisitorID = @VisitorID";
                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@VisitorID", visitorId);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapToVisitor(reader);
                    }
                    return null;
                }
            }
        }
        public void UpdateVisitor(int id ,Visitors visitor)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                connection.Open();
                string query = @"
                UPDATE Visitors
                SET VisitorName = @VisitorName, 
                    MobileNumber = @MobileNumber, 
                    ApartmentNo = @ApartmentNo, 
                    WhomToMeet = @WhomToMeet, 
                    ReasonToMeet = @ReasonToMeet, 
                    
                    OutingTime = @OutingTime
                WHERE VisitorID = @VisitorID
            ";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@VisitorName", visitor.VisitorName);
                command.Parameters.AddWithValue("@MobileNumber", visitor.MobileNumber);
                command.Parameters.AddWithValue("@ApartmentNo", visitor.ApartmentNo);
                command.Parameters.AddWithValue("@WhomToMeet", visitor.WhomToMeet);
                command.Parameters.AddWithValue("@ReasonToMeet", visitor.ReasonToMeet);
         
                command.Parameters.AddWithValue("@OutingTime", visitor.OutingTime ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@VisitorID", id);
                command.ExecuteNonQuery();
            }
        }

        public void DeleteVisitor(int visitorId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                connection.Open();
                string query = "DELETE FROM Visitors WHERE VisitorID = @VisitorID";
                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@VisitorID", visitorId);

                command.ExecuteNonQuery();
            }
        }

        private void SetVisitorParameters(MySqlCommand command, Visitors visitor)
        {
            command.Parameters.AddWithValue("@VisitorName", visitor.VisitorName);
            command.Parameters.AddWithValue("@MobileNumber", visitor.MobileNumber);
            command.Parameters.AddWithValue("@ApartmentNo", visitor.ApartmentNo);
            command.Parameters.AddWithValue("@WhomToMeet", visitor.WhomToMeet);
            command.Parameters.AddWithValue("@ReasonToMeet", visitor.ReasonToMeet);
            command.Parameters.AddWithValue("@EnteringTime", visitor.EnteringTime);
            command.Parameters.AddWithValue("@OutingTime", visitor.OutingTime ?? (object)DBNull.Value);
            
        }

        public void AddVisitor(Visitors visitor)
{
    using (MySqlConnection connection = new MySqlConnection(Connections.connection))
    {
        connection.Open();
        string query = @"
            INSERT INTO Visitors (VisitorName, MobileNumber, ApartmentNo, WhomToMeet, ReasonToMeet, EnteringTime, OutingTime)
            VALUES (@VisitorName, @MobileNumber, @ApartmentNo, @WhomToMeet, @ReasonToMeet, @EnteringTime, @OutingTime);
        ";

        MySqlCommand command = new MySqlCommand(query, connection);
        SetVisitorParameters(command, visitor);

        command.ExecuteNonQuery();
    }
}

        // Add other methods as needed, e.g., AddVisitor, UpdateVisitor, DeleteVisitor

        private Visitors MapToVisitor(MySqlDataReader reader)
        {
            return new Visitors
            {
                VisitorID = (int)reader["VisitorID"],
                VisitorName = reader["VisitorName"].ToString(),
                MobileNumber = reader["MobileNumber"].ToString(),
                ApartmentNo = reader["ApartmentNo"].ToString(),
                WhomToMeet = reader["WhomToMeet"].ToString(),
                ReasonToMeet = reader["ReasonToMeet"].ToString(),
                EnteringTime = (DateTime)reader["EnteringTime"],
                OutingTime = reader["OutingTime"] == DBNull.Value ? null : (DateTime?)reader["OutingTime"]
            };
        }
    }

}