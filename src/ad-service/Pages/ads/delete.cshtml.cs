using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using AdService.Model;
using AdService.Pages.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AdService.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class DeleteAd : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        /// <summary>Inject current appEnvironment.</summary>
        ///
        public DeleteAd(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        /// <summary>Endpoint: Deletes the file with the passed attribute name, if existing.</summary>
        ///
        public async Task<IActionResult> OnPostAsync(string fileName)
        {
            var jwt = Request.Cookies["jwt"];
            var response = await UserAuthService.VerifyAdManager(jwt);

            if (response.StatusCode != StatusCodes.Status200OK)
            {
                return response;
            }

            List<AdFile> ads = AdFile.CreateList(_appEnvironment.WebRootPath);

            DeleteImage(ads, fileName);

            return new OkResult();
        }

        /// <summary>Delete file if it exists.</summary>
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