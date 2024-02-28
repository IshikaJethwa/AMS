using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using shreeji.Connection;
using shreeji.Models;

namespace shreeji.Service
{
    public class UserService
    {
        public List<User> GetAllUsers()
        {
            List<User> users = new List<User>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM user", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new User
                            {
                                UserID_id = Convert.ToInt32(reader["UserID_id"]),
                                UnitID = Convert.ToInt32(reader["UnitID"]),
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                MobileNo = reader["MobileNo"].ToString(),
                                User_username = reader["User_username"].ToString(),
                                User_Password = reader["User_Password"].ToString()
                                // Add other properties as needed
                            });
                        }
                    }
                }
            }

            return users;
        }

        public User GetUserById(int id)
        {
            User user = null;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM user WHERE UserID_id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new User
                            {
                                UserID_id = Convert.ToInt32(reader["UserID_id"]),
                                UnitID = Convert.ToInt32(reader["UnitID"]),
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                MobileNo = reader["MobileNo"].ToString(),
                                User_username = reader["User_username"].ToString(),
                                User_Password = reader["User_Password"].ToString()
                                // Add other properties as needed
                            };
                        }
                    }
                }
            }

            return user;
        }

        public void AddUser(User user)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO user (UnitID, Name, Email, MobileNo, User_username, User_Password) VALUES (@unitID, @name, @email, @mobileNo, @username, @password)", connection))
                {
                    cmd.Parameters.AddWithValue("@unitID", user.UnitID);
                    cmd.Parameters.AddWithValue("@name", user.Name);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@mobileNo", user.MobileNo);
                    cmd.Parameters.AddWithValue("@username", user.User_username);
                    cmd.Parameters.AddWithValue("@password", user.User_Password);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateUser(int id, User user)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE user SET  Name = @name, Email = @email, MobileNo = @mobileNo WHERE UserID_id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                   
                    cmd.Parameters.AddWithValue("@name", user.Name);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@mobileNo", user.MobileNo);
                    
                  
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteUser(int id)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM user WHERE UserID_id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
