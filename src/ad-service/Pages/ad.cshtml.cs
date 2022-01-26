using System;
using System.IO;
using AdService.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AdService.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class AdModel : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        /// <summary>Inject current appEnvironment.</summary>
        ///
        public AdModel(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        /// <summary>Endpoint: Return Page.</summary>
        ///
        public IActionResult OnGet()
        {
            if (AdFile.FolderIsEmpty(_appEnvironment.WebRootPath))
            {
                return new EmptyResult();
            }

            return Page();
        }


        /// <summary>Returns path to the next image.</summary>
        ///
        public string GetImage()
        {
            var ads = AdFile.CreateList(_appEnvironment.WebRootPath);

            var currentAd = Request.Cookies["current_ad"];

            int adIndex = ads.FindIndex(ad => ad.Name == currentAd);

            if (adIndex == -1)
            {
                adIndex = (new Random()).Next(ads.Count);
            }
            else if (++adIndex >= ads.Count)
            {
                adIndex = 0;
            }

            string path = Flurl.Url.Combine("/", Environment.GetEnvironmentVariable("API_PATH"), AdFile.FileFolder, ads[adIndex].Name);
            
            Response.Cookies.Append("current_ad", ads[adIndex].Name);
            return path;
        }
    }
}