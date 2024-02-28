using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;

namespace shreeji.Service
{
    public class MeetingService
    {
        

        public IEnumerable<Meeting> GetAllMeetings()
        {
            List<Meeting> meetings = new List<Meeting>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM meeting", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            meetings.Add(new Meeting
                            {
                                MeetingId = Convert.ToInt32(reader["MeetingId"]),
                                Title = reader["Title"].ToString(),
                                Description = reader["Description"].ToString(),
                                DateTime = Convert.ToDateTime(reader["DateTime"])
                            });
                        }
                    }
                }
            }

            return meetings;
        }

        public Meeting GetMeetingById(int meetingId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM meeting WHERE MeetingId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", meetingId);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Meeting
                            {
                                MeetingId = Convert.ToInt32(reader["MeetingId"]),
                                Title = reader["Title"].ToString(),
                                Description = reader["Description"].ToString(),
                                DateTime = Convert.ToDateTime(reader["DateTime"])
                            };
                        }
                    }
                }
            }

            return null;
        }

        public void AddMeeting(Meeting meeting)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO meeting (Title, Description, DateTime) VALUES (@title, @description, @dateTime)", connection))
                {
                    cmd.Parameters.AddWithValue("@title", meeting.Title);
                    cmd.Parameters.AddWithValue("@description", meeting.Description);
                    cmd.Parameters.AddWithValue("@dateTime", meeting.DateTime);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateMeeting( int Id, Meeting meeting)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE meeting SET Title = @title, Description = @description, DateTime = @dateTime WHERE MeetingId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", Id);
                    cmd.Parameters.AddWithValue("@title", meeting.Title);
                    cmd.Parameters.AddWithValue("@description", meeting.Description);
                    cmd.Parameters.AddWithValue("@dateTime", meeting.DateTime);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteMeeting(int meetingId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM meeting WHERE MeetingId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", meetingId);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }   
    }
}