using MySql.Data.MySqlClient;
using shreeji.Models;
using System.Collections.Generic;
using System;
using shreeji.Connection;



namespace shreeji.Service
{
    public class MaintenanceService
    {

        public List<User> GetPendingMaintenance()
        {
            List<User> pendingMaintenance = new List<User>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                UserService _userService = new UserService();
                List<User> users = _userService.GetAllUsers();
                List<Maintenance> maintenances = GetAllMaintenance();
                int currentMonth = DateTime.Now.Month;
                int currentYear = DateTime.Now.Year;

                foreach (User user in users)
                {
                    bool flag = false;
                    foreach (Maintenance m in maintenances)
                    {
                        if (m.Unit_ID == user.UnitID && m.Month == currentMonth && m.Year == currentYear)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false)
                    {
                        pendingMaintenance.Add(user);
                    }
                }
            }
            return pendingMaintenance;
        }


        public List<Maintenance> GetApprovedMaintenance()
        {
            List<Maintenance> aprrovedmaintanace = new List<Maintenance>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                UserService _userService = new UserService();
                List<User> users = _userService.GetAllUsers();
                List<Maintenance> maintenances = GetAllMaintenance();
                int currentMonth = DateTime.Now.Month;
                int currentYear = DateTime.Now.Year;

                foreach (User user in users)
                {

                    foreach (Maintenance m in maintenances)
                    {
                        if (m.Unit_ID == user.UnitID && m.Month == currentMonth && m.Year == currentYear)
                        {
                            aprrovedmaintanace.Add(m);
                            //break;
                        }
                    }

                }
            }
            return aprrovedmaintanace;
        }

        public void AddMaintenanceRecord(Maintenance maintenance)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(Connections.connection))
                {
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO maintenance (Unit_ID,  Month, Year, PaymentDate, Amount, Transaction_ID) VALUES (@unitId, @month, @year, @paymentDate, @amount, @transactionId)", connection))
                    {
                        cmd.Parameters.AddWithValue("@unitId", maintenance.Unit_ID);

                        cmd.Parameters.AddWithValue("@month", maintenance.Month);
                        cmd.Parameters.AddWithValue("@year", maintenance.Year);
                        cmd.Parameters.AddWithValue("@paymentDate", maintenance.PaymentDate);
                        cmd.Parameters.AddWithValue("@amount", maintenance.Amount);
                        cmd.Parameters.AddWithValue("@transactionId", maintenance.Transaction_ID);
                        connection.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception as needed
                Console.WriteLine($"An error occurred while adding maintenance record: {ex.Message}");
                throw; // Optionally rethrow the exception
            }
        }

        public List<Maintenance> GetAllMaintenance()
        {
            List<Maintenance> allMaintenance = new List<Maintenance>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM maintenance", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            allMaintenance.Add(new Maintenance
                            {
                                idMaintainance = Convert.ToInt32(reader["idMaintainance"]),
                                Unit_ID = Convert.ToInt32(reader["Unit_ID"]),

                                Month = Convert.ToInt32(reader["Month"]),
                                Year = Convert.ToInt32(reader["Year"]),
                                PaymentDate = Convert.ToDateTime(reader["PaymentDate"]),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                Transaction_ID = reader["Transaction_ID"].ToString()
                                // Add other properties as needed
                            });
                        }
                    }
                }
            }

            return allMaintenance;
        }

        public List<Maintenance> GetMaintenanceByUnitId(int unitId)
        {
            List<Maintenance> maintenanceList = new List<Maintenance>();

            try
            {
                using (MySqlConnection connection = new MySqlConnection(Connections.connection))
                {
                    using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM maintenance WHERE Unit_ID = @unitId", connection))
                    {
                        cmd.Parameters.AddWithValue("@unitId", unitId);
                        connection.Open();

                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                maintenanceList.Add(new Maintenance
                                {
                                    idMaintainance = Convert.ToInt32(reader["idMaintainance"]),
                                    Unit_ID = Convert.ToInt32(reader["Unit_ID"]),
                                    Month = Convert.ToInt32(reader["Month"]),
                                    Year = Convert.ToInt32(reader["Year"]),
                                    PaymentDate = Convert.ToDateTime(reader["PaymentDate"]),
                                    Amount = Convert.ToDouble(reader["Amount"]),
                                    Transaction_ID = reader["Transaction_ID"].ToString()
                                    // Add other properties as needed
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception as needed
                Console.WriteLine($"An error occurred while fetching maintenance records by Unit_ID: {ex.Message}");
                throw; // Optionally rethrow the exception
            }

            return maintenanceList;
        }


        public string GenerateExpensesReport()
        {
            // Implement logic to generate expenses report (simplified example)
            return "Expenses report content";
        }

        public List<Maintenance> GenerateMaintancebymonth(int startmonth , int endmonth)
        {
            List<Maintenance> allMaintenance = new List<Maintenance>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM maintenance where month between @startmonth and @endmonth", connection))
                {
                    cmd.Parameters.AddWithValue("@startmonth", startmonth);
                    cmd.Parameters.AddWithValue("@endmonth", endmonth);


                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            allMaintenance.Add(new Maintenance
                            {
                                idMaintainance = Convert.ToInt32(reader["idMaintainance"]),
                                Unit_ID = Convert.ToInt32(reader["Unit_ID"]),
                                Month = Convert.ToInt32(reader["Month"]),
                                Year = Convert.ToInt32(reader["Year"]),
                                PaymentDate = Convert.ToDateTime(reader["PaymentDate"]),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                Transaction_ID = reader["Transaction_ID"].ToString()
                                // Add other properties as needed
                            }); ;
                        }
                    }
                }
            }

            return allMaintenance;
        }

        public List<User> GetPendingMaintenanceByMonth(int startMonth, int endMonth)
        {
            List<User> pendingMaintenance = new List<User>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                UserService _userService = new UserService();
                List<User> users = _userService.GetAllUsers();
                List<Maintenance> maintenances = GetMaintenanceByMonthRange(startMonth, endMonth);
                int currentYear = DateTime.Now.Year;

                foreach (User user in users)
                {
                    bool flag = false;
                    foreach (Maintenance m in maintenances)
                    {
                        if (m.Unit_ID == user.UnitID && m.Year == currentYear)
                        {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false)
                    {
                        pendingMaintenance.Add(user);
                    }
                }
            }

            return pendingMaintenance;
        }

        public List<Maintenance> GetMaintenanceByMonthRange(int startMonth, int endMonth)
        {
            List<Maintenance> maintenanceList = new List<Maintenance>();

            try
            {
                using (MySqlConnection connection = new MySqlConnection(Connections.connection))
                {
                    using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM maintenance WHERE Month BETWEEN @startMonth AND @endMonth", connection))
                    {
                        cmd.Parameters.AddWithValue("@startMonth", startMonth);
                        cmd.Parameters.AddWithValue("@endMonth", endMonth);
                        connection.Open();

                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                maintenanceList.Add(new Maintenance
                                {
                                    idMaintainance = Convert.ToInt32(reader["idMaintainance"]),
                                    Unit_ID = Convert.ToInt32(reader["Unit_ID"]),
                                    Month = Convert.ToInt32(reader["Month"]),
                                    Year = Convert.ToInt32(reader["Year"]),
                                    PaymentDate = Convert.ToDateTime(reader["PaymentDate"]),
                                    Amount = Convert.ToDouble(reader["Amount"]),
                                    Transaction_ID = reader["Transaction_ID"].ToString()
                                    // Add other properties as needed
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception as needed
                Console.WriteLine($"An error occurred while fetching maintenance records by month range: {ex.Message}");
                throw; // Optionally rethrow the exception
            }

            return maintenanceList;
        }

    }
}