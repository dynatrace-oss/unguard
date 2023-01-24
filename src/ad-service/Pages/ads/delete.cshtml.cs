// <copyright company="Dynatrace LLC">
// Copyright 2023 Dynatrace LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// </copyright>

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