// <copyright company="Dynatrace LLC">
// Copyright 2023 Dynatrace LLC
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

using Microsoft.AspNetCore.Mvc;
using MembershipService.Persistence;
using MySqlConnector;

namespace MembershipService.Controllers;

[ApiController]
[Route("[controller]-service")]
public class MembershipController : ControllerBase
{

    private readonly ILogger<MembershipController> _logger;
    private readonly MembershipDbService _membershipDbService;

    public MembershipController(ILogger<MembershipController> logger, MembershipDbService membershipDbService)
    {
        _logger = logger;
        _membershipDbService = membershipDbService;
    }

    [HttpGet("{userid}", Name = "FindOne")]
    public async Task<ActionResult<MembershipEntity>> Get(int userid)
    {
      var result = await _membershipDbService.FindOne(userid);
      if (result == default)
      {
        result = new MembershipEntity(userid, "FREE");
      }
      return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<MembershipEntity>> Insert(MembershipEntity dto)
    {
      try
      {
          var id = await _membershipDbService.Insert(dto);
          if (id != null)
            return id;
          else
            return BadRequest();
      }
      catch(MySqlException e)
      {
        _logger.LogError(0, e, "Error while inserting membership");
        return StatusCode(500);
      }
     }
}
