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
        // currently only the Role AD_MANAGER is available
        public IList<string> Roles { get; set; }
        
        
        /// <summary>Parse a given jwt tocken to the JwtPayload object. Return null if paload is invalid. </summary>
        ///
        public static JwtPayload parseJwt(string jwt) {
            try
            {
                var jwtPayloadRaw = jwt.Split('.')[1];
                var jwtPayloadBase64 = jwtPayloadRaw.PadRight(jwtPayloadRaw.Length + (4 - jwtPayloadRaw.Length % 4),'=');
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
            catch (Exception)
            {
                return null;
            }
        }
    }
}