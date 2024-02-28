using Dapper;
using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EmployeeService
{
    public class BLValidateUSer
    {

        /// <summary>
        /// Validates user login credentials.
        /// </summary>
        /// <param name="username">The username to be validated.</param>
        /// <param name="password">The password to be validated.</param>
        /// <returns>True if the username and password are valid, otherwise false.</returns>
        public static bool isLogin(string role, string username, string password)
        {
            if (role == "Superadmin")
            {
                return GetSuperAdmin().Any(sa => sa.Username.Equals(username) && sa.Password == password);
            }
            else if (role == "Admin")
            {
                return GetAdmin().Any(sa => sa.Username.Equals(username) && sa.Password == password);
            }
            else if (role == "User")
            {
                return GetUser().Any(user => user.User_username.Equals(username) && user.User_Password == password);
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// Get User Role.
        /// </summary>
        /// <param name="username">The username to be validated.</param>
        /// <param name="password">The password to be validated.</param>
        /// <returns>True if the username and password are valid, otherwise false.</returns>
        public static dynamic GetRoles(string role ,string username, string password)
        {
            if (role == "Superadmin")
            {
                return GetSuperAdmin().FirstOrDefault(sa => sa.Username.Equals(username) && sa.Password == password);
            }
            else if (role == "Admin")
            {
                return GetAdmin().FirstOrDefault(sa => sa.Username.Equals(username) && sa.Password == password);
            }
            else if (role == "User")
            {
                return GetUser().FirstOrDefault(user => user.User_username.Equals(username) && user.User_Password == password);
            }
            else
            {
                return false;
            }
            
        }
        public static dynamic GetList(string role, string username, string password)
        {
            using (MySqlConnection objConnection = new MySqlConnection(Connections.connection))
            {
                objConnection.Open();

                if (role == "Superadmin")
                {
                    string query = $"SELECT * FROM superadmin WHERE Username = '{username}' AND Password = '{password}'";

                    // Assuming SuperAdmin is a class that represents the structure of your database table
                    SuperAdmin superAdmin = objConnection.QueryFirstOrDefault<SuperAdmin>(query);

                    return superAdmin;
                }
                else if (role == "Admin")
                {
                    string query = $"SELECT * FROM admin WHERE username = '{username}' AND password = '{password}'";

                    // Assuming Admin is a class that represents the structure of your database table
                    Admin admin = objConnection.QueryFirstOrDefault<Admin>(query);

                    return admin;
                }
                else if (role == "User")
                {
                    string query = $"SELECT * FROM user WHERE User_username = '{username}' AND User_Password = '{password}'";

                    // Assuming User is a class that represents the structure of your database table
                    User user = objConnection.QueryFirstOrDefault<User>(query);

                    return user;
                }
                else
                {
                    // Return an appropriate value or throw an exception for an invalid role
                    return null;
                }
            }
        }

        /// <summary>
        /// Gets a list of sample users.
        /// </summary>
        /// <returns>A list of user objects.</returns>
        public static List<User> GetUser()
        {
            try
            {
                using (MySqlConnection objConnection = new MySqlConnection(Connections.connection))
                {
                    objConnection.Open();
                    string query = "SELECT " +
                                        "*"+
                                 "FROM " +
                                        "User";
                    List<User> lstEmployees = objConnection.Query<User>(query).ToList();

               
                    return lstEmployees;
                }
            }
            catch (Exception)
            {
                return null;
            }
           
        }

        /// <summary>
        /// Gets a list of sample users.
        /// </summary>
        /// <returns>A list of user objects.</returns>
        public static List<Admin> GetAdmin()
        {
            try
            {
                using (MySqlConnection objConnection = new MySqlConnection(Connections.connection))
                {
                    objConnection.Open();
                    string query = "SELECT " +
                                        "*" +
                                 "FROM " +
                                        "admin";
                    List<Admin> lstEmployees = objConnection.Query<Admin>(query).ToList();


                    return lstEmployees;
                }
            }
            catch (Exception)
            {
                return null;
            }

        }
        /// <summary>
        /// Gets a list of sample users.
        /// </summary>
        /// <returns>A list of user objects.</returns>
        public static List<SuperAdmin> GetSuperAdmin()
        {
            try
            {
                using (MySqlConnection objConnection = new MySqlConnection(Connections.connection))
                {
                    objConnection.Open();
                    string query = "SELECT " +
                                        "*" +
                                 "FROM " +
                                        "superadmin";
                    List<SuperAdmin> lstEmployees = objConnection.Query<SuperAdmin>(query).ToList();


                    return lstEmployees;
                }
            }
            catch (Exception)
            {
                return null;
            }

        }

}
}