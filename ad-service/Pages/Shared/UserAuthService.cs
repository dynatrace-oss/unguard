using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AdService.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace AdService.Pages.Shared
{
    public class UserAuthService : Controller
    {
        /// <summary>Checks if a given jwt is valid at the user-auth-service.</summary>
        ///
        public static async Task<IStatusCodeActionResult> IsUserValid(string jwt)
        {
            if (string.IsNullOrEmpty(jwt))
            {
                return new BadRequestObjectResult("JWT token could not be parsed");
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
                Console.WriteLine(e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            if (userAuthServiceResponse.StatusCode != HttpStatusCode.OK)
            {
                return new UnauthorizedResult();
            }
            else
            {
                return new OkResult();
            }
        }

        /// <summary>
        /// Checks if a given jwt is a valid user with Role AD_MANAGER and return a HTTP response accordingly.
        /// If the verification was successful, OkResult() will be returned.
        /// </summary>
        ///
        public static async Task<IStatusCodeActionResult> VerifyAdManager(string jwt)
        {
            var adManagerRole = "AD_MANAGER";
            var response = await @UserAuthService.IsUserValid(jwt);
            switch (response.StatusCode)
            {
                case StatusCodes.Status400BadRequest:
                case StatusCodes.Status401Unauthorized:
                case StatusCodes.Status500InternalServerError:
                    return response;
                case StatusCodes.Status200OK:
                    // continue
                    break;
                default:
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            var payload = JwtPayload.ParseJwt(jwt);
            if (payload?.Roles == null || payload.Roles.Count == 0 || !payload.Roles.Contains(adManagerRole))
            {
                return new StatusCodeResult(StatusCodes.Status403Forbidden);
            }

            return new OkResult();
        }
    }
}