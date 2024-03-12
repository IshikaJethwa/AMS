using MySql.Data.MySqlClient;
using shreeji.Connection;
using shreeji.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace shreeji.Service
{
    public class ExpensesService
    {
       

        public IEnumerable<Expenses> GetAllExpenses()
        {
            List<Expenses> expensesList = new List<Expenses>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM expenses", connection))
                {
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            expensesList.Add(new Expenses
                            {
                                ExpensesId = Convert.ToInt32(reader["ExpensesId"]),
                                Title = reader["Title"].ToString(),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                DateTime = Convert.ToDateTime(reader["DateTime"])
                            });
                        }
                    }
                }
            }

            return expensesList;
        }

        public Expenses GetExpensesById(int expensesId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM expenses WHERE ExpensesId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", expensesId);
                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Expenses
                            {
                                ExpensesId = Convert.ToInt32(reader["ExpensesId"]),
                                Title = reader["Title"].ToString(),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                DateTime = Convert.ToDateTime(reader["DateTime"])
                            };
                        }
                    }
                }
            }

            return null;
        }

        public void AddExpenses(Expenses expenses)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO expenses (Title, Amount, DateTime) VALUES (@title, @amount, @dateTime)", connection))
                {
                    cmd.Parameters.AddWithValue("@title", expenses.Title);
                    cmd.Parameters.AddWithValue("@amount", expenses.Amount);
                    cmd.Parameters.AddWithValue("@dateTime", expenses.DateTime);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateExpenses(Expenses expenses)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("UPDATE expenses SET Title = @title, Amount = @amount, DateTime = @dateTime WHERE ExpensesId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", expenses.ExpensesId);
                    cmd.Parameters.AddWithValue("@title", expenses.Title);
                    cmd.Parameters.AddWithValue("@amount", expenses.Amount);
                    cmd.Parameters.AddWithValue("@dateTime", expenses.DateTime);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public double GetTotalFunds()
        {
            double totalFunds = 0;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT SUM(TotalAmount) AS GrandTotal FROM (\r\n    SELECT SUM(Amount) AS TotalAmount FROM shreeji.maintenance\r\n    UNION ALL\r\n    SELECT SUM(Amount) AS TotalAmount FROM shreeji.booking\r\n) AS Subquery;\r\n", connection))
                {
                    connection.Open();
                    var result = cmd.ExecuteScalar();

                    // Check if the result is not DBNull.Value and convert it to double
                    if (result != DBNull.Value)
                    {
                        totalFunds = Convert.ToDouble(result);
                    }
                }
            }

            return totalFunds;
        }

        public void DeleteExpenses(int expensesId)
        {
            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM expenses WHERE ExpensesId = @id", connection))
                {
                    cmd.Parameters.AddWithValue("@id", expensesId);
                    connection.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public double GetAvailableBalance()
        {
            double totalFunds = GetTotalFunds();

            double totalExpenses = 0;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT SUM(Amount) FROM expenses", connection))
                {
                    connection.Open();
                    var result = cmd.ExecuteScalar();

                    // Check if the result is not DBNull.Value and convert it to double
                    if (result != DBNull.Value)
                    {
                        totalExpenses = Convert.ToDouble(result);
                    }
                }
            }

            double availableBalance = totalFunds - totalExpenses;
            return availableBalance;
        }
        public double GetTotalMaintanance()
        {
          

            double totalMaintanance = 0;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT SUM(Amount) FROM maintenance", connection))
                {
                    connection.Open();
                    var result = cmd.ExecuteScalar();

                    // Check if the result is not DBNull.Value and convert it to double
                    if (result != DBNull.Value)
                    {
                        totalMaintanance = Convert.ToDouble(result);
                    }
                }
            }

          return totalMaintanance;
            
        }

        public double GetTotalBookingAmount()
        {


            double totalBooking = 0;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT SUM(Amount) FROM booking", connection))
                {
                    connection.Open();
                    var result = cmd.ExecuteScalar();

                    // Check if the result is not DBNull.Value and convert it to double
                    if (result != DBNull.Value)
                    {
                        totalBooking = Convert.ToDouble(result);
                    }
                }
            }

            return totalBooking;

        }
        public double GetTotalExpense()
        {
           

            double totalExpenses = 0;

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                using (MySqlCommand cmd = new MySqlCommand("SELECT SUM(Amount) FROM expenses", connection))
                {
                    connection.Open();
                    var result = cmd.ExecuteScalar();

                    // Check if the result is not DBNull.Value and convert it to double
                    if (result != DBNull.Value)
                    {
                        totalExpenses = Convert.ToDouble(result);
                    }
                }
            }

            return totalExpenses;
           
        }

        public IEnumerable<Expenses> GetExpensesByStartEndMonth(int startMonth, int endMonth)
        {
            List<Expenses> expensesList = new List<Expenses>();

            using (MySqlConnection connection = new MySqlConnection(Connections.connection))
            {
                // Modify the SQL query to filter expenses based on start and end months
                string query = "SELECT * FROM expenses WHERE MONTH(DateTime) BETWEEN @startMonth AND @endMonth";
                using (MySqlCommand cmd = new MySqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@startMonth", startMonth);
                    cmd.Parameters.AddWithValue("@endMonth", endMonth);

                    connection.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            expensesList.Add(new Expenses
                            {
                                ExpensesId = Convert.ToInt32(reader["ExpensesId"]),
                                Title = reader["Title"].ToString(),
                                Amount = Convert.ToDouble(reader["Amount"]),
                                DateTime = Convert.ToDateTime(reader["DateTime"])
                            });
                        }
                    }
                }
            }

            return expensesList;
        }

        public string GenerateExpensesReport()
        {
            // Implement logic to generate expenses report (simplified example)
            return "Expenses report content";
        }
    }
}