﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using AdService.Model;
using AdService.Pages.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AdService.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class DeleteAd : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        /// <summary>Inject current appEnvironment</summary>
        ///
        public DeleteAd(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        /// <summary>Endpoint: Delete file if it exists</summary>
        ///
        public async Task<IActionResult> OnPostAsync(string fileName)
        {
            var jwt = Request.Cookies["jwt"];
            
            switch (await @UserAuthService.UserIsValid(jwt))
            {
                case HttpStatusCode.Unauthorized:
                    return new ObjectResult("Incorrect Content-Type") {StatusCode = 400};
                case HttpStatusCode.BadRequest:
                    return new ObjectResult("Access denied!") {StatusCode = 403};
                case HttpStatusCode.OK:
                    // continue
                    break;
                default:
                    return new ObjectResult("Internal Server error!") {StatusCode = 500};
            }

            var payload = JwtPayload.parseJwt(jwt);
            if (payload?.Roles == null || payload.Roles.Count == 0 || !payload.Roles.Contains("AD_MANAGER"))
            {
                return new ObjectResult("Access denied!") {StatusCode = 403};
            }

            List<AdFile> ads = AdFile.CreateList(_appEnvironment.WebRootPath);

            DeleteImage(ads, fileName);

            return new OkResult();
        }

        /// <summary>Delete file if it exists</summary>
        ///
        private void DeleteImage(List<AdFile> availableAds, string deleteFileName)
        {
            if (availableAds.Count == 0)
            {
                return;
            }

            var fileDirPath = Path.Combine(_appEnvironment.WebRootPath, AdFile.FileFolder);

            availableAds.ForEach(ad =>
            {
                if (ad.Name == deleteFileName)
                {
                    System.IO.File.Delete(Path.Combine(fileDirPath, deleteFileName));
                }
            });
        }
    }
}