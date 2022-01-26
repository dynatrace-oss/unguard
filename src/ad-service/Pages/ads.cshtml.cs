using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AdService.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AdService.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class Ads : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        /// <summary>Inject current appEnvironment.</summary>
        ///
        public Ads(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        /// <summary>Endpoint: Return available files on server.</summary>
        ///
        public IActionResult OnGet()
        {
            List<AdFile> ads = AdFile.CreateList(_appEnvironment.WebRootPath);
            return new JsonResult(ads);
        }
    }
}