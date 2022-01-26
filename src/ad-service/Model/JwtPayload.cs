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