using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AdService.Model;
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

        /// <summary>Endpoint: Deletes the file with the passed attribute name, if existing. </summary>
        ///
        public async Task<IActionResult> OnPostAsync(string fileName)
        {
            // TODO implement isValid() check and check jwt-role(adManager) in CASP-10416 (because of Frontend Changes)
            // see upload-ad/OnGetAsync()

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