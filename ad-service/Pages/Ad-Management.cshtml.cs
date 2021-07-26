using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.VisualBasic.CompilerServices;

namespace AdService.Pages
{
    // TODO implement AntiForgeryToken at the Frontend if necessary
    [IgnoreAntiforgeryToken(Order = 1001)] 
    public class Ad_Management : PageModel
    {
        private readonly IHostingEnvironment _appEnvironment;
        public Ad_Management(IHostingEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }
        
        public IActionResult OnGet()
        {
            string imageDirectory =  Path.Combine(_appEnvironment.WebRootPath , "adFolder");
            string[] filePaths = Directory.GetFiles(imageDirectory);
               
            List<Ad> ads = Ad.createList(filePaths);
            return new JsonResult(ads);
        }
        
        public IActionResult OnPost()
        {
            
            var request = Request;
            try
            {
                if (Request.Form.Files.Count == 0)
                {
                    // TODO error handling, send error response
                    return new JsonResult(new UnauthorizedResult(), "TODO: 1");
                }
                var file = Request.Form.Files[0];
                if (file.Length <= 0)
                {
                    return new JsonResult(new Exception("TODO: 2"));
                }
                
                // TODO create one fix folder for copying zip folder and then the files out and delete zip afterwards
                var folderName = Path.Combine(_appEnvironment.WebRootPath, "adFolder", 
                    DateTime.Now.ToString("dd-MM-yyyy_HH-mm-ss"));
                Directory.CreateDirectory(folderName);
                
                var fullPath = Path.Combine(folderName, file.FileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                
                // TODO implement vulnerable zip lib and extract files to folder
                // https://snyk.io/vuln/SNYK-DOTNET-SHARPCOMPRESS-60246 https://github.com/adamhathcock/sharpcompress
                return new JsonResult(new object());
            }
            catch (Exception e)
            {
                return new JsonResult(new Exception("TODO: -1 with msg: " + e.Message));
            }
        }
    }
    
    
    public class Ad
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }

        public static List<Ad> createList(string[] filePath)
        {
            var ads = new List<Ad>();

            foreach (string file in filePath)
            {
                var ad = new Ad();
                ad.Name = Path.GetFileName(file);
                ad.Date = File.GetCreationTime(file);
                ads.Add(ad);
            }

            return ads;
        }
    }
}