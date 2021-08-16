using System;
using System.IO;
using System.Linq;
using AdService.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SharpCompress.Archives;
using SharpCompress.Archives.Zip;
using SharpCompress.Readers;

namespace AdService.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class UploadAd : PageModel
    {
        private readonly IWebHostEnvironment _appEnvironment;

        /// <summary>Inject current appEnvironment</summary>
        ///
        public UploadAd(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        /// <summary>Endpoint: Uploads and extracts a passed zip file.</summary>
        ///
        public IActionResult OnPost()
        {
            // TODO implement isValid() check and check jwt-role(adManager) in CASP-10416 (because of Frontend Changes) 
            /* Testcase below: tested isValid() function in minikube with success, with frontend sending the jwt as
             * url parameter.
             * Futher todo:
             *  - setup environment variable for user-auth-service url
             *  - create frontend middleware for forwarding jwt to ad service
             *  - if valid, read out parameter of jwt and check for admanager role
            var jwt = Request.Query["jwt"];
            var httpClient = new HttpClient();
            var userAuthServiceURI = new Uri("http://" + "vogelgrippe-user-auth-service" + "/auth/isValid"); // TODO env variable for user-auth
            var payload = "{\"jwt\":\"" + jwt + "\"}";
            var content = new StringContent(payload, Encoding.UTF8, "application/json");

            HttpResponseMessage userAuthServiceResponse;
            try
            {
                userAuthServiceResponse = await httpClient.PostAsync(userAuthServiceURI, content);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new JsonResult(e.Message);
            }

            Console.WriteLine(userAuthServiceResponse);
            return new JsonResult(userAuthServiceResponse);
            */
            try
            {
                if (Request.Form.Files.Count != 1 || !Request.Form.Files[0].FileName.EndsWith(".zip"))
                {
                    return new ObjectResult("Body has to include exactly one zip file!") {StatusCode = 400};
                }
            }
            catch (Exception)
            {
                return new ObjectResult("Incorrect Content-Type") {StatusCode = 400};
            }

            var file = Request.Form.Files[0];
            UploadAndUnzipFile(file);

            return new OkResult();
        }

        /// <summary>Upload Zip file and extract it</summary>
        ///
        private void UploadAndUnzipFile(IFormFile file)
        {
            var filePath = Path.Combine(_appEnvironment.WebRootPath, AdFile.FileFolder, file.FileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            /* vulnerable since ZipArchive.Entries.WriteToDirectory enables writing outside 
             * the destination directory without throwing an error
             * https://snyk.io/vuln/SNYK-DOTNET-SHARPCOMPRESS-60246 */
            using (var archive = ZipArchive.Open(filePath))
            {
                foreach (var entry in archive.Entries.Where(entry => !entry.IsDirectory))
                {
                    entry.WriteToDirectory(Path.Combine(_appEnvironment.WebRootPath, AdFile.FileFolder),
                        new ExtractionOptions()
                        {
                            ExtractFullPath = true,
                            Overwrite = true
                        });
                }
            }

            System.IO.File.Delete(filePath);
        }
    }
}