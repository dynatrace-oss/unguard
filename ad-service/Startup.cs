using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace AdService
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var apiPath = Environment.GetEnvironmentVariable("API_PATH");
            if (apiPath == null)
            {
                Console.WriteLine("Environment variable API_PATH have to be defined!");
                throw new ArgumentNullException();
            }
            
            services.AddRazorPages()
                .AddRazorPagesOptions(options => 
                    options.Conventions 
                        .AddPageRoute("/ad", Environment.GetEnvironmentVariable("API_PATH"))
                        .AddPageRoute("/ad",  Path.Combine(apiPath, "/ad"))
                        .AddPageRoute("/ads",  Path.Combine(apiPath, "/ads"))
                        .AddPageRoute("/ads/update",  Path.Combine(apiPath, "/ads/update"))
                        .AddPageRoute("/ads/delete",  Path.Combine(apiPath, "/ads/delete"))
                );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, "wwwroot")),
                RequestPath = Environment.GetEnvironmentVariable("API_PATH")
            });
            

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
       
        }
    }
}