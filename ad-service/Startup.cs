using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AdService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages()
                .AddRazorPagesOptions(options =>
                    options.Conventions.AddPageRoute("/ad", "/")
                );
            
            // Register the Swagger services
            // TODO look up a way that swagger recognize razor-pages and resolve xml warnings when building
            services.AddControllers();
            // services.AddMvc();
            // services.AddMvcCore();
            services.AddOpenApiDocument(config =>
                {
                    // Document name (default to: v1)
                    config.DocumentName = "doc";

                    // Document / API version (default to: 1.0.0)
                    config.Version = "1.0.0";

                    // Document title (default to: My Title)
                    config.Title = "Razor Pages with Nswag";

                    // Document description
                    config.Description = "Show available Endpoints";
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
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

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();
            
            // Register the Swagger generator and the Swagger UI middlewares
            app.UseOpenApi();
            app.UseSwaggerUi3();
            
            app.UseEndpoints(endpoints => { endpoints.MapRazorPages(); });
        }
    }
}