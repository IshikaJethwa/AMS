using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;

namespace shreeji.Service
{
    public class NotificationService
    {
       

        public IEnumerable<Notification> GetNotificationsByUserId(string to)
        {
            List<Notification> notifications = new List<Notification>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM notification WHERE ToUser = @ToUser", connection))
                {
                    cmd.Parameters.AddWithValue("@ToUser", to);
                    connection.Open();

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Notification notification = new Notification
                            {
                                idNotification = Convert.ToInt32(reader["idNotification"]),
                                FromUser = reader["FromUser"].ToString(),
                                ToUser = reader["ToUser"].ToString(),
                                Message = reader["Message"].ToString(),
                                Time = Convert.ToDateTime(reader["Time"])
                            };

                            notifications.Add(notification);
                        }
                    }
                }
            }

            return notifications;
        }

        // Add additional methods for CRUD operations on notifications as needed

        public void AddNotification(Notification notification)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO notification (FromUser, ToUser, Message, Time) VALUES (@fromUserId, @toUserId, @message, @time)", connection))
                {
                    cmd.Parameters.AddWithValue("@fromUserId", notification.FromUser);
                    cmd.Parameters.AddWithValue("@toUserId", notification.ToUser);
                    cmd.Parameters.AddWithValue("@message", notification.Message);
                    cmd.Parameters.AddWithValue("@time", notification.Time);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}