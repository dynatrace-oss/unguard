using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MySql.Data.MySqlClient;

namespace MembershipService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls("http://*:" + Environment.GetEnvironmentVariable("SERVER_PORT"));
                })
                .ConfigureServices((hostContext, services) =>
                {
                    string dbPwd = Environment.GetEnvironmentVariable("MARIADB_PASSWORD");
                    string dbHost = Environment.GetEnvironmentVariable("MARIADB_SERVICE");
                    var connectionString = $"Server={dbHost};Port=3306;Database=memberships;user=root;password={dbPwd}";

                    // Check if MariaDB exists, if not, create it
                    using (var connection = new MySqlConnection(connectionString))
                    {
                        try
                        {
                            connection.Open();
                        }
                        catch (MySqlException)
                        {
                            // Database does not exist, create it
                            CreateMariaDBDatabase(connectionString);
                        }
                    }
                });

        private static void CreateMariaDBDatabase(string connectionString)
        {
            var builder = new MySqlConnectionStringBuilder(connectionString);
            string databaseName = builder.Database;

            // Connection string without database name
            builder.Database = string.Empty;
            string masterConnectionString = builder.ConnectionString;

            using (var masterConnection = new MySqlConnection(masterConnectionString))
            {
                masterConnection.Open();

                // Create database
                using (var command = masterConnection.CreateCommand())
                {
                    command.CommandText = $"CREATE DATABASE IF NOT EXISTS `{databaseName}`";
                    command.ExecuteNonQuery();
                }

                // After creating the database, create the necessary table
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    // Create table
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                        CREATE TABLE IF NOT EXISTS `membership` (
                            `userid` VARCHAR(50) PRIMARY KEY,
                            `membership` VARCHAR(100)
                        )";
                        command.ExecuteNonQuery();
                    }
                }

            }
        }
    }
}
