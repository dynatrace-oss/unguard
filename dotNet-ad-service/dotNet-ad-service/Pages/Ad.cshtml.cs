using Microsoft.AspNetCore.Mvc.RazorPages;

namespace dotNet_ad_service.Pages
{
    public class AdModel : PageModel
    {
        public string RecourceFolder { get; set; }
        
        public void OnGet()
        {
            RecourceFolder = "/testFolder";
            ViewData["resourcePath"] = RecourceFolder;
        }
    }
}