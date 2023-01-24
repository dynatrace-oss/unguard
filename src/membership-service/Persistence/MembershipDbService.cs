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

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MembershipService.Persistence
{
    public sealed class MembershipDbService
    {
        private readonly MariaDbContext _dbContext;

        public MembershipDbService(MariaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MembershipEntity?> FindOne(int userid)
        {
            string query = $@"
                SELECT
                  userid, membership
                FROM
                  membership
                WHERE
                  userid={userid}";
            var res = await _dbContext.membership.FromSqlRaw(query).ToListAsync();
            return res.FirstOrDefault();
        }

        public async Task<MembershipEntity> Insert(MembershipEntity membership)
        {
           string query = $@"INSERT INTO membership (userid,membership) VALUES ({membership.userid},""{membership.membership}"") ON DUPLICATE KEY UPDATE membership=""{membership.membership}""";
           var res = await _dbContext.Database.ExecuteSqlRawAsync(query);
           if (res > 0)
           {
             var id = await _dbContext.membership.FromSqlRaw("SELECT userid, membership FROM membership WHERE userid=" + membership.userid).ToListAsync();
             return id.FirstOrDefault();
           }
           return null;
        }
    }
}
