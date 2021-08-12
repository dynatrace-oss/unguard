using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AdService.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AdService.Pages
{
    // TODO implement AntiForgeryToken at the Frontend if necessary
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class AdModel : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        public AdModel(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        public async void OnGet() {} // void since razor page(html) will be return automatic

        public async Task<IActionResult> OnPostAsync(string fileName)
        {
            // TODO implement isValid() check and check jwt-role(adManager) in CASP-10416 (because of Frontend Changes)
            // see Ad-Upload/OnGetAsync()
            
            List<AdFile> ads = AdFile.CreateList(_appEnvironment.WebRootPath);

            DeleteImage(ads, fileName);

            return new OkResult();
        }

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

            string path = Path.Combine(AdFile.FileFolder, ads[adIndex].Name);

            Response.Cookies.Append("current_ad", ads[adIndex].Name);
            return path;
        }
    }
}