using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace shreeji.Service
{
    public class AdminService
    {
    
        public IEnumerable<Admin> GetAllAdmins()
        {
            List<Admin> admins = new List<Admin>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM admin", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            admins.Add(new Admin
                            {
                                Admin_Id = Convert.ToInt32(reader["Admin_Id"]),
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                PhoneNo = Convert.ToDouble(reader["PhoneNo"]),
                                Username = reader["Username"].ToString(),
                                Password = reader["Password"].ToString()
                            });
                        }
                    }
                }
            }

            return admins;
        }

        public Admin GetAdminById(int id)
        {
            Admin admin = null;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM admin WHERE Admin_Id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            admin = new Admin
                            {
                                Admin_Id = Convert.ToInt32(reader["Admin_Id"]),
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                PhoneNo = Convert.ToDouble(reader["PhoneNo"]),
                                Username = reader["Username"].ToString(),
                                Password = reader["Password"].ToString()
                            };
                        }
                    }
                }
            }

            return admin;
        }

        public void AddAdmin(Admin admin)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                try
                {
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO admin (Name, Email, PhoneNo, Username, Password) VALUES (@name, @email, @phone, @username, @password)", connection))
                    {
                        cmd.Parameters.AddWithValue("@name", admin.Name);
                        cmd.Parameters.AddWithValue("@email", admin.Email);
                        cmd.Parameters.AddWithValue("@phone", admin.PhoneNo);
                        cmd.Parameters.AddWithValue("@username", admin.Username);
                        cmd.Parameters.AddWithValue("@password", admin.Password);
                        connection.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                catch (MySqlException ex)
                {
                    // Check if the exception is due to a duplicate entry error (error code 1062)
                    if (ex.Number == 1062)
                    {
                        throw new InvalidOperationException("Duplicate entry. The username is already taken.", ex);
                        // You can throw a custom exception or return a message as needed
                    }
                    else
                    {
                        // If it's another type of MySQL exception, rethrow it
                        throw;
                    }
                }
            }
        }

        public void UpdateAdmin(int id ,Admin admin)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE admin SET Name = @name, Email = @email, PhoneNo = @phone WHERE Admin_Id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id",id);
                    cmd.Parameters.AddWithValue("@name", admin.Name);
                    cmd.Parameters.AddWithValue("@email", admin.Email);
                    cmd.Parameters.AddWithValue("@phone", admin.PhoneNo);
                    
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteAdmin(int id)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM admin WHERE Admin_Id = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public bool ChangePassword(int adminId, string currentPassword, string newPassword)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                // Check if the current password is correct
                if (IsCurrentPasswordCorrect(adminId, currentPassword, connection))
                {
                    // Update the password with the new one
                    using (MySqlCommand cmd = new MySqlCommand("UPDATE admin SET Password = @newPassword WHERE Admin_Id = @adminId", connection))
                    {
                        cmd.Parameters.AddWithValue("@adminId", adminId);
                        cmd.Parameters.AddWithValue("@newPassword", newPassword);

                       
                        cmd.ExecuteNonQuery();

                        return true; // Password changed successfully
                    }
                }
                else
                {
                    return false; // Incorrect current password
                }
            }
        }

        private bool IsCurrentPasswordCorrect(int adminId, string currentPassword, MySqlConnection connection)
        {
            using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM admin WHERE Admin_Id = @adminId AND Password = @currentPassword", connection))
            {
                cmd.Parameters.AddWithValue("@adminId", adminId);
                cmd.Parameters.AddWithValue("@currentPassword", currentPassword);

                connection.Open();
                int count = Convert.ToInt32(cmd.ExecuteScalar());

                return count > 0;
            }
        }
    }
}
