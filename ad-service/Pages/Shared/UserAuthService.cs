using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace AdService.Pages.Shared
{
    public class UserAuthService : Controller
    {
        
        /// <summary>Checks if a given jwt is valid at the user-auth-service.</summary>
        ///
        public static async Task<HttpStatusCode> UserIsValid(String jwt)
        {
            if (string.IsNullOrEmpty(jwt))
            {
                return HttpStatusCode.BadRequest;
            }
            
            var httpClient = new HttpClient();
            var userAuthServiceUri = new Uri(
                "http://" 
                + Environment.GetEnvironmentVariable("USER_AUTH_SERVICE_ADDRESS") 
                + "/auth/isValid");
            var payload = "{\"jwt\":\"" + jwt + "\"}";
            var content = new StringContent(payload, Encoding.UTF8, "application/json");

            HttpResponseMessage userAuthServiceResponse;
            try
            {
                userAuthServiceResponse = await httpClient.PostAsync(userAuthServiceUri, content);
            }
            catch (Exception e)
            {
                return HttpStatusCode.Unauthorized;
            }

            if (userAuthServiceResponse.StatusCode != HttpStatusCode.OK)
            {
                return HttpStatusCode.Unauthorized;
            }
            else
            {
                return HttpStatusCode.OK;
            }
        }
    }
}