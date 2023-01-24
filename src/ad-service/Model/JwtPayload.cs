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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Routing.Matching;
using Newtonsoft.Json.Linq;

namespace AdService.Model
{
    public class JwtPayload
    {
        public string Username { get; set; }
        public int UserId { get; set; }
        public IList<string> Roles { get; set; }
        
        
        /// <summary>Parse a given jwt token to the JwtPayload object. Return null if payload is invalid.</summary>
        ///
        public static JwtPayload ParseJwt(string jwt) {
            try
            {
                var jwtPayloadRaw = jwt.Split('.')[1];
                var jwtPayloadBase64 = jwtPayloadRaw;
                // add padding if needed
                if (jwtPayloadBase64.Length % 4 != 0) {
                    jwtPayloadBase64 = jwtPayloadBase64.PadRight(jwtPayloadBase64.Length + (4 - jwtPayloadBase64.Length % 4),'=');
                }

                var jwtPayloadJsonString = Encoding.UTF8.GetString(Convert.FromBase64String(jwtPayloadBase64));
                var jwtPayloadJson = JObject.Parse(jwtPayloadJsonString);
                
                var roles = from role in jwtPayloadJson["roles"].Children()
                    select (string)role;
                
                var payload = new JwtPayload()
                {
                    Username = (string)jwtPayloadJson["username"],
                    UserId = (int)jwtPayloadJson["userid"],
                    Roles = roles.ToList()
                };
                
                return payload;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }
    }
}