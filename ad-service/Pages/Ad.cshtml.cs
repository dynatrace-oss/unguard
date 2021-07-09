using System;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace dotNet_ad_service.Pages
{
    public class AdModel : PageModel
    {
        public bool DebugMode { get; set; }
        
        public void OnGet() //IWebHostEnvironment env )
        {
            if (Environment.GetEnvironmentVariable("DEBUG_MODE").Equals("true"))
            {
                DebugMode = true;
            }
            if (Environment.GetEnvironmentVariable("DEBUG_MODE").Equals("false"))
            {
                DebugMode = false;
            }
            else
            {
                // throw new InvalidCastException();
            }
        }
    }
}