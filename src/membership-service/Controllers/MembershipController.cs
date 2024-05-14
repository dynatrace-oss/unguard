// <copyright company="Dynatrace LLC">
// Copyright 2024 Dynatrace LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// </copyright>

using System;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;

namespace MembershipService.Controllers
{
  [ApiController]
  [Route("[controller]-service")]
  public class MembershipController : ControllerBase
  {
    private readonly string _connectionString;
    private readonly ILogger<MembershipController> _logger;

    public MembershipController(IConfiguration configuration, ILogger<MembershipController> logger)
    {
      string dbPwd = Environment.GetEnvironmentVariable("MARIADB_PASSWORD");
      string dbHost = Environment.GetEnvironmentVariable("MARIADB_SERVICE");
      _connectionString = $"Server={dbHost};Port=3306;Database=memberships;user=root;password={dbPwd}";
      _logger = logger;
    }

    [HttpGet("{userid}")]
    public async Task<IActionResult> GetMembershipStatus(string userid)
    {
      using (var connection = new MySqlConnection(_connectionString))
      {
        _logger.LogInformation($"GET requested => userid: {userid}");

        await connection.OpenAsync();

        string selectQuery = "SELECT membership FROM membership WHERE userid = " + userid;

        _logger.LogInformation($"Executing query: {selectQuery}");

        using (var selectCmd = new MySqlCommand(selectQuery, connection))
        {
          try
          {
            object result = await selectCmd.ExecuteScalarAsync();
            if (result != null)
            {
              _logger.LogInformation($@"Membership status of userid {userid}: {result}");
              return Ok(result);
            }
            else
            {
              _logger.LogInformation($"Membership status of userid {userid} not found");

              // If no membership entry exists, insert a new one
              string insertQuery = $@"INSERT INTO membership (userid, membership) VALUES ({userid}, ""FREE"")";
              using (var insertCmd = new MySqlCommand(insertQuery, connection))
              {
                int rowsAffected = await insertCmd.ExecuteNonQueryAsync();
                if (rowsAffected > 0)
                {
                  _logger.LogInformation($"Membership status for userid {userid} inserted as 'FREE'");
                  return Ok("FREE");
                }
                else
                {
                  _logger.LogInformation($"Membership status for userid {userid} could not be inserted");
                  return StatusCode((int)HttpStatusCode.InternalServerError);
                }
              }
            }
          }
          catch (Exception ex)
          {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
          }
        }
      }
    }


    [HttpPost("add/{userid}")]
    public async Task<IActionResult> SetMembershipStatus(string userid, [FromForm(Name = "membership")] string membership)
    {
      using (var connection = new MySqlConnection(_connectionString))
      {
        await connection.OpenAsync();

        _logger.LogInformation($"INSERT requested => userid: {userid}, membership: {membership}");

        string query = "INSERT INTO membership (userid, membership) VALUES (" + userid + ",\"" + membership + "\") ON DUPLICATE KEY UPDATE membership = \"" + membership + "\"";

        _logger.LogInformation($"Executing query: {query}");


        using (var cmd = new MySqlCommand(query, connection))
        {
          try
          {
            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
              _logger.LogInformation($"Membership status for userid {userid} updated to {membership}");
              return Ok();
            }
            else
            {
              _logger.LogInformation($"Membership status for userid {userid} could not be updated");
              return StatusCode((int)HttpStatusCode.InternalServerError);
            }
          }
          catch (Exception ex)
          {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
          }
        }
      }
    }
  }
}
