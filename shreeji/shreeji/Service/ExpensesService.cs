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

        public string GenerateExpensesReport()
        {
            // Implement logic to generate expenses report (simplified example)
            return "Expenses report content";
        }
    }
}